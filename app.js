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
    waitingWorker: null,
  };

  let knowledgeRefreshPromise = null;
  let lastKnowledgeRefreshAt = 0;
  let deviceLoadController = null;

  const $ = (id) => document.getElementById(id);
  const refs = {
    brand: $("brand"), device: $("device"), deviceGroup: $("deviceGroup"), family: $("familyHint"),
    tabs: $("tabs"), thirdStep: $("thirdStep"), result: $("result"), reset: $("resetButton"),
    dataMessage: $("dataMessage"), p1: $("p1"), p2: $("p2"), p3: $("p3"),
    recordCount: $("recordCount"), install: $("installButton"), update: $("updateButton"),
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

  function parameterRows(p) {
    const rows = [];
    const add = (name, value, unit = "") => { if (value !== undefined && value !== null && value !== "") rows.push(`<div><dt>${esc(name)}</dt><dd>${esc(displayValue(value, unit))}</dd></div>`); };
    add("Fabrieksinstelling", p.factoryDefault, p.unit);
    add("Instelbereik", p.settingRange);
    if (p.choices?.length) rows.push(`<div class="parameter-choices-row"><dt>Keuzes</dt><dd><ul class="parameter-choices">${p.choices.map(choice => `<li>${esc(choice)}</li>`).join("")}</ul></dd></div>`);
    if (p.category) add("Categorie", p.category);
    return rows.join("");
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

  function exposeWaiting(worker) {
    if (!worker || state.waitingWorker === worker) return;
    state.waitingWorker = worker;
    refs.update.disabled = false;
    refs.update.textContent = "Update app";
    refs.update.classList.remove("hidden");
  }
  refs.update.addEventListener("click", () => {
    if (!state.waitingWorker || refs.update.disabled) return;
    refs.update.disabled = true; refs.update.textContent = "Bijwerken…";
    state.waitingWorker.postMessage({ type: "SKIP_WAITING" });
  });
  if ("serviceWorker" in navigator) {
    const hadControllerAtStartup = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      state.waitingWorker = null;
      refs.update.classList.add("hidden");
      // Eerste installatie mag de gebruiker niet onnodig herladen. Bij een echte
      // worker-update herladen we precies één keer naar de nieuwe controller.
      if (hadControllerAtStartup) location.reload();
    });
  }

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
    try {
      const registration = await navigator.serviceWorker.register(appUrl("sw.js?v=7"), { updateViaCache: "none" });
      if (registration.waiting && navigator.serviceWorker.controller) exposeWaiting(registration.waiting);
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        installing?.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) exposeWaiting(installing);
        });
      });
      // Eén lichte updatecheck per sessie. Geen hash-download van alle frontendassets.
      registration.update().catch(() => {});
    } catch (error) { console.warn("Serviceworker kon niet worden geregistreerd", error); }
  }

  async function init() {
    setOnlineStatus(); emptyResult("Begin met het merk", "Na je selectie verschijnt hier direct de beschikbare technische informatie."); progress();
    try {
      state.catalog = await loadJson("data/catalog.json");
      refs.recordCount.textContent = state.catalog.recordCount ?? "—";
      renderBrandOptions(); renderDeviceOptions(); setOnlineStatus();
    } catch (error) {
      refs.statusText.textContent = "Kennisbank niet beschikbaar"; refs.statusPill.classList.add("offline");
      refs.dataMessage.textContent = "De kennisbank kon niet worden geladen. Controleer de verbinding en probeer opnieuw."; refs.dataMessage.classList.remove("hidden");
      console.error(error);
    }
    registerServiceWorker();
  }


  // Hoofdnavigatie: Home is de bestaande MonteurMaatje-flow.
  const appViews = {
    home: document.getElementById("homeView"),
    regulations: document.getElementById("regulationsView"),
    knowledge: document.getElementById("knowledgeView"),
  };
  const navButtons = [...document.querySelectorAll("[data-nav-target]")];

  function showAppView(target, { updateHistory = true } = {}) {
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
      const hash = target === "home" ? "#home" : `#${target}`;
      if (location.hash !== hash) history.replaceState({ mmView: target }, "", hash);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function viewFromLocation() {
    const value = location.hash.replace(/^#/, "");
    return ["home", "regulations", "knowledge"].includes(value) ? value : "home";
  }

  navButtons.forEach(button => {
    button.addEventListener("click", () => showAppView(button.dataset.navTarget));
  });
  window.addEventListener("popstate", () => showAppView(viewFromLocation(), { updateHistory: false }));
  window.addEventListener("hashchange", () => showAppView(viewFromLocation(), { updateHistory: false }));
  showAppView(viewFromLocation(), { updateHistory: false });

  init();
})();
