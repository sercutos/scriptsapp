# Get-ComputerInfo
$resultados = @()

# Usamos -Property para que sea un poco más rápido si la versión de PS lo permite
$info = Get-ComputerInfo -Property CsName, CsCaption, CsDNSHostName, CsPrimaryOwnerName, `
    CsSystemType, WindowsProductName, WindowsVersion, OsName, OsArchitecture, `
    OsBuildNumber, OsOperatingSystemSKU, OsVersion, OsLocale, `
    CsTotalPhysicalMemory, OsLastBootUpTime, CsProcessors

$resultados += $info

# Convertir a JSON
$resultados | ConvertTo-Json -Depth 3