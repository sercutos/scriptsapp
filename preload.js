const { contextBridge, ipcRenderer } = require('electron');

// Intentamos obtener el nombre de forma segura
let appName = "ScriptsApp"; 
try {
  const pkg = require('./package.json');
  appName = pkg.name;
} catch (e) {
  console.error("No se pudo leer package.json en el preload:", e);
}

contextBridge.exposeInMainWorld('electronAPI', {
  name: appName,
  runPS: (script, args) => ipcRenderer.invoke("run-ps", script, args)
});
