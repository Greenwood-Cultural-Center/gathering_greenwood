# Script to convert address property from string to array
Write-Host "Converting address property from string to array in GeoJSON..."

# Read the GeoJSON file
$geojsonPath = "d:\Jacrys Talach\Downloads\Building_Footprints_with_buildings_enhanced.geojson"
Write-Host "Reading GeoJSON file: $geojsonPath"
$geojsonContent = Get-Content -Path $geojsonPath -Raw
$geojson = $geojsonContent | ConvertFrom-Json

Write-Host "Found $($geojson.features.Count) features in GeoJSON"

# Process each feature to convert address to array
$processedCount = 0
$convertedCount = 0
$nullCount = 0

foreach ($feature in $geojson.features) {
    $processedCount++

    if ($processedCount % 100 -eq 0) {
        Write-Host "Processed $processedCount features..."
    }

    # Check if address exists and is not null
    if ($feature.properties.address -ne $null -and $feature.properties.address.ToString().Trim() -ne "") {
        $currentAddress = $feature.properties.address.ToString().Trim()

        # Convert to array with single element
        $addressArray = @($currentAddress)

        # Replace the address property
        $feature.properties.address = $addressArray
        $convertedCount++

        # Show first few examples
        if ($convertedCount -le 5) {
            Write-Host "Converted address '$currentAddress' to array: [$($addressArray -join ', ')]"
        }
    } else {
        # Address is null or empty, leave as null
        $feature.properties.address = $null
        $nullCount++
    }
}

Write-Host "`nCompleted processing $processedCount features"
Write-Host "Converted $convertedCount addresses to arrays"
Write-Host "Left $nullCount addresses as null"

# Save the updated GeoJSON
$outputPath = "d:\Jacrys Talach\Downloads\Building_Footprints_address_array.geojson"
Write-Host "Saving updated GeoJSON to: $outputPath"

try {
    # Convert to JSON with proper formatting
    $jsonOutput = $geojson | ConvertTo-Json -Depth 10 -Compress:$false

    # Write to file
    [System.IO.File]::WriteAllText($outputPath, $jsonOutput, [System.Text.Encoding]::UTF8)

    Write-Host "Successfully saved updated GeoJSON!"

    # Verify the result by checking a few features
    Write-Host "`nVerification: Checking address formats..."
    $arrayCount = 0
    $nullCount = 0

    foreach ($feature in $geojson.features | Select-Object -First 10) {
        if ($feature.properties.address -eq $null) {
            $nullCount++
            if ($nullCount -le 3) {
                Write-Host "Feature has null address"
            }
        } elseif ($feature.properties.address -is [array]) {
            $arrayCount++
            if ($arrayCount -le 3) {
                Write-Host "Feature has address array: [$($feature.properties.address -join ', ')]"
            }
        } else {
            Write-Host "WARNING: Feature has non-array address: $($feature.properties.address)"
        }
    }

    Write-Host "`nIn first 10 features: $arrayCount have address arrays, $nullCount have null addresses"

} catch {
    Write-Host "Error saving file: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Error details: $($_.Exception)" -ForegroundColor Red
}