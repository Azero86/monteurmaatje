(() => {
  "use strict";

  const state = {
    catalog: null,
    brandId: "",
    deviceId: "",
    tab: "faults",
    faults: [],
    faultSource: null,
    parameters: [],
    parameterSource: null,
    combustion: null,
    diagnostics: null,
    faultCode: "",
    parameterCode: "",
    diagnosticId: "",
    diagnosticStep: "",
    diagnosticActions: [],
    installPrompt: null,
  };

  let knowledgeRefreshPromise = null;
  let lastKnowledgeRefreshAt = 0;
  let deviceLoadController = null;

  const $ = (id) => document.getElementById(id);
  const refs = {
    brand: $("brand"), device: $("device"), deviceGroup: $("deviceGroup"), family: $("familyHint"),
    tabs: $("tabs"), thirdStep: $("thirdStep"), result: $("result"), reset: $("resetButton"),
    dataMessage: $("dataMessage"), p1: $("p1"), p2: $("p2"), p3: $("p3"),
    recordCount: $("recordCount"), install: $("installButton"),
    statusPill: $("statusPill"), statusText: $("statusText"), themeToggle: $("themeToggle"),
  };


  const THEME_KEY = "monteurmaatje-theme";
  function preferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return "light";
  }
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#171513" : "#fffaf6");
    if (refs.themeToggle) {
      const dark = theme === "dark";
      refs.themeToggle.classList.toggle("is-dark", dark);
      refs.themeToggle.setAttribute("aria-label", dark ? "Schakel lichte modus in" : "Schakel donkere modus in");
    }
  }
  applyTheme(preferredTheme());
  refs.themeToggle?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
  const appUrl = (path = "") => new URL(path.replace(/^\/+/, ""), document.baseURI).href;
  const sourceOf = (data, device) => {
    if (data?.source && typeof data.source === "object") return data.source;
    return { title: device?.sourceTitle || "Officiële fabrikantdocumentatie", url: device?.sourceUrl || "" };
  };

  async function loadJson(path, signal) {
    const response = await fetch(appUrl(path), { headers: { accept: "application/json" }, signal });
    if (!response.ok) throw new Error(`Kon ${path} niet laden (${response.status})`);
    return response.json();
  }

  function selectedBrand() { return state.catalog?.brands?.find(b => b.id === state.brandId) || null; }
  function selectedDevice() { return selectedBrand()?.devices?.find(d => d.id === state.deviceId) || null; }
  function availableTabs(device) {
    const tabs = [];
    if (device?.faultsPath) tabs.push(["faults", "Storingscodes"]);
    if (device?.parametersPath) tabs.push(["parameters", "Parameters"]);
    if (device?.combustionPath) tabs.push(["combustion", "Verbranding"]);
    if (device?.diagnosticsPath) tabs.push(["diagnostics", "Diagnose"]);
    return tabs;
  }

  function setOnlineStatus() {
    const online = navigator.onLine;
    refs.statusPill.classList.toggle("offline", !online);
    refs.statusText.textContent = online ? "Kennisbank online" : "Offline beschikbaar";
  }

  function progress() {
    refs.p1.classList.toggle("complete", !!state.brandId);
    refs.p2.classList.toggle("complete", !!state.deviceId);
    const hasThird = state.tab === "faults" ? !!state.faultCode : state.tab === "parameters" ? !!state.parameterCode : state.tab === "diagnostics" ? !!state.diagnosticId : !!state.combustion;
    refs.p3.classList.toggle("complete", hasThird);
    refs.reset.classList.toggle("hidden", !(state.brandId || state.deviceId || hasThird));
  }

  function emptyResult(title, text) {
    refs.result.innerHTML = `<div class="empty-state"><div class="empty-illustration" aria-hidden="true"><div class="boiler-shape"><span></span><b>88</b><i></i></div><div class="search-ring"></div></div><p class="step-label">TECHNISCHE INFORMATIE</p><h2>${esc(title)}</h2><p>${esc(text)}</p><div class="empty-features"><span>✓ Technische informatie</span><span>✓ Gerichte controles</span><span>✓ Mobiel en offline</span></div></div>`;
  }

  function renderBrandOptions() {
    refs.brand.innerHTML = `<option value="">Kies een merk</option>` + (state.catalog?.brands || []).map(b => `<option value="${esc(b.id)}">${esc(b.name)}</option>`).join("");
    refs.brand.disabled = false;
  }

  function renderDeviceOptions() {
    const brand = selectedBrand();
    refs.device.innerHTML = `<option value="">${brand ? "Kies een toesteltype" : "Kies eerst een merk"}</option>` + (brand?.devices || []).map(d => `<option value="${esc(d.id)}">${esc(d.name)}</option>`).join("");
    refs.device.disabled = !brand;
    refs.deviceGroup.classList.toggle("field-muted", !brand);
  }

  function renderTabs() {
    const tabs = availableTabs(selectedDevice());
    refs.tabs.className = `content-tabs tabs-${tabs.length}`;
    refs.tabs.classList.toggle("hidden", tabs.length < 2);
    refs.tabs.innerHTML = tabs.map(([id, label]) => `<button type="button" data-tab="${id}" class="${state.tab === id ? "active" : ""}">${label}</button>`).join("");
    refs.tabs.querySelectorAll("button").forEach(button => button.addEventListener("click", () => {
      state.tab = button.dataset.tab;
      state.faultCode = ""; state.parameterCode = ""; state.diagnosticId = ""; state.diagnosticStep = ""; state.diagnosticActions = [];
      renderTabs(); renderThirdStep(); renderResult(); progress();
    }));
  }

  function thirdSelect(id, label, options, placeholder, value, onChange) {
    refs.thirdStep.innerHTML = `<div class="field-group"><label for="${id}"><span>3</span> ${esc(label)}</label><div class="select-wrap"><select id="${id}"><option value="">${esc(placeholder)}</option>${options}</select><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg></div></div>`;
    const select = $(id); select.value = value || ""; select.addEventListener("change", onChange);
  }

  function renderThirdStep() {
    if (!state.deviceId) { refs.thirdStep.innerHTML = ""; return; }
    if (state.tab === "faults") {
      thirdSelect("fault", "Storingscode", state.faults.map(f => `<option value="${esc(f.code)}">${esc(f.code)} — ${esc(f.title || f.meaning || "")}</option>`).join(""), "Kies een storingscode", state.faultCode, e => { state.faultCode = e.target.value; renderResult(); progress(); });
    } else if (state.tab === "parameters") {
      thirdSelect("parameter", "Parameter", state.parameters.map(p => `<option value="${esc(p.code)}">${esc(p.code)} — ${esc(compactOptionLabel(p.description || ""))}</option>`).join(""), "Kies een parameter", state.parameterCode, e => { state.parameterCode = e.target.value; renderResult(); progress(); });
    } else if (state.tab === "diagnostics") {
      const items = state.diagnostics?.diagnostics || [];
      thirdSelect("diagnostic", "Diagnose", items.map(d => `<option value="${esc(d.id)}">${esc(d.title)}</option>`).join(""), "Kies een diagnose", state.diagnosticId, e => {
        state.diagnosticId = e.target.value;
        const flow = items.find(d => d.id === state.diagnosticId);
        state.diagnosticStep = flow?.startStep || "";
        state.diagnosticActions = [];
        renderResult(); progress();
      });
    } else {
      refs.thirdStep.innerHTML = `<div class="field-group"><label><span>3</span> Verbranding</label><p class="combustion-hint">Officiële afstel- en meetgegevens van de geselecteerde Nederlandse toesteluitvoering.</p></div>`;
    }
  }

  function compactOptionLabel(value, maximumLength = 88) {
    const text = String(value ?? "").replace(/\s+/g, " ").trim();
    if (text.length <= maximumLength) return text;
    return `${text.slice(0, maximumLength - 1).trimEnd()}…`;
  }

  function manualsHtml(device, source) {
    const manuals = Array.isArray(device?.manuals) && device.manuals.length ? device.manuals : (source?.url ? [{ title: source.title || "Officiële handleiding", url: source.url }] : []);
    if (!manuals.length) return "";
    const typeLabels = { installation: "installatiehandleiding", service: "servicehandleiding", user: "gebruikershandleiding" };
    return `<div class="manual-links" aria-label="Officiële documentatie">${manuals.map(m => {
      const action = manuals.length === 1 ? "Open officiële handleiding" : `Open ${typeLabels[m.type] || "officieel document"}`;
      const title = m.title || "Officiële handleiding";
      return `<a href="${esc(m.url)}" target="_blank" rel="noopener noreferrer" title="${esc(title)}" aria-label="${esc(`${action}: ${title} (opent in een nieuw venster)`)}"><span>${esc(action)}</span><b aria-hidden="true">↗</b></a>`;
    }).join("")}</div>`;
  }

  function sourceRow(device, data) {
    const source = sourceOf(data, device);
    return `<div class="source-row"><span>Bron: ${esc(source?.title || device?.sourceTitle || "Officiële fabrikantdocumentatie")}</span>${manualsHtml(device, source)}</div>`;
  }

  function renderFault() {
    const device = selectedDevice(); const fault = state.faults.find(f => String(f.code) === String(state.faultCode));
    if (!fault) return emptyResult("Selecteer de storingscode", "Na je selectie verschijnt hier de betekenis, mogelijke oorzaken en controlevolgorde.");
    const causes = (fault.causes || []).map(c => `<li><span></span><p>${esc(c)}</p></li>`).join("");
    const checks = (fault.checks || []).map((c, i) => `<li><span>${i + 1}</span><p>${esc(c)}</p></li>`).join("");
    refs.result.innerHTML = `<div class="fault-detail"><div class="fault-header"><div><p class="step-label">STORINGSCODE</p><div class="fault-title-row"><span class="code-badge">${esc(fault.code)}</span><h2>${esc(fault.title || fault.meaning)}</h2></div></div></div><div class="detail-grid"><section><p class="section-kicker">BETEKENIS</p><p class="parameter-explanation">${esc(fault.meaning || fault.title)}</p><p class="section-kicker" style="margin-top:26px">MOGELIJKE OORZAKEN</p><ul class="cause-list">${causes || "<li><p>Niet apart vermeld in de fabrikantdocumentatie.</p></li>"}</ul></section><section><p class="section-kicker">CONTROLEVOLGORDE</p><ol class="check-list">${checks || "<li><span>1</span><p>Raadpleeg de officiële handleiding.</p></li>"}</ol></section></div>${fault.note ? `<div class="notice"><strong>Let op</strong><p>${esc(fault.note)}</p></div>` : ""}${sourceRow(device, { source: state.faultSource })}</div>`;
  }

  function displayValue(v, unit) {
    if (v === null || v === "") return "Niet opgegeven";
    if (v === undefined) return "";
    if (Array.isArray(v)) return v.join(" · ");
    return unit ? `${v} ${unit}` : String(v);
  }

  function choiceParts(choice) {
    const text = String(choice ?? "").trim();
    const match = text.match(/^([^=]{1,24}?)\s*=\s*(.+)$/);
    if (match) return { key: match[1].trim(), label: match[2].trim(), raw: text };
    return { key: "", label: text, raw: text };
  }

  function parameterChoices(p) {
    if (Array.isArray(p?.choices) && p.choices.length) return p.choices.map(String);
    const range = String(p?.settingRange || "").trim();
    if (!range) return [];
    if (range.includes(";")) {
      const parts = range.split(";").map(v => v.trim()).filter(Boolean);
      if (parts.length > 1) return parts;
    }
    return [];
  }

  function choiceListHtml(choices) {
    return `<ul class="parameter-choices">${choices.map(choice => {
      const part = choiceParts(choice);
      return part.key
        ? `<li><span class="choice-key">${esc(part.key)}</span><span class="choice-label">${esc(part.label)}</span></li>`
        : `<li><span class="choice-label">${esc(part.label)}</span></li>`;
    }).join("")}</ul>`;
  }

  function factoryMeaning(p, choices) {
    const value = String(p?.factoryDefault ?? "").trim();
    if (!value || !choices.length) return "";
    for (const choice of choices) {
      const part = choiceParts(choice);
      if (part.key && part.key.toLocaleLowerCase("nl-NL") === value.toLocaleLowerCase("nl-NL")) return part.label;
      if (!part.key && part.label.toLocaleLowerCase("nl-NL") === value.toLocaleLowerCase("nl-NL")) return "";
    }
    return "";
  }

  function parameterSettingRows(p, includeCategory = false) {
    const rows = [];
    const choices = parameterChoices(p);
    const meaning = factoryMeaning(p, choices);
    if (p.factoryDefault !== undefined && p.factoryDefault !== null && p.factoryDefault !== "") {
      const value = displayValue(p.factoryDefault, p.unit);
      rows.push(`<div><dt>Fabrieksinstelling</dt><dd><strong class="factory-value">${esc(value)}</strong>${meaning ? `<span class="factory-meaning"> — ${esc(meaning)}</span>` : ""}</dd></div>`);
    }
    if (p.settingRange && !choices.length) {
      rows.push(`<div><dt>Instelbereik</dt><dd>${esc(p.settingRange)}</dd></div>`);
    }
    if (choices.length) {
      rows.push(`<div class="parameter-choices-row"><dt>Keuzes</dt><dd>${choiceListHtml(choices)}</dd></div>`);
    }
    if (includeCategory && p.category) rows.push(`<div><dt>Categorie</dt><dd>${esc(p.category)}</dd></div>`);
    return rows.join("");
  }

  function parameterRows(p) {
    return parameterSettingRows(p, true);
  }

  function parameterExplanationHtml(p) {
    const explanation = String(p.technicalExplanation || p.description || "Geen aanvullende toelichting opgenomen.").trim();
    const note = String(p.note || "").trim();
    const rangeNote = p.settingRange ? `Officieel instelbereik/keuzen: ${p.settingRange}` : "";
    const normalize = value => value.replace(/\s+/g, " ").trim().toLocaleLowerCase("nl-NL");
    const additionalNote = note && normalize(note) !== normalize(rangeNote) ? note : "";
    const content = `<p class="parameter-explanation">${esc(explanation)}</p>${additionalNote ? `<p class="parameter-addition"><strong>Aanvullende informatie</strong>${esc(additionalNote)}</p>` : ""}`;
    if (explanation.length + additionalNote.length <= 300) return content;
    return `<details class="parameter-details"><summary>Bekijk volledige technische toelichting</summary><div>${content}</div></details>`;
  }

  function renderParameter() {
    const device = selectedDevice(); const p = state.parameters.find(x => String(x.code) === String(state.parameterCode));
    if (!p) return emptyResult("Selecteer de parameter", "Na je selectie verschijnen de officiële instelling, bereik en technische toelichting.");
    refs.result.innerHTML = `<div class="fault-detail parameter-detail"><div class="fault-header"><div><p class="step-label">PARAMETER</p><div class="fault-title-row"><span class="code-badge">${esc(p.code)}</span><h2>${esc(p.description || p.code)}</h2></div></div></div><div class="detail-grid"><section><p class="section-kicker">INSTELLING</p><dl class="parameter-list">${parameterRows(p) || "<div><dt>Waarde</dt><dd>Niet opgegeven</dd></div>"}</dl></section><section><p class="section-kicker">TECHNISCHE TOELICHTING</p>${parameterExplanationHtml(p)}</section></div>${sourceRow(device, { source: state.parameterSource })}</div>`;
  }

  function measurementRows(item) {
    const rows = [];
    const add = (name, value) => { if (value !== undefined && value !== null && value !== "") rows.push(`<div><dt>${esc(name)}</dt><dd>${esc(displayValue(value, item.unit && ["Waarde","Minimum","Maximum","Tolerantie"].includes(name) ? item.unit : ""))}</dd></div>`); };
    add("Waarde", item.value); add("Minimum", item.minimum); add("Maximum", item.maximum); add("Tolerantie", item.tolerance); add("Belasting", item.load); add("Modulatie", item.modulation); add("Meetvoorwaarde", item.condition);
    return rows.join("");
  }

  function renderCombustion() {
    const device = selectedDevice(); const c = state.combustion;
    if (!c) return emptyResult("Geen verbrandingsgegevens", "Voor dit toestel zijn geen verbrandingsgegevens opgenomen.");
    const measurements = (c.measurements || []).map(m => `<article class="combustion-item"><h3>${esc(m.label || m.id)}</h3><dl class="parameter-list">${measurementRows(m)}</dl>${m.technicalExplanation ? `<p class="combustion-note">${esc(m.technicalExplanation)}</p>` : ""}</article>`).join("");
    const settings = (c.settings || []).map(s => `<article class="combustion-item"><h3>${esc(s.label || s.id)}</h3><dl class="parameter-list">${measurementRows(s)}</dl>${s.technicalExplanation ? `<p class="combustion-note">${esc(s.technicalExplanation)}</p>` : ""}</article>`).join("");
    const conditions = (c.measurementConditions || []).map((x,i) => `<li><span>${i+1}</span><p>${esc(x)}</p></li>`).join("");
    const notes = (c.notes || []).map(x => `<li><span></span><p>${esc(x)}</p></li>`).join("");
    refs.result.innerHTML = `<div class="fault-detail"><div class="fault-header"><div><p class="step-label">VERBRANDING</p><div class="fault-title-row"><span class="code-badge combustion-badge">O₂ / CO</span><h2>${esc(c.title || device?.name || "Verbranding")}</h2></div></div></div>${measurements ? `<section class="combustion-section"><p class="section-kicker">MEETWAARDEN</p><div class="combustion-grid">${measurements}</div></section>` : ""}${settings ? `<section class="combustion-section combustion-settings"><p class="section-kicker">INSTELLINGEN / TESTSTANDEN</p><div class="combustion-grid">${settings}</div></section>` : ""}<div class="detail-grid"><section><p class="section-kicker">MEETVOLGORDE</p><ol class="check-list">${conditions}</ol></section><section><p class="section-kicker">TECHNISCHE TOELICHTING</p><p class="parameter-explanation">${esc(c.technicalExplanation || "")}</p>${notes ? `<p class="section-kicker" style="margin-top:24px">OPMERKINGEN</p><ul class="cause-list">${notes}</ul>` : ""}</section></div>${sourceRow(device, c)}</div>`;
  }

  function normalizeBranch(branch) {
    if (typeof branch === "string") return { next: branch, actions: [] };
    return { next: branch?.next || "", actions: branch?.actions || [] };
  }

  function renderDiagnostic() {
    const device = selectedDevice(); const flows = state.diagnostics?.diagnostics || []; const flow = flows.find(d => d.id === state.diagnosticId);
    if (!flow) return emptyResult("Kies een diagnose", "Selecteer een klacht om de officiële diagnoseprocedure stap voor stap te doorlopen.");
    const step = flow.steps?.find(s => s.id === state.diagnosticStep) || flow.steps?.find(s => s.id === flow.startStep);
    if (!step) return emptyResult("Diagnose onvolledig", "De geselecteerde diagnose bevat geen geldige vervolgstap.");
    const actions = state.diagnosticActions.length ? `<div class="diag-actions"><strong>Uit te voeren controle</strong><ul>${state.diagnosticActions.map(a => `<li>${esc(a)}</li>`).join("")}</ul></div>` : "";
    const body = step.type === "end" ? `<div class="diag-end">${esc(step.message || "Diagnoseprocedure afgerond.")}</div>` : `<p class="diag-question">${esc(step.question || "Controleer de volgende stap.")}</p><div class="diag-buttons"><button class="diag-yes" type="button" data-answer="yes">Ja</button><button class="diag-no" type="button" data-answer="no">Nee</button></div>`;
    refs.result.innerHTML = `<div class="fault-detail"><div class="fault-header"><div><p class="step-label">DIAGNOSE</p><div class="fault-title-row"><span class="code-badge">?</span><h2>${esc(flow.title)}</h2></div></div></div><div class="diag-card"><p class="section-kicker">${esc(flow.sourceSection ? `PROCEDURE ${flow.sourceSection}` : "STAP VOOR STAP")}</p><div class="diag-section">${actions}${body}</div></div>${sourceRow(device, state.diagnostics)}</div>`;
    refs.result.querySelectorAll("[data-answer]").forEach(btn => btn.addEventListener("click", () => {
      const branch = normalizeBranch(step[btn.dataset.answer]);
      state.diagnosticActions = branch.actions;
      state.diagnosticStep = branch.next || state.diagnosticStep;
      renderDiagnostic();
    }));
  }

  function renderResult() {
    if (!state.brandId) return emptyResult("Begin met het merk", "Na je selectie verschijnt hier direct de beschikbare technische informatie.");
    if (!state.deviceId) return emptyResult("Kies nu het toestel", "Selecteer het juiste toesteltype voor de beschikbare fabrikantgegevens.");
    if (state.tab === "faults") return renderFault();
    if (state.tab === "parameters") return renderParameter();
    if (state.tab === "combustion") return renderCombustion();
    if (state.tab === "diagnostics") return renderDiagnostic();
  }

  async function fetchDeviceBundle(device, signal) {
    const [faults, parameters, combustion, diagnostics] = await Promise.all([
      device.faultsPath ? loadJson(device.faultsPath, signal) : null,
      device.parametersPath ? loadJson(device.parametersPath, signal) : null,
      device.combustionPath ? loadJson(device.combustionPath, signal) : null,
      device.diagnosticsPath ? loadJson(device.diagnosticsPath, signal) : null,
    ]);

    for (const data of [faults, parameters, combustion, diagnostics]) {
      if (data && data.deviceId !== device.id) throw new Error("Toestelgegevens horen niet bij het gekozen toestel");
    }

    return { faults, parameters, combustion, diagnostics };
  }

  function applyDeviceBundle(bundle, { preserveSelection = false } = {}) {
    const diagnosticsChanged = JSON.stringify(state.diagnostics) !== JSON.stringify(bundle.diagnostics);
    state.faults = bundle.faults?.faults || [];
    state.faultSource = bundle.faults?.source || null;
    state.parameters = bundle.parameters?.parameters || [];
    state.parameterSource = bundle.parameters?.source || null;
    state.combustion = bundle.combustion;
    state.diagnostics = bundle.diagnostics;

    if (!preserveSelection) {
      state.faultCode = "";
      state.parameterCode = "";
      state.diagnosticId = "";
      state.diagnosticStep = "";
      state.diagnosticActions = [];
      return;
    }

    // Een technische correctie mag de monteur niet onnodig uit zijn huidige
    // scherm gooien. Selecties blijven staan zolang ze nog in de nieuwe data bestaan.
    if (state.faultCode && !state.faults.some(f => String(f.code) === String(state.faultCode))) state.faultCode = "";
    if (state.parameterCode && !state.parameters.some(p => String(p.code) === String(state.parameterCode))) state.parameterCode = "";

    if (diagnosticsChanged) state.diagnosticActions = [];
    const flows = state.diagnostics?.diagnostics || [];
    const flow = flows.find(d => d.id === state.diagnosticId);
    if (state.diagnosticId && !flow) {
      state.diagnosticId = "";
      state.diagnosticStep = "";
      state.diagnosticActions = [];
    } else if (flow) {
      const stepStillExists = flow.steps?.some(step => step.id === state.diagnosticStep);
      if (!stepStillExists) {
        state.diagnosticStep = flow.startStep || "";
        state.diagnosticActions = [];
      }
    }
  }

  async function loadDeviceData({ preserveSelection = false, silent = false } = {}) {
    const device = selectedDevice();
    if (!device) return;
    if (!silent) refs.dataMessage.classList.add("hidden");
    deviceLoadController?.abort();
    const controller = new AbortController();
    deviceLoadController = controller;

    try {
      const bundle = await fetchDeviceBundle(device, controller.signal);
      if (controller.signal.aborted || selectedDevice()?.id !== device.id) return;
      applyDeviceBundle(bundle, { preserveSelection });
      renderTabs(); renderThirdStep(); renderResult(); progress();
      if (!silent) refs.dataMessage.classList.add("hidden");
    } catch (error) {
      if (error?.name === "AbortError") return;
      if (!silent) {
        refs.dataMessage.textContent = "De gegevens van dit toestel konden niet worden geladen. Controleer de verbinding en probeer opnieuw.";
        refs.dataMessage.classList.remove("hidden");
      }
      console.error(error);
    } finally {
      if (deviceLoadController === controller) deviceLoadController = null;
    }
  }

  async function refreshKnowledgeData({ force = false } = {}) {
    if (!navigator.onLine || !state.catalog) return;

    const now = Date.now();
    // visibilitychange + focus kunnen vrijwel tegelijk afgaan. Eén controle is genoeg.
    if (!force && now - lastKnowledgeRefreshAt < 2500) return knowledgeRefreshPromise;
    if (knowledgeRefreshPromise) return knowledgeRefreshPromise;
    lastKnowledgeRefreshAt = now;

    knowledgeRefreshPromise = (async () => {
      try {
        const currentBrandId = state.brandId;
        const currentDeviceId = state.deviceId;
        const freshCatalog = await loadJson("data/catalog.json");
        state.catalog = freshCatalog;
        refs.recordCount.textContent = state.catalog.recordCount ?? "—";

        // Herbouw de selectors uit de actuele catalogus, maar behoud de huidige
        // keuze als merk/toestel nog bestaat.
        state.brandId = state.catalog.brands?.some(b => b.id === currentBrandId) ? currentBrandId : "";
        renderBrandOptions();
        refs.brand.value = state.brandId;

        const brand = selectedBrand();
        state.deviceId = brand?.devices?.some(d => d.id === currentDeviceId) ? currentDeviceId : "";
        renderDeviceOptions();
        refs.device.value = state.deviceId;

        const device = selectedDevice();
        refs.family.textContent = device?.family || "";
        refs.family.classList.toggle("hidden", !device?.family);

        if (device) {
          await loadDeviceData({ preserveSelection: true, silent: true });
        } else {
          state.faults = []; state.parameters = []; state.combustion = null; state.diagnostics = null;
          state.faultCode = ""; state.parameterCode = ""; state.diagnosticId = ""; state.diagnosticStep = ""; state.diagnosticActions = [];
          refs.tabs.classList.add("hidden"); refs.thirdStep.innerHTML = ""; renderResult(); progress();
        }
      } catch (error) {
        // Bij een tijdelijke netwerkfout blijft de laatst geldige offline-cache actief.
        console.warn("Actuele kennisbankcontrole kon niet worden afgerond", error);
      } finally {
        knowledgeRefreshPromise = null;
      }
    })();

    return knowledgeRefreshPromise;
  }

  refs.brand.addEventListener("change", () => {
    deviceLoadController?.abort();
    state.brandId = refs.brand.value; state.deviceId = ""; state.tab = "faults"; state.faults=[];state.parameters=[];state.combustion=null;state.diagnostics=null;
    renderDeviceOptions(); refs.family.classList.add("hidden"); refs.tabs.classList.add("hidden"); refs.thirdStep.innerHTML=""; renderResult(); progress();
  });

  refs.device.addEventListener("change", async () => {
    state.deviceId = refs.device.value;
    const device = selectedDevice(); const tabs = availableTabs(device); state.tab = tabs[0]?.[0] || "faults";
    refs.family.textContent = device?.family || ""; refs.family.classList.toggle("hidden", !device?.family);
    if (device) await loadDeviceData(); else { refs.tabs.classList.add("hidden"); refs.thirdStep.innerHTML=""; renderResult(); }
    progress();
  });

  refs.reset.addEventListener("click", () => {
    deviceLoadController?.abort();
    state.brandId="";state.deviceId="";state.tab="faults";state.faultCode="";state.parameterCode="";state.diagnosticId="";state.diagnosticStep="";state.diagnosticActions=[];
    refs.brand.value=""; renderDeviceOptions(); refs.family.classList.add("hidden"); refs.tabs.classList.add("hidden"); refs.thirdStep.innerHTML=""; refs.dataMessage.classList.add("hidden"); renderResult(); progress();
  });

  window.addEventListener("online", () => { setOnlineStatus(); refreshKnowledgeData({ force: true }); });
  window.addEventListener("offline", setOnlineStatus);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refreshKnowledgeData();
  });
  window.addEventListener("focus", () => refreshKnowledgeData());
  window.addEventListener("pageshow", () => refreshKnowledgeData());
  window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); state.installPrompt = event; refs.install.classList.remove("hidden"); });
  window.addEventListener("appinstalled", () => { state.installPrompt = null; refs.install.classList.add("hidden"); });
  refs.install.addEventListener("click", async () => { if (!state.installPrompt) return; await state.installPrompt.prompt(); await state.installPrompt.userChoice; state.installPrompt = null; refs.install.classList.add("hidden"); });

  if ("serviceWorker" in navigator) {
    const hadControllerAtStartup = !!navigator.serviceWorker.controller;
    let reloadedForUpdate = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (hadControllerAtStartup && !reloadedForUpdate) {
        reloadedForUpdate = true;
        location.reload();
      }
    });
  }


  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    try {
      const registration = await navigator.serviceWorker.register(appUrl("sw.js?v=10"), { updateViaCache: "none" });
      if (registration.waiting && navigator.serviceWorker.controller) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        installing?.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            installing.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
      registration.update().catch(() => {});
    } catch (error) { console.warn("Serviceworker kon niet worden geregistreerd", error); }
  }


  // Kennis: praktische CV-vermogensrichtwaarde + koppeling aan bestaande parameterdata.
  let heatingPowerKnowledge = null;

  function numberValue(id) {
    const input = document.getElementById(id);
    if (!input) return 0;
    const min = Number(input.min || 0);
    const max = Number(input.max || Number.MAX_SAFE_INTEGER);
    const value = Math.max(min, Math.min(max, Number(input.value) || 0));
    input.value = String(value);
    return value;
  }

  function formatKw(value) {
    return Number(value).toLocaleString("nl-NL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }

  function renderHeatingPowerAdvice() {
    if (!heatingPowerKnowledge) return;
    const radiators = numberValue("powerRadiators");
    const floorZones = numberValue("powerFloorZones");
    const rules = heatingPowerKnowledge.calculator;

    const radiatorKw = radiators * Number(rules.radiatorKw || 0);
    const floorKw = floorZones * Number(rules.floorZoneKw || 0);
    const hasInput = radiators > 0 || floorZones > 0;
    const reserveKw = hasInput ? Number(rules.reserveKw || 0) : 0;
    const total = radiatorKw + floorKw + reserveKw;

    const advice = document.getElementById("powerAdvice");
    const adviceUnit = document.getElementById("powerAdviceUnit");
    const radiatorResult = document.getElementById("powerRadiatorResult");
    const floorResult = document.getElementById("powerFloorResult");
    const reserveResult = document.getElementById("powerReserveResult");

    if (advice) advice.textContent = hasInput ? formatKw(total) : "—";
    if (adviceUnit) adviceUnit.textContent = hasInput ? "kW" : "";
    if (radiatorResult) radiatorResult.textContent = `${formatKw(radiatorKw)} kW`;
    if (floorResult) floorResult.textContent = `${formatKw(floorKw)} kW`;
    if (reserveResult) reserveResult.textContent = hasInput ? `+ ${formatKw(reserveKw)} kW` : "—";

    const linked = document.getElementById("powerLinkedAdvice");
    if (linked) linked.textContent = hasInput ? `${formatKw(total)} kW` : "Nog geen richtwaarde";
  }

  function heatingPowerBrands() {
    if (!state.catalog || !heatingPowerKnowledge) return [];
    const mappedIds = new Set(Object.keys(heatingPowerKnowledge.devices || {}));
    return state.catalog.brands.map(brand => ({
      ...brand,
      devices: (brand.devices || []).filter(device => device.deviceType === "boiler" && mappedIds.has(device.id)),
    })).filter(brand => brand.devices.length);
  }

  function populateHeatingPowerBrands() {
    const brandSelect = document.getElementById("powerBrand");
    if (!brandSelect) return;
    const current = brandSelect.value;
    const brands = heatingPowerBrands();
    brandSelect.innerHTML = `<option value="">Kies een merk</option>${brands.map(
      brand => `<option value="${esc(brand.id)}">${esc(brand.name)}</option>`
    ).join("")}`;
    if (brands.some(brand => brand.id === current)) brandSelect.value = current;
    populateHeatingPowerDevices();
  }

  function populateHeatingPowerDevices() {
    const brandSelect = document.getElementById("powerBrand");
    const deviceSelect = document.getElementById("powerDevice");
    if (!brandSelect || !deviceSelect) return;
    const brand = heatingPowerBrands().find(item => item.id === brandSelect.value);
    deviceSelect.disabled = !brand;
    deviceSelect.innerHTML = `<option value="">${brand ? "Kies een ketel" : "Kies eerst een merk"}</option>${
      (brand?.devices || []).map(device => `<option value="${esc(device.id)}">${esc(device.name)}</option>`).join("")
    }`;
    renderHeatingPowerParameter();
  }

  function installationParameterCard(parameter, device, data, kicker, noteHtml = "") {
    const rowsHtml = parameterSettingRows(parameter, false);
    const source = sourceOf(data, device);
    return `
      <div class="power-parameter-title">
        <div>
          <p class="step-label">${esc(kicker)}</p>
          <div class="power-code-row"><span class="code-badge">${esc(parameter.code)}</span><h4>${esc(parameter.description || parameter.code)}</h4></div>
        </div>
      </div>
      ${rowsHtml ? `<dl class="power-parameter-rows">${rowsHtml}</dl>` : ""}
      ${parameter.technicalExplanation ? `<p class="power-parameter-explanation">${esc(parameter.technicalExplanation)}</p>` : ""}
      ${noteHtml}
      ${source?.url ? `<a class="power-source-link" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">Open officiële handleiding ↗</a>` : ""}
    `;
  }

  async function renderHeatingTemperatureParameter() {
    const result = document.getElementById("powerTemperatureParameterResult");
    const brandId = document.getElementById("powerBrand")?.value || "";
    const deviceId = document.getElementById("powerDevice")?.value || "";
    if (!result) return;

    if (!brandId || !deviceId) {
      result.className = "power-parameter-empty";
      result.textContent = "Kies eerst een ketel. Als de huidige toesteldata een eenduidige maximale CV-aanvoertemperatuur bevat, verschijnt die parameter hier.";
      return;
    }

    const brand = state.catalog?.brands?.find(item => item.id === brandId);
    const device = brand?.devices?.find(item => item.id === deviceId);
    const map = heatingPowerKnowledge?.devices?.[deviceId];
    const code = map?.maxFlowTemperatureCode;

    if (!code || !device?.parametersPath) {
      result.className = "power-parameter-empty";
      result.textContent = "Voor dit toestel is in de huidige dataset geen eenduidige maximale CV-aanvoertemperatuurparameter gekoppeld. MonteurMaatje vult hier niets zelf voor in.";
      return;
    }

    result.className = "power-parameter-card is-loading";
    result.innerHTML = "<p>Temperatuurparameter laden…</p>";

    try {
      const data = await loadJson(device.parametersPath);
      const parameter = (data.parameters || []).find(item => String(item.code) === String(code));
      if (!parameter) throw new Error(`Temperatuurparameter ${code} niet gevonden`);

      result.className = "power-parameter-card";
      result.innerHTML = installationParameterCard(
        parameter,
        device,
        data,
        "MAXIMALE CV-AANVOERTEMPERATUUR",
        `<div class="power-parameter-note"><strong>Let op:</strong> aanvoertemperatuur en maximaal CV-vermogen zijn twee afzonderlijke instellingen. Een lagere aanvoertemperatuur verlaagt niet automatisch de warmtevraag van de woning.</div>`
      );
    } catch (error) {
      result.className = "power-parameter-empty";
      result.textContent = "De temperatuurparameter kon niet worden geladen.";
      console.error(error);
    }
  }

  async function renderHeatingPowerParameter() {
    const result = document.getElementById("powerParameterResult");
    const brandId = document.getElementById("powerBrand")?.value || "";
    const deviceId = document.getElementById("powerDevice")?.value || "";
    if (!result) return;

    if (!brandId || !deviceId) {
      result.className = "power-parameter-empty";
      result.textContent = "Kies merk en ketel. MonteurMaatje toont daarna direct de bestaande parameter waarmee het maximale CV-vermogen wordt ingesteld.";
      return;
    }

    const brand = state.catalog?.brands?.find(item => item.id === brandId);
    const device = brand?.devices?.find(item => item.id === deviceId);
    const map = heatingPowerKnowledge?.devices?.[deviceId];
    if (!device || !map?.parameterCode || !device.parametersPath) {
      result.className = "power-parameter-empty";
      result.textContent = "Voor dit toestel is nog geen eenduidige CV-vermogensparameter gekoppeld.";
      return;
    }

    result.className = "power-parameter-card is-loading";
    result.innerHTML = `<p>Parameter laden…</p>`;

    try {
      const data = await loadJson(device.parametersPath);
      const parameter = (data.parameters || []).find(item => String(item.code) === String(map.parameterCode));
      if (!parameter) throw new Error(`Parameter ${map.parameterCode} niet gevonden`);

      const rowsHtml = parameterSettingRows(parameter, false);
      const source = sourceOf(data, device);
      result.className = "power-parameter-card";
      result.innerHTML = `
        <div class="power-parameter-title">
          <div>
            <p class="step-label">JUISTE TOESTELPARAMETER</p>
            <div class="power-code-row"><span class="code-badge">${esc(parameter.code)}</span><h4>${esc(parameter.description || parameter.code)}</h4></div>
          </div>
        </div>
        ${rowsHtml ? `<dl class="power-parameter-rows">${rowsHtml}</dl>` : ""}
        ${parameter.technicalExplanation ? `<p class="power-parameter-explanation">${esc(parameter.technicalExplanation)}</p>` : ""}
        <div class="power-parameter-note"><strong>Richtwaarde uit calculator:</strong> <span id="powerLinkedAdvice">${document.getElementById("powerAdvice")?.textContent !== "—" ? `${esc(document.getElementById("powerAdvice")?.textContent)} kW` : "Nog geen richtwaarde"}</span><br>Gebruik deze richtwaarde samen met de officiële parameterinformatie; MonteurMaatje rekent geen fabrikantwaarde om als daarvoor geen betrouwbare tabel in de huidige data staat.</div>
        ${source?.url ? `<a class="power-source-link" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">Open officiële handleiding ↗</a>` : ""}
      `;
    } catch (error) {
      result.className = "power-parameter-empty";
      result.textContent = "De parameter kon niet worden geladen. Controleer de verbinding of probeer het toestel opnieuw.";
      console.error(error);
    }
  }

  async function initHeatingPowerKnowledge() {
    try {
      heatingPowerKnowledge = await loadJson("knowledge/heating-power.json");
      populateHeatingPowerBrands();
      renderHeatingPowerAdvice();

      document.getElementById("powerRadiators")?.addEventListener("input", () => {
        renderHeatingPowerAdvice();
        const linked = document.getElementById("powerLinkedAdvice");
        if (linked) linked.textContent = `${document.getElementById("powerAdvice")?.textContent || "—"} kW`;
      });
      document.getElementById("powerFloorZones")?.addEventListener("input", () => {
        renderHeatingPowerAdvice();
        const linked = document.getElementById("powerLinkedAdvice");
        if (linked) linked.textContent = `${document.getElementById("powerAdvice")?.textContent || "—"} kW`;
      });

      document.querySelectorAll("[data-number-target]").forEach(button => {
        button.addEventListener("click", () => {
          const input = document.getElementById(button.dataset.numberTarget);
          if (!input) return;
          input.value = String((Number(input.value) || 0) + Number(button.dataset.numberStep || 0));
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
      });

      document.getElementById("powerBrand")?.addEventListener("change", populateHeatingPowerDevices);
      document.getElementById("powerDevice")?.addEventListener("change", () => { renderHeatingPowerParameter(); renderHeatingTemperatureParameter(); });
    } catch (error) {
      console.warn("Kennis-tool CV-vermogen kon niet worden geladen", error);
      const result = document.getElementById("powerParameterResult");
      if (result) result.textContent = "De kennis-tool kon niet worden geladen.";
    }
  }


  // Tools-overzicht en Elga Ace afsteltool.
  let elgaAceTool = null;
  let xtendEcoTool = null;

  function showTool(tool) {
    const home = document.getElementById("toolsHome");
    const cv = document.getElementById("toolCvView");
    const setup = document.getElementById("toolSetupView");
    const elga = document.getElementById("toolElgaView");
    const xtend = document.getElementById("toolXtendView");
    home?.classList.toggle("hidden-view", !!tool);
    cv?.classList.toggle("hidden-view", tool !== "cv");
    setup?.classList.toggle("hidden-view", tool !== "setup");
    elga?.classList.toggle("hidden-view", tool !== "elga");
    xtend?.classList.toggle("hidden-view", tool !== "xtend");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function elgaDevice() {
    return state.catalog?.brands?.find(b => b.id === "remeha")?.devices?.find(d => d.id === "elga-ace");
  }

  function elgaExplanationBlock(code, parameter, extra) {
    const rowsHtml = parameterSettingRows(parameter, false);
    return `<article class="elga-param-card">
      <div class="elga-param-head"><span class="code-badge">${esc(code)}</span><h3>${esc(extra.title)}</h3></div>
      ${rowsHtml ? `<dl class="power-parameter-rows">${rowsHtml}</dl>` : ""}
      <div class="elga-param-copy"><h4>Wat doet deze?</h4><p>${esc(extra.what)}</p>
      <h4>Effect van aanpassen</h4><p>${esc(extra.effect)}</p>
      <h4>Wanneer aanpassen?</h4><p>${esc(extra.when)}</p></div>
      ${extra.warning ? `<div class="elga-warning"><strong>Let op</strong><p>${esc(extra.warning)}</p></div>` : ""}
    </article>`;
  }

  async function renderElgaTool() {
    if (!elgaAceTool) return;
    const device = elgaDevice();
    if (!device?.parametersPath) return;
    const model = document.getElementById("elgaModel")?.value || "4";
    const modelData = elgaAceTool.models?.[model];
    const flow = document.getElementById("elgaTargetFlow");
    if (flow) flow.textContent = modelData?.targetFlow ?? "—";

    try {
      const data = await loadJson(device.parametersPath);
      const params = data.parameters || [];
      const get = code => params.find(p => String(p.code) === String(code));
      const renderGroup = (group, elementId) => {
        const node = document.getElementById(elementId);
        if (!node) return;
        node.innerHTML = Object.entries(elgaAceTool.parameters)
          .filter(([,extra]) => extra.group === group)
          .map(([code,extra]) => {
            const parameter = get(code);
            if (!parameter) return "";
            let cloned = {...parameter};
            if (code === "HP069" && modelData?.targetFlow) cloned = {...cloned, factoryDefault: `${modelData.targetFlow} l/min`};
            return elgaExplanationBlock(code, cloned, extra);
          }).join("");
      };
      renderGroup("flow", "elgaFlowParams");
      renderGroup("control", "elgaControlParams");
      renderGroup("hybrid", "elgaHybridParams");
    } catch (error) {
      console.error("Elga Ace tool kon parameterdata niet laden", error);
    }
  }


  function xtendDevice() {
    return state.catalog?.brands?.find(b => b.id === "intergas")?.devices?.find(d => d.id === "intergas-xtend-eco");
  }

  async function renderXtendTool() {
    if (!xtendEcoTool) return;
    const device = xtendDevice();
    if (!device?.parametersPath) return;
    try {
      const data = await loadJson(device.parametersPath);
      const params = data.parameters || [];
      const get = code => params.find(p => String(p.code) === String(code));
      const renderGroup = (key, id) => {
        const node = document.getElementById(id);
        if (!node) return;
        node.innerHTML = (xtendEcoTool.groups?.[key] || []).map(code => {
          const p = get(code), x = xtendEcoTool.explanations?.[code];
          if (!p || !x) return "";
          return elgaExplanationBlock(code, p, {title:x[0], what:x[1], effect:x[2], when:x[3], warning:""});
        }).join("");
      };
      renderGroup("hydraulics","xtendHydraulics");
      renderGroup("hybrid","xtendHybrid");
      renderGroup("curve","xtendCurve");
      renderGroup("xtore_setup","xtendXtoreSetup");
      renderGroup("xtore_control","xtendXtoreControl");
    } catch (error) {
      console.error("Xtend Eco tool kon parameterdata niet laden", error);
    }
  }


  function showGuideline(guideline) {
    const home = document.getElementById("guidelinesHome");
    const rogafa = document.getElementById("guidelineRogafaView");
    const co = document.getElementById("guidelineCoView");
    home?.classList.toggle("hidden-view", !!guideline);
    rogafa?.classList.toggle("hidden-view", guideline !== "rogafa");
    co?.classList.toggle("hidden-view", guideline !== "co");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function setupNumber(id) {
    const input = document.getElementById(id);
    if (!input) return 0;
    return Number(String(input.value).replace(",", ".")) || 0;
  }

  function renderSetupRoom() {
    const result = document.getElementById("setupResult");
    if (!result) return;
    const length = setupNumber("setupLength");
    const width = setupNumber("setupWidth");
    const height = setupNumber("setupHeight");
    const load = setupNumber("setupLoad");

    if (!(length > 0 && width > 0 && height > 0 && load > 0)) {
      result.className = "setup-result setup-empty";
      result.innerHTML = `<p class="section-kicker">UITKOMST</p><h3>Vul de ruimte en toestelbelasting in</h3><p>Daarna vergelijkt MonteurMaatje de werkelijke inhoud met 0,2 × nominale belasting.</p>`;
      return;
    }

    const volume = length * width * height;
    const requiredVolume = load * 0.2;
    const sufficient = volume > requiredVolume;
    result.className = `setup-result ${sufficient ? "setup-ok" : "setup-warning"}`;
    result.innerHTML = sufficient
      ? `<p class="section-kicker">UITKOMST</p>
         <h3>✓ Ruimte-inhoud voldoet</h3>
         <dl class="setup-result-list">
           <div><dt>Werkelijke inhoud</dt><dd>${formatKw(volume)} m³</dd></div>
           <div><dt>Grens 0,2 × B</dt><dd>${formatKw(requiredVolume)} m³</dd></div>
         </dl>
         <p>De ruimte is groter dan de berekende grens. Volgens deze NPR-beoordeling is geen aanvullende At/Aa-opening nodig.</p>`
      : `<p class="section-kicker">UITKOMST</p>
         <h3>⚠ Aanvullende ventilatie nodig</h3>
         <dl class="setup-result-list">
           <div><dt>Werkelijke inhoud</dt><dd>${formatKw(volume)} m³</dd></div>
           <div><dt>Grens 0,2 × B</dt><dd>${formatKw(requiredVolume)} m³</dd></div>
           <div><dt>Luchttoevoer At</dt><dd>min. 50 cm² vrij</dd></div>
           <div><dt>Luchtafvoer Aa</dt><dd>min. 50 cm² vrij</dd></div>
         </dl>
         <p>De ruimte is kleiner dan of gelijk aan de berekende grens. Voor jullie HR-ketels t/m 40 kW geldt minimaal 50 cm² vrije doorlaat voor zowel At als Aa.</p>`;
  }

  function routeFromLocation() {
    const raw = location.hash.replace(/^#/, "");
    const aliases = { regulations: "guidelines", knowledge: "tools" };
    return aliases[raw] || raw || "home";
  }

  function baseViewForRoute(route) {
    if (route === "home") return "home";
    if (route.startsWith("guidelines")) return "regulations";
    if (route.startsWith("tools")) return "knowledge";
    return "home";
  }

  function renderRoute(route) {
    const base = baseViewForRoute(route);
    showAppView(base, { updateHistory: false });

    if (base === "knowledge") {
      const tool = route.includes("/") ? route.split("/")[1] : "";
      showTool(tool);
      if (tool === "elga") renderElgaTool();
      if (tool === "xtend") renderXtendTool();
      if (tool === "setup") renderSetupRoom();
    } else {
      showTool("");
    }

    if (base === "regulations") {
      const guideline = route.includes("/") ? route.split("/")[1] : "";
      showGuideline(guideline);
    } else {
      showGuideline("");
    }
  }

  const HISTORY_VERSION = 2;
  let pendingTopRoute = "";

  function routeDepth(route) {
    if (route === "home") return 0;
    if (route === "tools" || route === "guidelines") return 1;
    if (route.startsWith("tools/") || route.startsWith("guidelines/")) return 2;
    return 0;
  }

  function parentRoute(route) {
    if (route.startsWith("tools/")) return "tools";
    if (route.startsWith("guidelines/")) return "guidelines";
    return "home";
  }

  function routeHash(route) {
    return route === "home" ? "#home" : `#${route}`;
  }

  function writeRoute(route, method = "replaceState") {
    history[method]({ mmRoute: route, mmHistoryVersion: HISTORY_VERSION }, "", routeHash(route));
    renderRoute(route);
  }

  function navigateRoute(route) {
    const current = routeFromLocation();
    if (current === route) {
      renderRoute(route);
      return;
    }

    const currentDepth = routeDepth(current);
    const targetDepth = routeDepth(route);

    // Home is altijd de wortel van de interne app-navigatie.
    if (route === "home") {
      if (currentDepth > 0) {
        history.go(-currentDepth);
      } else {
        writeRoute("home");
      }
      return;
    }

    // Hoofdniveau: Home -> push één niveau.
    // Wisselen tussen Tools/Richtlijnen vervangt dat ene niveau,
    // zodat bezochte hoofdpagina's geen lange teruggeschiedenis vormen.
    if (targetDepth === 1) {
      if (currentDepth === 0) {
        writeRoute(route, "pushState");
      } else if (currentDepth === 1) {
        writeRoute(route);
      } else {
        // Vanuit een detail eerst één niveau terug en vervang daarna de ouder.
        if (parentRoute(current) === route) {
          history.back();
        } else {
          pendingTopRoute = route;
          history.back();
        }
      }
      return;
    }

    // Detailpagina: altijd precies boven zijn eigen hoofdniveau.
    const targetParent = parentRoute(route);
    if (targetDepth === 2) {
      if (currentDepth === 0) {
        writeRoute(targetParent, "pushState");
        writeRoute(route, "pushState");
      } else if (currentDepth === 1) {
        if (current !== targetParent) writeRoute(targetParent);
        writeRoute(route, "pushState");
      } else if (parentRoute(current) === targetParent) {
        writeRoute(route);
      } else {
        pendingTopRoute = targetParent;
        history.back();
        // detail wordt na de pending hoofdroute geopend door de gebruiker;
        // zo ontstaat nooit een verborgen extra history-laag.
      }
    }
  }

  async function initTools() {
    document.querySelectorAll("[data-tool-open]").forEach(button => {
      button.addEventListener("click", () => navigateRoute(`tools/${button.dataset.toolOpen}`));
    });
    document.querySelectorAll("[data-tool-back]").forEach(button => {
      button.addEventListener("click", () => history.back());
    });
    document.querySelectorAll("[data-guideline-open]").forEach(button => {
      button.addEventListener("click", () => navigateRoute(`guidelines/${button.dataset.guidelineOpen}`));
    });
    document.querySelectorAll("[data-guideline-back]").forEach(button => {
      button.addEventListener("click", () => history.back());
    });

    ["setupLength","setupWidth","setupHeight","setupLoad"].forEach(id => {
      document.getElementById(id)?.addEventListener("input", renderSetupRoom);
    });

    try {
      elgaAceTool = await loadJson("tools/elga-ace.json");
      document.getElementById("elgaModel")?.addEventListener("change", renderElgaTool);
      xtendEcoTool = await loadJson("tools/xtend-eco.json");
      document.getElementById("xtendXtore")?.addEventListener("change", event => {
        document.getElementById("xtendXtoreContent")?.classList.toggle("hidden-view", event.target.value !== "yes");
      });
    } catch (error) {
      console.warn("Tooldata kon niet volledig worden geladen", error);
    }
  }


  async function init() {
    setOnlineStatus(); emptyResult("Begin met het merk", "Na je selectie verschijnt hier direct de beschikbare technische informatie."); progress();
    try {
      state.catalog = await loadJson("data/catalog.json");
      refs.recordCount.textContent = state.catalog.recordCount ?? "—";
      renderBrandOptions(); renderDeviceOptions(); setOnlineStatus();
      initHeatingPowerKnowledge();
      initTools();
    } catch (error) {
      refs.statusText.textContent = "Kennisbank niet beschikbaar"; refs.statusPill.classList.add("offline");
      refs.dataMessage.textContent = "De kennisbank kon niet worden geladen. Controleer de verbinding en probeer opnieuw."; refs.dataMessage.classList.remove("hidden");
      console.error(error);
    }
    registerServiceWorker();
  }


  // Hoofdnavigatie + PWA-teruggedrag.
  const appViews = {
    home: document.getElementById("homeView"),
    regulations: document.getElementById("regulationsView"),
    knowledge: document.getElementById("knowledgeView"),
  };
  const navButtons = [...document.querySelectorAll("[data-nav-target]")];

  function showAppView(target, { updateHistory = false } = {}) {
    if (!appViews[target]) target = "home";
    for (const [name, view] of Object.entries(appViews)) {
      view?.classList.toggle("hidden-view", name !== target);
      view?.classList.toggle("active", name === target);
    }
    navButtons.forEach(button => {
      const active = button.dataset.navTarget === target;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
    if (updateHistory) {
      const route = target === "regulations" ? "guidelines" : target === "knowledge" ? "tools" : "home";
      navigateRoute(route);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      const route = button.dataset.navTarget === "regulations" ? "guidelines" :
                    button.dataset.navTarget === "knowledge" ? "tools" : "home";
      navigateRoute(route);
    });
  });

  window.addEventListener("popstate", () => {
    if (pendingTopRoute) {
      const target = pendingTopRoute;
      pendingTopRoute = "";
      writeRoute(target);
      return;
    }
    renderRoute(routeFromLocation());
  });

  // Bouw bij een verse v1.0-sessie maximaal Home -> hoofdgroep -> detail.
  // Daardoor sluit Android/PWA Terug na Home de app, zonder eerst alle bezochte
  // Tools/Richtlijnen uit de hele sessie langs te hoeven.
  const initialRoute = routeFromLocation();
  if (history.state?.mmHistoryVersion === HISTORY_VERSION) {
    renderRoute(initialRoute);
  } else if (routeDepth(initialRoute) === 0) {
    writeRoute("home");
  } else if (routeDepth(initialRoute) === 1) {
    writeRoute("home");
    writeRoute(initialRoute, "pushState");
  } else {
    const initialParent = parentRoute(initialRoute);
    writeRoute("home");
    writeRoute(initialParent, "pushState");
    writeRoute(initialRoute, "pushState");
  }

  init();
})();
