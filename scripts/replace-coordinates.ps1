# Script to replace coordinates in Greenwood_Buildings.geojson with coordinates from Building_Footprints.geojson
# based on matching OBJECTID properties

Write-Host "Starting coordinate replacement process..."

# Check for available files and read them
$possibleSourceFiles = @(
    "E:\kiosk_frontend\public\Building_Footprints.geojson",
    "e:\kiosk_frontend\public\tulsa-building-footprints.geojson"
)

$sourceFile = $null
foreach ($file in $possibleSourceFiles) {
    if (Test-Path $file) {
        $sourceFile = $file
        break
    }
}

if (-not $sourceFile) {
    Write-Host "Error: Could not find source Building_Footprints file. Checked:" -ForegroundColor Red
    foreach ($file in $possibleSourceFiles) {
        Write-Host "  $file" -ForegroundColor Red
    }
    exit 1
}

Write-Host "Reading source file: $sourceFile"
$sourceContent = Get-Content -Path $sourceFile -Raw
$sourceGeoJson = $sourceContent | ConvertFrom-Json

# Read the target file (Greenwood_Buildings.geojson)
$targetFile = "e:\kiosk_frontend\public\Greenwood_Buildings.geojson"
if (-not (Test-Path $targetFile)) {
    Write-Host "Error: Target file not found: $targetFile" -ForegroundColor Red
    exit 1
}

Write-Host "Reading target file: $targetFile"
$targetContent = Get-Content -Path $targetFile -Raw
$targetGeoJson = $targetContent | ConvertFrom-Json

Write-Host "Found $($sourceGeoJson.features.Count) features in source file"
Write-Host "Found $($targetGeoJson.features.Count) features in target file"

# Create lookup table from source file - map OBJECTID to geometry
Write-Host "Creating OBJECTID to geometry lookup table..."
$geometryLookup = @{}

foreach ($feature in $sourceGeoJson.features) {
    if ($feature.properties.OBJECTID -and $feature.geometry) {
        $objectId = $feature.properties.OBJECTID.ToString()
        $geometryLookup[$objectId] = $feature.geometry
    }
}

Write-Host "Created lookup table with $($geometryLookup.Count) OBJECTID entries"

# Replace coordinates in target file
$matchCount = 0
$noMatchCount = 0

Write-Host "Processing target features..."
foreach ($feature in $targetGeoJson.features) {
    if ($feature.properties.OBJECTID) {
        $objectId = $feature.properties.OBJECTID.ToString()

        if ($geometryLookup.ContainsKey($objectId)) {
            # Replace the geometry with the one from source file
            $oldGeometry = $feature.geometry
            $feature.geometry = $geometryLookup[$objectId]
            $matchCount++

            if ($matchCount -le 5) {
                Write-Host "Replaced geometry for OBJECTID $objectId"
                Write-Host "  Old type: $($oldGeometry.type)"
                Write-Host "  New type: $($feature.geometry.type)"
            }
        } else {
            $noMatchCount++
            if ($noMatchCount -le 5) {
                Write-Host "No match found for OBJECTID: $objectId"
            }
        }
    } else {
        $noMatchCount++
        Write-Host "Feature missing OBJECTID property"
    }
}

Write-Host "`nProcessing complete:"
Write-Host "  Matched and replaced: $matchCount features"
Write-Host "  No matches found: $noMatchCount features"

# Save the updated target file
$outputFile = "e:\kiosk_frontend\public\Greenwood_Buildings_updated.geojson"
Write-Host "Saving updated file to: $outputFile"

try {
    # Convert to JSON with proper formatting
    $jsonOutput = $targetGeoJson | ConvertTo-Json -Depth 10 -Compress:$false

    # Write to file
    [System.IO.File]::WriteAllText($outputFile, $jsonOutput, [System.Text.Encoding]::UTF8)

    Write-Host "Successfully saved updated GeoJSON!"
    Write-Host "Original file preserved at: $targetFile"
    Write-Host "Updated file saved as: $outputFile"

    # Verify the result
    Write-Host "`nVerification: Checking a few updated features..."
    $verifyCount = 0
    foreach ($feature in $targetGeoJson.features) {
        if ($feature.properties.OBJECTID -and $feature.geometry -and $verifyCount -lt 3) {
            $objectId = $feature.properties.OBJECTID
            Write-Host "OBJECTID $objectId has geometry type: $($feature.geometry.type)"
            if ($feature.geometry.coordinates) {
                Write-Host "  Coordinates length: $($feature.geometry.coordinates.Count)"
            }
            $verifyCount++
        }
    }

} catch {
    Write-Host "Error saving file: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception)" -ForegroundColor Red
}