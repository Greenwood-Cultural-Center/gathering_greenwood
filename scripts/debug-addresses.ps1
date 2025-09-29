# Debug script to examine address formats
Write-Host "Examining address formats to debug matching issue..."

# Read the updated GeoJSON file
$geojsonPath = "d:\Jacrys Talach\Downloads\Building_Footprints_updated.geojson"
$geojsonContent = Get-Content -Path $geojsonPath -Raw
$geojson = $geojsonContent | ConvertFrom-Json

# Read the buildings.json file
$buildingsPath = "d:\Jacrys Talach\Downloads\buildings.json"
$buildingsContent = Get-Content -Path $buildingsPath -Raw
$buildings = $buildingsContent | ConvertFrom-Json

Write-Host "`n--- Sample GeoJSON addresses ---"
$sampleCount = 0
foreach ($feature in $geojson.features) {
    if ($feature.properties.address -ne $null -and $feature.properties.address.ToString().Trim() -ne "" -and $sampleCount -lt 10) {
        $address = $feature.properties.address.ToString()
        Write-Host "GeoJSON: '$address' (lowercased: '$($address.ToLower())')"
        $sampleCount++
    }
}

Write-Host "`n--- Sample buildings.json addresses ---"
$sampleCount = 0
foreach ($building in $buildings) {
    if ($building.street_address -ne $null -and $building.street_address.ToString().Trim() -ne "" -and $sampleCount -lt 10) {
        $address = $building.street_address.ToString()
        Write-Host "Buildings: '$address' (lowercased: '$($address.ToLower())')"
        $sampleCount++
    }
}

Write-Host "`n--- Looking for potential matches ---"
$sampleCount = 0
foreach ($feature in $geojson.features) {
    if ($feature.properties.address -ne $null -and $feature.properties.address.ToString().Trim() -ne "" -and $sampleCount -lt 5) {
        $geoAddress = $feature.properties.address.ToString().ToLower().Trim()
        Write-Host "Searching for GeoJSON address: '$geoAddress'"

        # Look for partial matches in buildings
        $partialMatches = @()
        foreach ($building in $buildings) {
            if ($building.street_address -ne $null -and $building.street_address.ToString().Trim() -ne "") {
                $buildingAddress = $building.street_address.ToString().ToLower().Trim()
                if ($buildingAddress -like "*$geoAddress*" -or $geoAddress -like "*$buildingAddress*") {
                    $partialMatches += "ID $($building.id): '$($building.street_address)'"
                    if ($partialMatches.Count -gt 3) { break }
                }
            }
        }

        if ($partialMatches.Count -gt 0) {
            Write-Host "  Potential partial matches found:"
            foreach ($match in $partialMatches) {
                Write-Host "    $match"
            }
        } else {
            Write-Host "  No partial matches found"
        }

        $sampleCount++
        Write-Host ""
    }
}