# PowerShell script to add buildings array property to GeoJSON features
# Based on matching addresses between GeoJSON and buildings.json

Write-Host "Starting address matching process..."

# Read the updated GeoJSON file
Write-Host "Reading Building_Footprints_updated.geojson..."
$geojsonPath = "d:\Jacrys Talach\Downloads\Building_Footprints_updated.geojson"
$geojsonContent = Get-Content -Path $geojsonPath -Raw
$geojson = $geojsonContent | ConvertFrom-Json

# Read the buildings.json file
Write-Host "Reading buildings.json..."
$buildingsPath = "d:\Jacrys Talach\Downloads\buildings.json"
$buildingsContent = Get-Content -Path $buildingsPath -Raw
$buildings = $buildingsContent | ConvertFrom-Json

Write-Host "Found $($geojson.features.Count) GeoJSON features"
Write-Host "Found $($buildings.Count) buildings to match against"

# Create a hashtable for faster lookups - map lowercased addresses to arrays of building IDs
Write-Host "Creating address lookup table..."
$addressLookup = @{}

foreach ($building in $buildings) {
    if ($building.street_address -ne $null -and $building.street_address.Trim() -ne "") {
        $lowerAddress = $building.street_address.ToLower().Trim()

        # Initialize array if this is the first building with this address
        if (-not $addressLookup.ContainsKey($lowerAddress)) {
            $addressLookup[$lowerAddress] = @()
        }

        # Add this building's ID to the array for this address
        $addressLookup[$lowerAddress] += $building.id
    }
}

Write-Host "Created lookup table with $($addressLookup.Keys.Count) unique addresses"

# Process each GeoJSON feature
$matchCount = 0
$noMatchCount = 0

Write-Host "Processing GeoJSON features..."
foreach ($feature in $geojson.features) {
    # Get the address from the feature (already computed in previous step)
    $featureAddress = $feature.properties.address

    # Initialize buildings array as empty
    $buildingsArray = @()

    # Skip if address is null or empty
    if ($featureAddress -ne $null -and $featureAddress.ToString().Trim() -ne "") {
        $lowerFeatureAddress = $featureAddress.ToString().ToLower().Trim()

        # Look for matching buildings
        if ($addressLookup.ContainsKey($lowerFeatureAddress)) {
            $buildingsArray = $addressLookup[$lowerFeatureAddress]
            $matchCount++
            Write-Host "  Matched '$featureAddress' -> $($buildingsArray.Count) building(s): $($buildingsArray -join ', ')"
        } else {
            $noMatchCount++
            # Keep empty array for no matches
        }
    } else {
        $noMatchCount++
        # Keep empty array for null/empty addresses
    }

    # Add the buildings property using Add-Member (PowerShell way to add properties dynamically)
    $feature.properties | Add-Member -MemberType NoteProperty -Name "buildings" -Value $buildingsArray -Force
}

Write-Host ""
Write-Host "Processing complete!"
Write-Host "  Features with matching buildings: $matchCount"
Write-Host "  Features with no matching buildings: $noMatchCount"

# Save the updated GeoJSON
$outputPath = "d:\Jacrys Talach\Downloads\Building_Footprints_with_buildings.geojson"
Write-Host ""
Write-Host "Saving updated GeoJSON to: $outputPath"

$updatedJson = $geojson | ConvertTo-Json -Depth 10
$updatedJson | Set-Content -Path $outputPath -Encoding UTF8

Write-Host "File saved successfully!"
Write-Host ""
Write-Host "Sample of first few matches:"
$sampleCount = 0
foreach ($feature in $geojson.features) {
    if ($feature.properties.buildings.Count -gt 0 -and $sampleCount -lt 5) {
        Write-Host "  Address: '$($feature.properties.address)' -> Buildings: [$($feature.properties.buildings -join ', ')]"
        $sampleCount++
    }
}