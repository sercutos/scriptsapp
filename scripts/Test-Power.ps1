param (
    [Parameter(Mandatory = $true)]
    [double] $GigaWatts
)

$canWarp = $GigaWatts -ge 1.21

# Salida JSON limpia
@{GigaWatts=$GigaWatts; CanWarp=$canWarp} | ConvertTo-Json -Compress
