#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEST="$ROOT/frontend/public/zk"
mkdir -p "$DEST/is_adult" "$DEST/is_balance_above"

cp "$ROOT/circuits/build/is_adult/is_adult_main_js/is_adult_main.wasm" "$DEST/is_adult/"
cp "$ROOT/proof/keys/is_adult_final.zkey" "$DEST/is_adult/"
cp "$ROOT/circuits/build/is_balance_above/is_balance_above_main_js/is_balance_above_main.wasm" "$DEST/is_balance_above/"
cp "$ROOT/proof/keys/is_balance_above_final.zkey" "$DEST/is_balance_above/"

echo "Copied ZK assets to frontend/public/zk"
