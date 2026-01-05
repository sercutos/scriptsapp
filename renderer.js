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
