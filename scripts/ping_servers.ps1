
$ProgressPreference = 'SilentlyContinue'
$ErrorActionPreference = 'Stop'

# Ruta del CSV
$scriptDir = $PSScriptRoot
$rutaCsv = Join-Path $scriptDir "servers.csv"

# Leer el CSV
$datos = Import-Csv $rutaCsv

$resultados = @()
# Obtener las IPs en un array
$ips = $datos.IP


foreach ($fila in $datos) {
    $ip = $fila.IP

    try {
        $ping = Test-Connection -ComputerName $ip -Count 1 -ErrorAction Stop

        $resultados += [PSCustomObject]@{
            ip          = $ip
            estado      = "OK"
            latencia_ms = $ping.ResponseTime
        }
    }
    catch {
        $resultados += [PSCustomObject]@{
            ip          = $ip
            estado      = "KO"
            latencia_ms = $null
        }
    }
}

$resultados | ConvertTo-Json -Depth 3