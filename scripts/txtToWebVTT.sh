#!/bin/bash

# Script to convert subtitle files to WebVTT format
# Usage: ./txtToWebVTT.sh "Title" "Name" "input_file.txt" "vtt_kind"

# Check if correct number of arguments provided
if [ $# -ne 4 ]; then
    echo "Usage: $0 \"Title\" \"Name\" \"input_file\" \"vtt_kind\""
    echo "Example: $0 \"Greenwood Kiosk Help Video\" \"Help Video\" \"subtitles.txt\" \"captions\""
    echo "Valid vtt_kind values: captions, subtitles, chapters, metadata"
    exit 1
fi

TITLE="$1"
NAME="$2"
INPUT_FILE="$3"
VTT_KIND="$4"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file '$INPUT_FILE' not found!"
    exit 1
fi

# Validate vtt_kind parameter
case "$VTT_KIND" in
    captions|subtitles|chapters|metadata)
        ;;
    *)
        echo "Error: Invalid vtt_kind '$VTT_KIND'"
        echo "Valid values: captions, subtitles, chapters, metadata"
        exit 1
        ;;
esac

# Set up directories relative to script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_DIR="$SCRIPT_DIR/../public"
OUTPUT_DIR="$(cd $PUBLIC_DIR/$VTT_KIND/vtt && pwd)"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Generate output filename with full path
OUTPUT_FILE="$OUTPUT_DIR/${NAME}.vtt"

# Process the input file:
# 1. Add incrementing IDs before each caption block
# 2. Replace semicolons surrounded by digits with colons
# 3. Replace " - " surrounded by digits with " --> "

# Create a temporary file for processing
TEMP_FILE=$(mktemp)

# First pass: Add IDs before timestamp lines
awk '
BEGIN {
    caption_id = 1
    need_id = 1  # Need ID for first timestamp
}
{
    # If current line contains a timestamp pattern
    if (/^[0-9][0-9][:;][0-9][0-9][:;][0-9][0-9][:;][0-9][0-9] - [0-9][0-9][:;][0-9][0-9][:;][0-9][0-9][:;][0-9][0-9]/) {
        if (need_id) {
            print caption_id
            caption_id++
            need_id = 0
        }
        print $0
    }
    # If current line is empty or contains only whitespace
    else if (/^[[:space:]]*$/) {
        print ""
        need_id = 1
    }
    # All other lines (caption text) - just print them
    else {
        print $0
    }
}' "$INPUT_FILE" > "$TEMP_FILE"

# Create the complete output file with header and processed content
{
    cat << EOF
WEBVTT - $TITLE

STYLE
::cue {
   font-family: Figtree;
   color: #FFFFFF;
   background: rgba(0, 0, 0, 0.8);
   text-shadow: 1px 1px 2px #000000;
}

EOF
    # Second pass: Apply timestamp transformations using sed
    sed -e 's/\([0-9]\);\([0-9]\)/\1:\2/g' -e 's/\([0-9]\) - \([0-9]\)/\1 --> \2/g' "$TEMP_FILE"
} > "$OUTPUT_FILE"

# Clean up temporary file
rm "$TEMP_FILE"

echo "WebVTT file created: $OUTPUT_FILE"
echo "Title: $TITLE"
echo "Kind: $VTT_KIND"
echo "Input: $INPUT_FILE"
echo "Output: $OUTPUT_FILE"