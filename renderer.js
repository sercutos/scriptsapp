// =====================================
// renderer.js
// =====================================

// Referencias al sidebar
const menuLinks = document.querySelectorAll('#menu a');
const mainContent = document.getElementById('mainContent');

// Función para cargar una vista externa
async function loadView(view) {
  try {
    const resp = await fetch(`views/${view}.html`);
    const html = await resp.text();
    mainContent.innerHTML = html;

    // Inicializar scripts específicos de la vista
    if (view === 'warp') initWarp();
    if (view === 'ping') initPing();
    if (view === 'info') initInfo();
    if (view === 'custom') initCustom();

    // Si agregas más vistas, inicialízalas aquí
  } catch (err) {
    mainContent.innerHTML = `<p class="text-danger">Error cargando la vista: ${err}</p>`;
    console.error(err);
  }
}

// Evento de click en cada enlace del sidebar
menuLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = e.currentTarget;
    const view = target.dataset.view;
    loadView(view);
  });
});

// Cargar la vista por defecto
loadView('warp');


// =====================================
// Función: Warp Test
// =====================================
function initWarp() {
  const runBtn = document.getElementById("runBtn");
  if (!runBtn) return;

  runBtn.onclick = async () => {
    const inputEl = document.getElementById("gigawatts");
    const outputEl = document.getElementById("warpOutput");

    const gw = parseFloat(inputEl.value);
    if (isNaN(gw)) {
      outputEl.textContent = "Introduce un valor válido de GigaWatts.";
      return;
    }

    outputEl.textContent = "Ejecutando script...";

    try {
      /*const result = await window.electronAPI.runPS(
        `& 'D:\\scripts\\electronjs\\powershell1\\diskr\\Test-Power.ps1' -GigaWatts ${gw}`
      );*/
      //const result = await window.electronAPI.runPS("Test-Power.ps1");  
      const result = await window.electronAPI.runPS("Test-Power.ps1", `-GigaWatts ${gw}`);   
      const parsed = JSON.parse(result);
      outputEl.textContent =
        `GigaWatts: ${parsed.GigaWatts}\nCanWarp: ${parsed.CanWarp}`;
    } catch (err) {
      outputEl.textContent = "Error: " + err;
      console.error(err);
    }
  };
}


// =====================================
// Función: Ping Servers
// =====================================
function initPing() {
  const runBtn2 = document.getElementById("runBtn2");
  const tableBody = document.querySelector("#pingTable tbody");

  if (!runBtn2 || !tableBody) return;

  runBtn2.onclick = async () => {
    console.log("Botón PING pulsado");

    tableBody.innerHTML =
      "<tr><td colspan='3'>Ejecutando ping...</td></tr>";

    try {
   
      const result = await window.electronAPI.runPS("ping_servers.ps1");  
      console.log("Resultado bruto:", result);

      if (!result || result.trim() === "") {
            throw new Error("El script no devolvió ninguna información.");
        }

      const cleanResult = result.trim();
      let parsed = JSON.parse(cleanResult);

      tableBody.innerHTML = "";

      parsed.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${item.ip}</td>
          <td class="${item.estado === "OK" ? "text-success" : "text-danger"}">
            ${item.estado}
          </td>
          <td>${item.latencia_ms ?? "N/A"}</td>
        `;
        tableBody.appendChild(row);
      });

    } catch (err) {
      console.error("Error en ping:", err);
      tableBody.innerHTML =
        "<tr><td colspan='3' class='text-danger'>Error ejecutando ping</td></tr>";
    }
  };
}

// =====================================
// Función: Ping Servers
// =====================================
function initInfo() {
  const runBtn3 = document.getElementById("runBtn3");
  const tableBody = document.querySelector("#infoTable tbody");

  if (!runBtn3 || !tableBody) return;

  runBtn3.onclick = async () => {
    tableBody.innerHTML = "<tr><td colspan='2' class='text-center'>Consultando a Saruman...</td></tr>";

    try {
      const result = await window.electronAPI.runPS("getinfocomputer.ps1");
      const item = JSON.parse(result.trim()); // Es un objeto directo {...}

      tableBody.innerHTML = ""; // Limpiar

      // --- SECCIÓN 1: DATOS GENERALES ---
      const generalData = [
        { label: "Nombre del Host", value: item.CsName },
        { label: "Sistema Operativo", value: item.OsName },
        { label: "Versión", value: `${item.WindowsProductName} (${item.OsVersion})` },
        { label: "Memoria RAM", value: `${(item.CsTotalPhysicalMemory / 1073741824).toFixed(2)} GB` },
        { label: "Último Inicio", value: formatDate(item.OsLastBootUpTime) }
      ];

      addSectionTitle(tableBody, "Información del Sistema");
      generalData.forEach(data => addRow(tableBody, data.label, data.value));

      // --- SECCIÓN 2: PROCESADOR (Accediendo al array CsProcessors) ---
      if (item.CsProcessors && item.CsProcessors.length > 0) {
        addSectionTitle(tableBody, "Procesador");
        const cpu = item.CsProcessors[0]; // Tomamos el primer procesador
        
        addRow(tableBody, "Modelo", cpu.Name);
        addRow(tableBody, "Núcleos Físicos", cpu.NumberOfCores);
        addRow(tableBody, "Hilos Lógicos", cpu.NumberOfLogicalProcessors);
        addRow(tableBody, "Velocidad Máx", `${cpu.MaxClockSpeed} MHz`);
      }

    } catch (err) {
      console.error("Error:", err);
      tableBody.innerHTML = `<tr><td colspan='2' class='text-danger'>Error: ${err.message}</td></tr>`;
    }
  };
}

// Funciones auxiliares para mantener el código limpio
function addRow(table, label, value) {
  const row = document.createElement("tr");
  row.innerHTML = `<td class="fw-bold text-secondary" style="width: 40%">${label}</td><td>${value ?? 'N/A'}</td>`;
  table.appendChild(row);
}

function addSectionTitle(table, title) {
  const row = document.createElement("tr");
  row.innerHTML = `<td colspan="2" class="table-dark text-center fw-bold">${title}</td>`;
  table.appendChild(row);
}

function formatDate(psDate) {
  if (!psDate) return "N/A";
  // Procesa el formato \/Date(MS)\/ que te devuelve PowerShell
  const ticks = parseInt(psDate.replace(/\D/g, ""));
  return new Date(ticks).toLocaleString();
}
function initCustom() {
  console.log("Botón CUSTOM pulsado");
}