/*
  App principal do Dashboard de Vendas
  - Login Google (GIS) com allowlist
  - Leitura do Google Sheets (colunas M:Q)
  - KPIs e gráficos (Chart.js)
*/

(function initApp() {
  const cfg = window.APP_CONFIG;
  if (!cfg) { console.error("APP_CONFIG ausente"); return; }

  const statusContainer = document.getElementById("status");
  const statusEl = document.getElementById("status-text");
  const refreshBtn = document.getElementById("refresh-btn");
  const kpisSection = document.getElementById("kpis");
  const chartsSection = document.getElementById("charts");
  const tableWrap = document.getElementById("table-wrap");
  const periodBadge = document.getElementById("period-badge");
  const periodBtn = document.getElementById("period-btn");
  const periodPanel = document.getElementById("period-panel");
  const periodStart = document.getElementById("period-start");
  const periodEnd = document.getElementById("period-end");
  const periodApply = document.getElementById("period-apply");
  const periodReset = document.getElementById("period-reset");
  const presetThisMonth = document.getElementById("preset-this-month");
  const presetLastMonth = document.getElementById("preset-last-month");
  const btnListQuase = document.getElementById('btn-list-quase');
  const btnListChurn = document.getElementById('btn-list-churn');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const landing = document.getElementById("landing");
  const appRoot = document.getElementById("app");
  const loading = document.getElementById("loading");

  // Novos elementos de KPIs enxutos
  const el = (id) => document.getElementById(id);
  const kpiFatValor = el("kpi-fat-valor");
  const kpiFatVar = el("kpi-fat-var");
  const kpiFatProj = el("kpi-fat-proj");
  const kpiFatProjLabel = el("kpi-fat-proj-label");

  const kpiPedValor = el("kpi-ped-valor");
  const kpiPedVar = el("kpi-ped-var");
  const kpiPedProj = el("kpi-ped-proj");
  const kpiPedProjLabel = el("kpi-ped-proj-label");

  const kpiTicketValor = el("kpi-ticket-valor");
  const kpiTicketVar = el("kpi-ticket-var");

  const kpiClientesValor = el("kpi-clientes-valor");
  const kpiClientesVar = el("kpi-clientes-var");

  const kpiYtdTitle = el("kpi-ytd-title");
  const kpiYtdValor = el("kpi-ytd-valor");
  const kpiYtdVar = el("kpi-ytd-var");
  const kpiYtdProj = el("kpi-ytd-proj");
  const kpiYtdProjLabel = el("kpi-ytd-proj-label");

  let userEmail = null;
  let tokenClient = null;
  let accessToken = null;
  let charts = { semanas: null, clientes: null };
  let autoFetchPending = false;
  const STORAGE_EMAIL_KEY = "vp_user_email";

  function setStatus(message) { statusEl.textContent = message; }
  function toCurrencyBRL(value) { return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function formatK(value) {
    if (value === null || value === undefined || isNaN(value)) return "—";
    const thousands = value / 1000;
    const decimals = thousands >= 100 ? 0 : thousands >= 10 ? 1 : 2;
    const str = thousands.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    return `${str}k`;
  }
  function setTextById(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
  function parseJwt(jwt) { return JSON.parse(atob(jwt.split(".")[1])); }

  function gateAfterLogin() {
    const allowed = cfg.ALLOWLIST.length === 0 || cfg.ALLOWLIST.includes(userEmail);
    if (!allowed) {
      setStatus(`Acesso negado para ${userEmail}`);
      if (refreshBtn) refreshBtn.disabled = true;
      return false;
    }
    setStatus(`Logado como ${userEmail}`);
    if (refreshBtn) refreshBtn.disabled = false;
    return true;
  }

  // Inicializa Google Identity Services
  window.onload = () => {
    if (!cfg.CLIENT_ID || cfg.CLIENT_ID.startsWith("COLOQUE_SEU_CLIENT_ID")) setStatus("Defina CLIENT_ID em config.js");

    function initGIS() {
      if (!(window.google && google.accounts && google.accounts.id)) { setTimeout(initGIS, 150); return; }
      // Registrar plugin de datalabels se existir
      try { if (window.Chart && window.ChartDataLabels) { window.Chart.register(window.ChartDataLabels); } } catch(_) {}
      // ID token para recuperar e-mail do usuário
      google.accounts.id.initialize({
        client_id: cfg.CLIENT_ID,
        auto_select: true,
        use_fedcm_for_prompt: true,
        callback: (resp) => {
          try {
            const payload = parseJwt(resp.credential);
            userEmail = payload.email;
            try { localStorage.setItem(STORAGE_EMAIL_KEY, userEmail); } catch(_) {}
            const allowed = gateAfterLogin();
            if (allowed) {
              // Esconde landing imediatamente e mostra o app com overlay
              landing.hidden = true; 
              appRoot.hidden = false; 
              statusContainer.hidden = false;
              showLoading(true);
              autoFetchPending = true;
              if (tokenClient) tokenClient.requestAccessToken({ prompt: "", hint: userEmail });
              else setStatus("Login realizado. Preparando leitura...");
            }
          } catch (e) {
            setStatus("Falha ao processar login");
          }
        }
      });
      // Botão na landing
      const host = document.getElementById("gsi-btn-landing");
      if (host) {
        google.accounts.id.renderButton(host, { theme: "outline", size: "large", text: "signin_with", shape: "pill" });
      }
      // Sugere login imediatamente quando já há sessão Google
      try { google.accounts.id.prompt(); } catch(_) {}
    }
    initGIS();
    // Botão redundante (header), caso queira permitir re-login
    // Botão extra no header (opcional)
    try {
      const headerBtnHost = document.createElement("div");
      headerBtnHost.id = "gsi-btn";
      document.querySelector(".auth-area")?.appendChild(headerBtnHost);
      if (window.google?.accounts?.id) {
        google.accounts.id.renderButton(headerBtnHost, { theme: "outline", size: "medium" });
      }
    } catch(_) {}

    // Access token para Sheets API
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: cfg.CLIENT_ID,
      scope: "https://www.googleapis.com/auth/spreadsheets.readonly openid email profile",
      callback: (tokenResponse) => {
        accessToken = tokenResponse.access_token;
        setStatus("Carregando dados...");
        fetchAndRender().finally(()=>showLoading(false));
      }
    });
    // Se o usuário já logou e permitiu, faça a leitura automática
    if (autoFetchPending) {
      tokenClient.requestAccessToken({ prompt: "", hint: userEmail || undefined });
    }

    // Removido botão de carregar dados do layout
    if (refreshBtn) refreshBtn.remove();

    // UI do filtro de período
    periodBtn?.addEventListener('click', ()=>{
      periodPanel.hidden = !periodPanel.hidden;
    });
    presetThisMonth?.addEventListener('click', ()=>{
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1, 23,59,59,999);
      periodStart.valueAsDate = start; periodEnd.valueAsDate = end; 
    });
    presetLastMonth?.addEventListener('click', ()=>{
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth()-1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0, 23,59,59,999);
      periodStart.valueAsDate = start; periodEnd.valueAsDate = end; 
    });
    periodApply?.addEventListener('click', ()=>{
      try {
        const s = periodStart.value ? new Date(periodStart.value) : null;
        const e = periodEnd.value ? new Date(periodEnd.value) : null;
        if (s && e && s>e) { alert('Data inicial deve ser menor que final'); return; }
        customPeriod.start = s; customPeriod.end = e; periodPanel.hidden = true; showLoading(true); fetchAndRender().finally(()=>showLoading(false));
      } catch(_){}
    });
    periodReset?.addEventListener('click', ()=>{
      customPeriod = { start:null, end:null }; periodStart.value=''; periodEnd.value=''; periodPanel.hidden=true; showLoading(true); fetchAndRender().finally(()=>showLoading(false));
    });

    // Modal handlers
    function openModal(title, rows) {
      if (!modal) return;
      modalTitle.textContent = title;
      modalBody.innerHTML = rows.map(r=>`<tr><td>${r.cliente}</td><td>${new Date(r.last).toLocaleDateString('pt-BR')}</td><td>${formatK(r.total)}</td></tr>`).join('');
      modal.classList.remove('hidden');
    }
    modalClose?.addEventListener('click', ()=> modal?.classList.add('hidden'));
    modal?.addEventListener('click', (e)=> { if (e.target === modal) modal.classList.add('hidden'); });
  };
  let customPeriod = { start: null, end: null };

  async function fetchSheetValues(spreadsheetId, range) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    const json = await res.json();
    return json.values || [];
  }

  function normalizeRows(values) {
    // Esperado: colunas [M..Q] -> [NF Valida, AnoMes, Data, Cliente, Valor]
    const header = values[0] || [];
    const dataRows = values.slice(1);
    const rows = [];

    for (const r of dataRows) {
      const [nfValida, anoMes, dataStr, cliente, valorStr] = [r[0], r[1], r[2], r[3], r[4]];
      if (nfValida && nfValida.toString().toUpperCase() !== "TRUE") continue; // somente NF válida
      if (!dataStr || !cliente || !valorStr) continue;

      // Data pode vir como dd/mm/aaaa
      let data; 
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dataStr)) {
        const [d, m, y] = dataStr.split("/").map(Number);
        data = new Date(y, m - 1, d);
      } else {
        const asDate = new Date(dataStr);
        if (!isNaN(asDate)) data = asDate; else continue;
      }

      // Valor pode vir com separador BR (1.234,56)
      const numeric = parseFloat(String(valorStr).replace(/\./g, "").replace(/,/g, "."));
      if (!isFinite(numeric)) continue;

      rows.push({ data, anoMes: String(anoMes || `${data.getFullYear()}${String(data.getMonth()+1).padStart(2,'0')}`), cliente: String(cliente).trim(), valor: numeric });
    }
    return rows;
  }

  function computeKPIs(rows) {
    const total = rows.reduce((acc, r) => acc + r.valor, 0);
    const pedidos = rows.length;
    const clientes = new Set(rows.map(r => r.cliente)).size;
    return { total, pedidos, clientes };
  }

  function getPeriodBoundaries(rows) {
    // Última data com venda
    const lastDate = new Date(Math.max(...rows.map(r => r.data.getTime())));
    const periodDay = lastDate.getDate();
    const currentMonthStart = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
    const currentMonthEnd = new Date(lastDate.getFullYear(), lastDate.getMonth(), periodDay, 23, 59, 59, 999);
    const prevMonthStart = new Date(lastDate.getFullYear(), lastDate.getMonth() - 1, 1);
    const prevMonthEnd = new Date(lastDate.getFullYear(), lastDate.getMonth() - 1, periodDay, 23, 59, 59, 999);
    return { lastDate, periodDay, currentMonthStart, currentMonthEnd, prevMonthStart, prevMonthEnd };
  }

  function groupByClient(rows) {
    const map = new Map();
    for (const r of rows) map.set(r.cliente, (map.get(r.cliente) || 0) + r.valor);
    return Array.from(map.entries()).sort((a,b) => b[1]-a[1]);
  }

  function renderKPIs(kpis, meta) {
    const varPct = kpis.totalAnterior === 0 ? 0 : (kpis.totalAtual - kpis.totalAnterior) / kpis.totalAnterior * 100;
    // Card 1: Faturamento
    kpiFatValor.textContent = formatK(kpis.totalAtual);
    kpiFatVar.innerHTML = `<span class="${varPct>=0?'pos':'neg'}">${varPct >= 0 ? '+' : ''}${varPct.toFixed(1)}%</span> vs mês anterior`;
    kpiFatProjLabel.textContent = `Projeção ${meta.nomeMes}`;
    kpiFatProj.textContent = formatK(kpis.runRate || 0);

    // Card 2: Pedidos
    const pedidosAnterior = meta.pedidosAnterior || 0;
    const varPed = pedidosAnterior === 0 ? 0 : (kpis.pedidosAtual - pedidosAnterior)/pedidosAnterior*100;
    kpiPedValor.textContent = kpis.pedidosAtual.toLocaleString("pt-BR");
    kpiPedVar.innerHTML = `<span class="${varPed>=0?'pos':'neg'}">${varPed >= 0 ? '+' : ''}${varPed.toFixed(1)}%</span> vs mês anterior`;
    kpiPedProjLabel.textContent = `Projeção ${meta.nomeMes}`;
    const projPed = meta.avgPedidosDiario * meta.daysInMonth;
    kpiPedProj.textContent = projPed.toLocaleString("pt-BR");

    // Card 3: Ticket
    const ticketAtual = kpis.pedidosAtual ? (kpis.totalAtual / kpis.pedidosAtual) : 0;
    const ticketAnterior = pedidosAnterior ? (kpis.totalAnterior / pedidosAnterior) : 0;
    const varTicket = ticketAnterior === 0 ? 0 : (ticketAtual - ticketAnterior)/ticketAnterior*100;
    kpiTicketValor.textContent = formatK(ticketAtual);
    kpiTicketVar.innerHTML = `<span class="${varTicket>=0?'pos':'neg'}">${varTicket >= 0 ? '+' : ''}${varTicket.toFixed(1)}%</span> vs mês anterior`;

    // Card 4: Clientes únicos
    const clientesAnterior = meta.clientesAnterior || 0;
    const varClientes = clientesAnterior === 0 ? 0 : (kpis.clientesAtual - clientesAnterior)/clientesAnterior*100;
    kpiClientesValor.textContent = kpis.clientesAtual.toLocaleString("pt-BR");
    kpiClientesVar.innerHTML = `<span class="${varClientes>=0?'pos':'neg'}">${varClientes >= 0 ? '+' : ''}${varClientes.toFixed(1)}%</span> vs mês anterior`;

    // Card 5: YTD
    kpiYtdTitle.textContent = `Faturamento ${meta.anoAtual}`;
    kpiYtdValor.textContent = formatK(kpis.ytd || 0);
    const ytdPrev = meta.ytdPrev || 0; const yoyPct = ytdPrev===0?0:((kpis.ytd||0)-ytdPrev)/ytdPrev*100;
    kpiYtdVar.innerHTML = `<span class="${yoyPct>=0?'pos':'neg'}">${yoyPct>=0?'+':''}${yoyPct.toFixed(1)}%</span> vs ${meta.anoAnterior}`;
    const projAno = meta.avgDiarioYTD * meta.daysInYear;
    kpiYtdProjLabel.textContent = `Projeção ${meta.anoAtual}`;
    kpiYtdProj.textContent = formatK(projAno);

    kpisSection.hidden = false;
  }

  function renderTable(rows) {
    const tbody = document.querySelector("#sales-table tbody");
    tbody.innerHTML = "";
    const sorted = [...rows].sort((a,b) => b.data - a.data).slice(0, 200);
    for (const r of sorted) {
      const tr = document.createElement("tr");
      const tdData = document.createElement("td");
      tdData.textContent = r.data.toLocaleDateString("pt-BR");
      const tdCli = document.createElement("td");
      tdCli.textContent = r.cliente;
      const tdVal = document.createElement("td");
      tdVal.className = "amount";
      tdVal.textContent = toCurrencyBRL(r.valor);
      tr.replaceChildren(tdData, tdCli, tdVal);
      tbody.appendChild(tr);
    }
    tableWrap.hidden = false;
  }

  function renderCharts(period) {
    // Gráfico por semanas: últimas 4 vs 5–8
    const { weeks } = period;
    if (charts.semanas) charts.semanas.destroy();
    charts.semanas = new Chart(document.getElementById("chart-semanas"), {
      type: "bar",
      data: { labels: weeks.labels, datasets: [
        { label: "Faturamento", data: weeks.totals, backgroundColor: "#6da8ff", yAxisID: 'y' }
      ] },
      options: { responsive: true, layout: { padding: { top: 28, right: 8, left: 8, bottom: 8 } }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `Faturamento: ${formatK(ctx.parsed.y)}` } }, datalabels: { clamp: true, clip: false, formatter: (v)=> formatK(v), color: '#cfe2ff', anchor: 'end', align: 'end', offset: -2 } }, scales: { y: { grace: '10%', ticks: { callback: v => formatK(v) } } } }
    });

    // Top clientes (período atual)
    const top = groupByClient(period.rowsAtual).slice(0, cfg.TOP_CLIENTES || 7);
    const totalPeriodo = period.kpis.totalAtual || 1;
    const labelsCli = top.map(([c]) => c);
    const dataCli = top.map(([,v]) => v);
    const percents = dataCli.map(v => Math.round((v/totalPeriodo)*1000)/10);
    // acumulado %
    let cumulative = 0; const cumulativePct = percents.map(p => (cumulative += p));

    if (charts.clientes) charts.clientes.destroy();
    charts.clientes = new Chart(document.getElementById("chart-clientes"), {
      type: "bar",
      data: { labels: labelsCli, datasets: [
        { label: "Faturamento", data: dataCli, backgroundColor: "#00d3a7" }
      ] },
      options: { 
        indexAxis: "y", 
        plugins: { 
          legend: { display: false }, 
          tooltip: { callbacks: { label: (ctx) => {
            const pct = percents[ctx.dataIndex] ?? 0; return `${formatK(ctx.parsed.x)} (${pct.toFixed(1)}%)`;
          } } }, 
          datalabels: {
            clamp: true, clip: true,
            color: '#ffffff', font: { weight: '700' },
            formatter: (v)=> `${formatK(v)}`,
            anchor: 'end', align: 'right', offset: -8
          }
        },
        scales: { x: { grace: '10%', ticks: { callback: v => formatK(v) } } }
      }
    });

    chartsSection.hidden = false;
  }

  function computePeriod(rows) {
    const b = getPeriodBoundaries(rows);
    // Se houver filtro customizado, usa-o; senão utiliza regra padrão
    const curStart = customPeriod.start || b.currentMonthStart;
    const curEnd = customPeriod.end || b.currentMonthEnd;
    // Período anterior com mesmo dia/intervalo
    const prevStart = new Date(curStart.getFullYear(), curStart.getMonth()-1, curStart.getDate());
    const prevEnd = new Date(curEnd.getFullYear(), curEnd.getMonth()-1, curEnd.getDate(), 23,59,59,999);
    const rowsAtual = rows.filter(r => r.data >= curStart && r.data <= curEnd);
    const rowsAnterior = rows.filter(r => r.data >= prevStart && r.data <= prevEnd);

    const totalAtual = rowsAtual.reduce((a, r) => a + r.valor, 0);
    const totalAnterior = rowsAnterior.reduce((a, r) => a + r.valor, 0);
    const pedidosAtual = rowsAtual.length;
    const clientesAtual = new Set(rowsAtual.map(r => r.cliente)).size;

    // Run-rate (projeção pelo ritmo médio diário)
    const daysInMonth = new Date(curStart.getFullYear(), curStart.getMonth()+1, 0).getDate();
    const curDays = Math.max(1, Math.ceil((curEnd - new Date(curStart.getFullYear(), curStart.getMonth(), 1)) / (24*60*60*1000)) + 1);
    const avgDaily = curDays > 0 ? totalAtual / curDays : 0;
    const runRate = avgDaily * daysInMonth;

    // YTD e YoY
    const startYTD = new Date(curEnd.getFullYear(), 0, 1);
    const endYTD = curEnd;
    const startYTDPrev = new Date(curEnd.getFullYear()-1, 0, 1);
    const endYTDPrev = new Date(curEnd.getFullYear()-1, curEnd.getMonth(), curEnd.getDate(), 23,59,59,999);
    const ytd = rows.filter(r => r.data >= startYTD && r.data <= endYTD).reduce((a,r)=>a+r.valor,0);
    const ytdPrev = rows.filter(r => r.data >= startYTDPrev && r.data <= endYTDPrev).reduce((a,r)=>a+r.valor,0);
    const yoyPct = ytdPrev === 0 ? 0 : (ytd - ytdPrev) / ytdPrev * 100;

    const kpis = { totalAtual, totalAnterior, pedidosAtual, clientesAtual, runRate, ytd, yoyPct };

    // Séries por semana (últimas 8 semanas terminando na última data)
    function weekKeyStart(date) {
      const d = new Date(date);
      const day = d.getDay(); // 0=Dom
      const diffToMon = (day + 6) % 7; // quantos dias voltar até segunda
      d.setDate(d.getDate() - diffToMon);
      d.setHours(0,0,0,0);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    const totalsByWeek = new Map();
    const ordersByWeek = new Map();
    for (const r of rows) {
      const wk = weekKeyStart(r.data).toISOString().slice(0,10);
      totalsByWeek.set(wk, (totalsByWeek.get(wk) || 0) + r.valor);
      ordersByWeek.set(wk, (ordersByWeek.get(wk) || 0) + 1);
    }
    const weeksSorted = Array.from(totalsByWeek.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
    const last8 = weeksSorted.slice(-8);
    const labelsWeeks = last8.map(([wk]) => wk.slice(5));
    const valuesWeeks = last8.map(([,v]) => v);
    const ticketWeeks = last8.map(([wk]) => {
      const ord = ordersByWeek.get(wk) || 0; return ord ? (totalsByWeek.get(wk)/ord) : 0;
    });
    const weeks = { labels: labelsWeeks, totals: valuesWeeks, tickets: ticketWeeks };

    // Novos vs recorrentes
    const firstPurchase = new Map();
    for (const r of rows) {
      const cur = firstPurchase.get(r.cliente);
      if (!cur || r.data < cur) firstPurchase.set(r.cliente, r.data);
    }
    const clientesPeriodo = new Set(rowsAtual.map(r=>r.cliente));
    let novosValor = 0, recValor = 0, novosPed=0, recPed=0;
    for (const c of clientesPeriodo) {
      const isNovo = firstPurchase.get(c) >= b.currentMonthStart && firstPurchase.get(c) <= b.currentMonthEnd;
      const valorCliente = rowsAtual.filter(r=>r.cliente===c).reduce((a,r)=>a+r.valor,0);
      const pedidosCliente = rowsAtual.filter(r=>r.cliente===c).length;
      if (isNovo) { novosValor+=valorCliente; novosPed+=pedidosCliente; }
      else { recValor+=valorCliente; recPed+=pedidosCliente; }
    }
    const novosRecorrentes = {
      novos: { valor: novosValor, pedidos: novosPed, pct: totalAtual ? (novosValor/totalAtual*100) : 0 },
      recorrentes: { valor: recValor, pedidos: recPed, pct: totalAtual ? (recValor/totalAtual*100) : 0 },
    };

    // Ranking variação por cliente (top 5 up/down)
    const sumByClient = (set) => {
      const m = new Map();
      for (const r of set) m.set(r.cliente, (m.get(r.cliente)||0)+r.valor);
      return m;
    };
    const curByCli = sumByClient(rowsAtual);
    const prevByCli = sumByClient(rowsAnterior);
    const allClients = new Set([...curByCli.keys(), ...prevByCli.keys()]);
    const variations = [];
    for (const c of allClients) {
      const cur = curByCli.get(c)||0; const prev = prevByCli.get(c)||0;
      const delta = cur - prev; const pct = prev===0 ? (cur>0?100:0) : (delta/prev*100);
      if (cur || prev) variations.push({ cliente:c, cur, prev, delta, pct });
    }
    variations.sort((a,b)=>b.delta-a.delta);
    const rankUp = variations.slice(0,3);
    const rankDown = variations.slice(-3).reverse();

    // Engajamento (recência/frequência)
    const msDay = 24*60*60*1000;
    const lastByClient = new Map();
    const datesByClient = new Map();
    for (const r of rows) {
      const arr = datesByClient.get(r.cliente) || [];
      arr.push(r.data); datesByClient.set(r.cliente, arr);
      const prev = lastByClient.get(r.cliente); if (!prev || r.data>prev) lastByClient.set(r.cliente, r.data);
    }
    let ativos=0, quase=0, churn=0, freqSum=0, freqCount=0, recSum=0, recCount=0;
    for (const [cliente, last] of lastByClient.entries()) {
      const diff = Math.floor((b.lastDate - last)/msDay);
      if (diff <= 14) ativos++; else if (diff <= 42) quase++; else churn++;
      recSum += diff; recCount++;
      const arr = (datesByClient.get(cliente)||[]).sort((a,b)=>a-b);
      if (arr.length>1) {
        let sum=0; for (let i=1;i<arr.length;i++) sum += Math.floor((arr[i]-arr[i-1])/msDay);
        freqSum += sum/(arr.length-1); freqCount++;
      }
    }
    const engajamento = { ativos, quase, churn, freqMedia: freqCount? (freqSum/freqCount):0, recenciaMedia: recCount? (recSum/recCount):0 };

    const labelPeriodo = `${String(curStart.getDate()).padStart(2,'0')}/${String(curStart.getMonth()+1).padStart(2,'0')}–${String(curEnd.getDate()).padStart(2,'0')}/${String(curEnd.getMonth()+1).padStart(2,'0')}/${curEnd.getFullYear()}`;
    const labelAnterior = `${String(prevStart.getDate()).padStart(2,'0')}/${String(prevStart.getMonth()+1).padStart(2,'0')}–${String(prevEnd.getDate()).padStart(2,'0')}/${String(prevEnd.getMonth()+1).padStart(2,'0')}/${prevEnd.getFullYear()}`;
    const nomeMes = curStart.toLocaleDateString('pt-BR', { month: 'long' });
    const pedidosAnterior = rowsAnterior.length;
    const clientesAnterior = new Set(rowsAnterior.map(r=>r.cliente)).size;
    const daysInYear = new Date(b.lastDate.getFullYear(), 11, 31).getDate() + (new Date(b.lastDate.getFullYear(), 0, 1).getDate() === 1 ? 364 : 365 - 1); // simplificado
    const avgPedidosDiario = curDays > 0 ? rowsAtual.length / curDays : 0;
    const daysSinceYearStart = Math.floor((curEnd - new Date(curEnd.getFullYear(),0,1)) / (24*60*60*1000)) + 1;
    const avgDiarioYTD = daysSinceYearStart>0 ? (ytd / daysSinceYearStart) : 0;
    const meta = { nomeMes, anoAtual: curEnd.getFullYear(), anoAnterior: curEnd.getFullYear()-1, pedidosAnterior, clientesAnterior, daysInMonth, daysInYear: 365 + ( (new Date(curEnd.getFullYear(),1,29).getMonth()===1)?1:0 ), avgPedidosDiario, avgDiarioYTD, ytdPrev };

    return { rowsAtual, rowsAnterior, kpis, weeks, labels: { atual: labelPeriodo, anterior: labelAnterior }, badge: labelPeriodo, novosRecorrentes, rankUp, rankDown, engajamento, meta };
  }

  async function fetchAndRender() {
    try {
      // Auto-login pelo e-mail armazenado
      if (!userEmail) {
        try { const saved = localStorage.getItem(STORAGE_EMAIL_KEY); if (saved) { userEmail = saved; } } catch(_) {}
      }
      if (userEmail && landing && !landing.hidden) {
        landing.hidden = true; appRoot.hidden = false; statusContainer.hidden = false; showLoading(true);
      }
      const values = await fetchSheetValues(cfg.SPREADSHEET_ID, cfg.RANGE);
      if (!values.length) { setStatus("Sem dados na planilha."); return; }
      const rows = normalizeRows(values);
      if (!rows.length) { setStatus("Nenhuma linha válida."); return; }

      const period = computePeriod(rows);
      periodBadge.textContent = `Período: ${period.badge}`;
      renderKPIs({ ...period.kpis }, period.meta);
      renderCharts(period);
      renderTable(period.rowsAtual);
      setStatus(`Dados carregados (${period.rowsAtual.length} registros).`);

      // Insights
      const nr = period.novosRecorrentes;
      const fmtPct = (n)=> `${(n||0).toFixed(1)}%`;
      setTextById('nr-novos-valor', formatK(nr.novos.valor));
      setTextById('nr-novos-ped', (nr.novos.pedidos||0).toLocaleString('pt-BR'));
      setTextById('nr-novos-pct', fmtPct(nr.novos.pct));
      setTextById('nr-rec-valor', formatK(nr.recorrentes.valor));
      setTextById('nr-rec-ped', (nr.recorrentes.pedidos||0).toLocaleString('pt-BR'));
      setTextById('nr-rec-pct', fmtPct(nr.recorrentes.pct));

      // Gráfico donuts para novos vs recorrentes
      const ctxNR = document.getElementById('chart-nr');
      if (ctxNR) {
        if (charts.nr) charts.nr.destroy?.();
        charts.nr = new Chart(ctxNR, {
          type: 'doughnut',
          data: { labels: ['Novos','Recorrentes'], datasets: [{ data: [nr.novos.valor, nr.recorrentes.valor], backgroundColor: ['#7bb0ff','#00d3a7'] }] },
          options: { plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c)=> `${c.label}: ${formatK(c.parsed)}` } } } }
        });
      }

      const upEl = document.getElementById('rank-up');
      const dnEl = document.getElementById('rank-down');
      upEl.innerHTML = ''; dnEl.innerHTML = '';
      for (const r of period.rankUp) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${r.cliente}</span><span>+${formatK(r.delta)} (${(r.pct||0).toFixed(1)}%)</span>`; upEl.appendChild(li);
      }
      for (const r of period.rankDown) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${r.cliente}</span><span>${formatK(r.delta)} (${(r.pct||0).toFixed(1)}%)</span>`; dnEl.appendChild(li);
      }

      const eng = period.engajamento;
      setTextById('eng-ativos', eng.ativos);
      setTextById('eng-quase', eng.quase);
      setTextById('eng-churn', eng.churn);
      // Frequência média considerando janela recente e apenas ativos
      setTextById('eng-freq', eng.freqMedia.toFixed(1));
      const ctxEng = document.getElementById('chart-eng');
      if (ctxEng) {
        if (charts.eng) charts.eng.destroy?.();
        charts.eng = new Chart(ctxEng, {
          type: 'bar',
          data: { labels: ['Ativos','Quase churn','Inativos'], datasets: [{ data: [eng.ativos, eng.quase, eng.churn], backgroundColor: ['#00d3a7','#ffb84d','#ff6b6b'] }] },
          options: { plugins: { legend: { display: false }, datalabels: { anchor: 'end', align: 'end', color: '#cfe2ff' } }, scales: { y: { ticks: { precision:0 } } } }
        });
      }
      // Botões para listar clientes
      function buildList(filterFn){
        // Mapa cliente -> { total, last }
        const map = new Map();
        for (const r of rows) {
          const cur = map.get(r.cliente) || { total:0, last: new Date(0) };
          cur.total += r.valor; if (r.data > cur.last) cur.last = r.data; map.set(r.cliente, cur);
        }
        const list = Array.from(map.entries())
          .map(([cliente,v])=>({ cliente, total:v.total, last:v.last, diff: Math.floor((period.meta ? new Date(period.labels.atual.split('–')[1].split('/').reverse().join('-')) : new Date()) - v.last)/(24*60*60*1000) }))
          .filter(filterFn)
          .sort((a,b)=>b.total-a.total);
        return list;
      }
      btnListQuase?.addEventListener('click', ()=>{
        const list = buildList(x=> x.diff>14 && x.diff<=42);
        openModal('Quase churn', list);
      });
      btnListChurn?.addEventListener('click', ()=>{
        const list = buildList(x=> x.diff>42);
        openModal('Inativos', list);
      });

      document.getElementById('insights').hidden = false;
    } catch (err) {
      console.error(err);
      setStatus("Erro ao carregar dados: " + (err.message || String(err)));
    }
  }

  function showLoading(flag) { if (!loading) return; loading.classList.toggle("hidden", !flag); }
})();


