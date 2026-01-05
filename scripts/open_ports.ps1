Get-NetTCPConnection -State Listen | Select-Object `
    LocalAddress,
    LocalPort,
    OwningProcess,
    CreationTime |
    ForEach-Object {
        $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        [PSCustomObject]@{
            LocalAddress  = $_.LocalAddress
            LocalPort     = $_.LocalPort
            ProcessName   = if ($proc) { $proc.ProcessName } else { "N/A" }
            CreationTime  = $_.CreationTime
        }
    } | ConvertTo-Json -Depth 3