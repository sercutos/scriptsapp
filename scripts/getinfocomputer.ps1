# Get-ComputerInfo



$resultados = Get-ComputerInfo | Select-Object `
    CsName,
    CsCaption,
    CsDNSHostName,
    CsPrimaryOwnerName,
    CsSystemType,
    WindowsProductName,
    WindowsVersion,
    OsName,
    OsArchitecture,
    OsBuildNumber,
    OsOperatingSystemSKU,
    OsVersion,
    OsLocale,
    CsTotalPhysicalMemory,
    OsLastBootUpTime,
    CsProcessors 

$resultados | ConvertTo-Json -Depth 3