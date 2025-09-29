# Enhanced debug script to understand street name patterns
Write-Host "Analyzing street name patterns for better matching..."

# Read the files
$geojsonPath = "d:\Jacrys Talach\Downloads\Building_Footprints_updated.geojson"
$geojsonContent = Get-Content -Path $geojsonPath -Raw
$geojson = $geojsonContent | ConvertFrom-Json

$buildingsPath = "d:\Jacrys Talach\Downloads\buildings.json"
$buildingsContent = Get-Content -Path $buildingsPath -Raw
$buildings = $buildingsContent | ConvertFrom-Json

Write-Host "`n--- Unique street names in GeoJSON ---"
$geoStreets = @{}
foreach ($feature in $geojson.features) {
    if ($feature.properties.address -ne $null -and $feature.properties.address.ToString().Trim() -ne "") {
        $address = $feature.properties.address.ToString().Trim()
        # Extract just the street part (remove numbers and multiple addresses)
        $streetPart = ($address -replace '^\d+[\d,\s]*', '').Trim()
        $streetPart = ($streetPart -split ',')[0].Trim()  # Take first part if comma-separated
        if ($streetPart -ne "" -and $streetPart.Length -gt 0) {
            if (-not $geoStreets.ContainsKey($streetPart)) {
                $geoStreets[$streetPart] = 0
            }
            $geoStreets[$streetPart]++
        }
    }
}

$geoStreets.GetEnumerator() | Sort-Object Key | ForEach-Object {
    Write-Host "  '$($_.Key)' (count: $($_.Value))"
}

Write-Host "`n--- Unique street names in buildings.json ---"
$buildingStreets = @{}
foreach ($building in $buildings) {
    if ($building.street_address -ne $null -and $building.street_address.ToString().Trim() -ne "") {
        $address = $building.street_address.ToString().Trim()
        # Extract street name part
        $parts = $address -split '\s+'
        if ($parts.Length -ge 3) {
            # Try to find the street name (skip number and direction, find Street/Ave/etc)
            $streetName = ""
            $foundStreetType = $false
            for ($i = 1; $i -lt $parts.Length; $i++) {
                if ($parts[$i] -match '^(Street|Avenue|Ave|Road|Rd|Drive|Dr|Court|Ct|Way|Lane|Ln|Place|Pl)') {
                    $streetType = $parts[$i]
                    # Get the word before the street type
                    if ($i -gt 1) {
                        $streetName = $parts[$i-1] + " " + $streetType
                        $foundStreetType = $true
                        break
                    }
                }
            }
            if ($foundStreetType -and $streetName -ne "") {
                if (-not $buildingStreets.ContainsKey($streetName)) {
                    $buildingStreets[$streetName] = @()
                }
                $buildingStreets[$streetName] += $address
            }
        }
    }
}

$buildingStreets.GetEnumerator() | Sort-Object Key | Select-Object -First 20 | ForEach-Object {
    Write-Host "  '$($_.Key)' (examples: $($_.Value[0..2] -join '; '))"
}

Write-Host "`n--- Looking for potential street name mappings ---"
foreach ($geoStreet in ($geoStreets.Keys | Sort-Object | Select-Object -First 10)) {
    Write-Host "GeoJSON street: '$geoStreet'"
    $potentialMatches = @()
    foreach ($buildingStreet in $buildingStreets.Keys) {
        # Check if the building street contains words from geo street
        $geoWords = $geoStreet -split '\s+' | Where-Object { $_.Length -gt 2 }  # Skip short words
        $matchCount = 0
        foreach ($word in $geoWords) {
            if ($buildingStreet -match $word) {
                $matchCount++
            }
        }
        if ($matchCount -gt 0) {
            $potentialMatches += "$buildingStreet (match score: $matchCount)"
        }
    }
    if ($potentialMatches.Count -gt 0) {
        Write-Host "  Potential matches:"
        foreach ($match in ($potentialMatches | Select-Object -First 3)) {
            Write-Host "    $match"
        }
    } else {
        Write-Host "  No matches found"
    }
    Write-Host ""
}