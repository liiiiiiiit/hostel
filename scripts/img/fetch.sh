#!/bin/bash
# Sequential-batch image search with retries
cd /home/z/my-project/scripts/img || exit 1

run_q() {
  name="$1"; q="$2"; c="$3"
  if [ -s "$name.json" ] && grep -q '"success": true' "$name.json"; then echo "SKIP $name (done)"; return 0; fi
  for attempt in 1 2 3; do
    z-ai image-search -q "$q" -c "$c" --gl us --no-rank > "$name.json" 2>"$name.err"
    if grep -q '"success": true' "$name.json"; then echo "OK $name"; return 0; fi
    echo "RETRY($attempt) $name"; sleep 12
  done
  echo "FAIL $name"
}

# batch 1
run_q common "hostel common area lounge interior with travelers" 8 &
run_q private "boutique hostel private double room warm cozy interior" 8 &
wait
# batch 2
run_q rooftop "hostel rooftop terrace bar with string lights sunset" 8 &
run_q exterior "colorful hostel building exterior facade" 8 &
wait
# batch 3
run_q lisbon "Lisbon Portugal colorful streets city view" 3 &
run_q barcelona "Barcelona Spain Park Guell city view" 3 &
wait
# batch 4
run_q bangkok "Bangkok Thailand temple Wat Arun sunset" 3 &
run_q bali "Bali Indonesia rice terraces Canggu" 3 &
wait
# batch 5
run_q amsterdam "Amsterdam Netherlands canals houses" 3 &
run_q prague "Prague Czech Republic old town Charles bridge" 3 &
wait
# batch 6
run_q tokyo "Tokyo Japan Shibuya street night lights" 3 &
run_q sydney "Sydney Australia opera house harbour" 3 &
wait
echo "ALL_DONE"
