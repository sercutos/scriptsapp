$scriptDir = $PSScriptRoot
$rutaCsv = Join-Path $scriptDir "packages.csv"
# Leer el CSV


# Verificar si el archivo CSV existe antes de empezar
if (-not (Test-Path $rutaCsv)) {
    Write-Error "No se encontró el archivo packages.csv en $scriptDir"
    exit
}

# 1. Verificar permisos de Administrador (Necesario para instalar Chocolatey y software)
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error "Este script debe ejecutarse como ADMINISTRADOR."
    exit
}

# 2. Verificar si Chocolatey está instalado
if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Chocolatey no detectado. Iniciando instalación..." -ForegroundColor Yellow
    
    try {
        # Configurar la política de ejecución para la sesión actual
        Set-ExecutionPolicy Bypass -Scope Process -Force
        
        # Comando oficial de instalación de Chocolatey
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        
        # Refrescar las variables de entorno para reconocer 'choco' sin reiniciar la consola
        $env:Path += ";$env:ALLUSERSPROFILE\chocolatey\bin"
        
        Write-Host "Chocolatey se instaló correctamente." -ForegroundColor Green
    }
    catch {
        Write-Error "Error crítico: No se pudo instalar Chocolatey."
        exit
    }
} else {
    Write-Host "Chocolatey ya esta instalado. Continuando..." -ForegroundColor Blue
}


$packages = Import-Csv $rutaCsv
$resultados = @()

foreach ($fila in $packages) {    
    $packageName = $fila.package_name.Trim().Replace("`0", "")

    Write-Host "Instalando: $packageName..." -ForegroundColor Cyan
    # 1. Comprobar si ya está instalado localmente
    # Buscamos el nombre exacto en la lista de paquetes locales      
    $checkInstalled = choco list --local-only $packageName --exact -r 2>&1 | Out-String
    
    Write-Host "choco list $packageName --exact -limit-output" 
    Write-Host "valor: $checkInstalled"
    #exit 0
    if ($null -ne $checkInstalled) {
        Write-Host "El paquete '$packageName' ya se encuentra instalado. Saltando..." -ForegroundColor Yellow
        $estado = "ALREADY_INSTALLED"        
    } 
    else {
        #Write-Host "instalando $packageName" 
        # try {
        #         # Usamos choco install con -y para confirmar automáticamente
        #         # --limit-output ayuda a que sea más limpio, o puedes quitarlo para ver todo el log
        #         choco install $packageName -y --error-exitcodes
                
        #         if ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq 1641 -or $LASTEXITCODE -eq 3010) {
        #             $estado = "INSTALLED"
        #         } else {
        #             throw "Error de salida de Chocolatey: $LASTEXITCODE"
        #         }
        #     }
        # catch {
        #     Write-Host "Error instalando $packageName" -ForegroundColor Red
        #     $estado = "FAILED"
        # }

        # $resultados += [PSCustomObject]@{
        #     package_name = $packageName
        #     estado       = $estado
        #     fecha        = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        # }
    }
}