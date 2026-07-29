#!/usr/bin/env bash

set -euo pipefail

INPUT_DIR="${1}"
OUTPUT_DIR="${2}"

UNICODES="U+0000-00FF,U+0100-017F,U+2000-206F,U+20A0-20CF,U+2100-214F"
FEATURES="kern,liga,clig,calt,ccmp,locl,mark,mkmk"

mkdir -p "$OUTPUT_DIR"

shopt -s nullglob nocaseglob
files=("$INPUT_DIR"/*.otf)
shopt -u nocaseglob

for f in "${files[@]}"; do
    base="$(basename "$f" .otf)"
    out="$OUTPUT_DIR/$base.woff2"
    echo "$base.otf => $base.woff2..."
    
    pyftsubset "$f"                     \
        --output-file="$out"            \
        --flavor=woff2                  \
        --unicodes="$UNICODES"          \
        --layout-features="$FEATURES"   \
        --desubroutinize                \
        --no-hinting                    \
        --drop-tables+=DSIG             \
        --recalc-bounds                 \
        --recalc-timestamp
done

echo "ok: '$OUTPUT_DIR'"
