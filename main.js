const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'assets/favicon.ico'),    
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, "preload.js")
    }
  });

  mainWindow.loadFile("index.html");
}

ipcMain.handle("run-ps", async (event, scriptName, args = "") => {
  return new Promise((resolve, reject) => {
    // Aseguramos que la ruta sea absoluta y correcta
    const scriptsDir = path.join(app.getAppPath(), "scripts");
    const scriptPath = path.join(scriptsDir, scriptName);

    // IMPORTANTE: El comando en UNA SOLA LÍNEA para evitar errores de sintaxis en el shell
    const command = `powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; & '${scriptPath}' ${args}"`;

    console.log("Ejecutando:", command); // Para que lo veas en la terminal de VS Code

    exec(command, { 
      cwd: scriptsDir,
      windowsHide: true, 
      encoding: "utf8" 
    }, (error, stdout, stderr) => {
      if (error) {
        console.error("Error de ejecución:", stderr || error.message);
        reject(stderr || error.message);
      } else {
        // Log para ver qué devuelve el script antes de enviarlo al renderer
        console.log("Salida PowerShell:", stdout); 
        resolve(stdout.trim());
      }
    });
  });
});

app.whenReady().then(createWindow);
