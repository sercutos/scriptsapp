const { contextBridge, ipcRenderer } = require('electron');

// Buscamos el argumento en el array de argumentos del proceso
const appNameArg = process.argv.find(arg => arg.startsWith('--appName='));
const appName = appNameArg ? appNameArg.split('=')[1] : "ScriptsApp";

contextBridge.exposeInMainWorld('electronAPI', {
  name: appName,
  runPS: (script, args) => ipcRenderer.invoke("run-ps", script, args)
});
