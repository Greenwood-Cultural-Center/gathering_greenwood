# Enhanced script to add buildings array with address normalization
Write-Host "Adding buildings array to GeoJSON with enhanced address matching..."

function Normalize-Address {
    param([string]$address)

    if (-not $address -or $address.Trim() -eq "") {
        return ""
    }

    $normalized = $address.ToLower().Trim()

    # Remove directional prefixes (e.g., "314.5 e archer street" -> "314.5 archer street")
    $normalized = $normalized -replace '^(\d+[\d\.]*)?\s*(north|south|east|west|n|s|e|w)\s+', '$1 '

    # Remove geographic suffixes (e.g., "tulsa", "oklahoma")
    $normalized = $normalized -replace '\s+(tulsa|oklahoma)(\s|$)', ''

    # Normalize street types
    $normalized = $normalized -replace '\bstreet\b', 'st'
    $normalized = $normalized -replace '\bavenue\b', 'ave'
    $normalized = $normalized -replace '\bplace\b', 'pl'
    $normalized = $normalized -replace '\broad\b', 'rd'
    $normalized = $normalized -replace '\bdrive\b', 'dr'
    $normalized = $normalized -replace '\bcourt\b', 'ct'
    $normalized = $normalized -replace '\blane\b', 'ln'
    $normalized = $normalized -replace '\bway\b', 'way'

    # Clean up multiple spaces
    $normalized = $normalized -replace '\s+', ' '
    $normalized = $normalized.Trim()

    return $normalized
}

# Read the files
$geojsonPath = "d:\Jacrys Talach\Downloads\Building_Footprints_updated.geojson"
Write-Host "Reading GeoJSON file: $geojsonPath"
$geojsonContent = Get-Content -Path $geojsonPath -Raw
$geojson = $geojsonContent | ConvertFrom-Json

$buildingsPath = "d:\Jacrys Talach\Downloads\buildings.json"
Write-Host "Reading buildings file: $buildingsPath"
$buildingsContent = Get-Content -Path $buildingsPath -Raw
$buildings = $buildingsContent | ConvertFrom-Json

Write-Host "Found $($geojson.features.Count) features in GeoJSON"
Write-Host "Found $($buildings.Count) buildings in buildings.json"

# Create lookup table from buildings.json with normalized addresses
Write-Host "Creating lookup table with normalized addresses..."
$addressLookup = @{}

$buildingProcessed = 0
foreach ($building in $buildings) {
    $buildingProcessed++
    if ($buildingProcessed % 100 -eq 0) {
        Write-Host "Processed $buildingProcessed buildings for lookup table"
    }

    if ($building.street_address -and $building.id) {
        $normalizedAddress = Normalize-Address -address $building.street_address
        if ($normalizedAddress -ne "") {
            if (-not $addressLookup.ContainsKey($normalizedAddress)) {
                $addressLookup[$normalizedAddress] = @()
            }
            $addressLookup[$normalizedAddress] += $building.id
        }
    }
}

Write-Host "Created lookup table with $($addressLookup.Count) unique normalized addresses"

# Test some normalizations
Write-Host "`n--- Testing address normalizations ---"
$testAddresses = @(
    "314.5 E Archer Street",
    "617 E Archer Street",
    "418 North Frankfort Avenue",
    "313 North Elgin Avenue"
)
foreach ($testAddr in $testAddresses) {
    $normalized = Normalize-Address -address $testAddr
    Write-Host "Original: '$testAddr' -> Normalized: '$normalized'"
    if ($addressLookup.ContainsKey($normalized)) {
        Write-Host "  Found in lookup: $($addressLookup[$normalized] -join ', ')"
    }
}

# Process GeoJSON features and add buildings array
Write-Host "`nProcessing GeoJSON features..."
$matchCount = 0
$processedCount = 0

foreach ($feature in $geojson.features) {
    $processedCount++

    if ($processedCount % 100 -eq 0) {
        Write-Host "Processed $processedCount features, found $matchCount matches so far"
    }

    # Get the address from the feature
    $geoAddress = ""
    if ($feature.properties.address -and $feature.properties.address.ToString().Trim() -ne "") {
        $geoAddress = $feature.properties.address.ToString().Trim()
    }

    # Initialize buildings array
    $buildingsArray = @()

    if ($geoAddress -ne "") {
        # Handle comma-separated addresses
        $addresses = $geoAddress -split ','
        foreach ($addr in $addresses) {
            $addr = $addr.Trim()
            if ($addr -ne "") {
                $normalizedGeoAddress = Normalize-Address -address $addr
                if ($normalizedGeoAddress -ne "" -and $addressLookup.ContainsKey($normalizedGeoAddress)) {
                    $buildingsArray += $addressLookup[$normalizedGeoAddress]
                    $matchCount++
                }
            }
        }
    }

    # Flatten the buildings array (in case of nested arrays)
    $flatBuildingsArray = @()
    foreach ($item in $buildingsArray) {
        if ($item -is [array]) {
            $flatBuildingsArray += $item
        } else {
            $flatBuildingsArray += $item
        }
    }

    # Remove duplicates and sort
    $uniqueBuildings = $flatBuildingsArray | Sort-Object -Unique

    # Add the buildings property using Add-Member
    $feature.properties | Add-Member -MemberType NoteProperty -Name "buildings" -Value $uniqueBuildings -Force
}

Write-Host "`nCompleted processing $processedCount features"
Write-Host "Found $matchCount total address matches"

# Convert back to JSON and save
Write-Host "Saving updated GeoJSON..."
$outputPath = "d:\Jacrys Talach\Downloads\Building_Footprints_with_buildings.geojson"

try {
    # Convert to JSON with proper formatting
    $jsonOutput = $geojson | ConvertTo-Json -Depth 10 -Compress:$false

    # Write to file
    [System.IO.File]::WriteAllText($outputPath, $jsonOutput, [System.Text.Encoding]::UTF8)

    Write-Host "Successfully saved updated GeoJSON to: $outputPath"

    # Verify the result
    Write-Host "`nVerification: Checking a few features with buildings arrays..."
    $featuresWithBuildings = 0
    foreach ($feature in $geojson.features) {
        if ($feature.properties.buildings -and $feature.properties.buildings.Count -gt 0) {
            $featuresWithBuildings++
            if ($featuresWithBuildings -le 5) {
                $address = if ($feature.properties.address) { $feature.properties.address } else { "No address" }
                Write-Host "Feature with address '$address' has buildings: $($feature.properties.buildings -join ', ')"
            }
        }
    }
    Write-Host "`nTotal features with buildings arrays: $featuresWithBuildings"

} catch {
    Write-Host "Error saving file: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception)" -ForegroundColor Red
}