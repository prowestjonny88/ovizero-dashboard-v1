# OviZero Dashboard

OviZero Vector Risk Intelligence Dashboard.

## Project status
Concept-stage simulated dashboard.
No physical prototype, live network, trained OviZero model, or field validation exists.

## Mentor demo scenario
* 5 simulated devices
* 1 proposed LoRaWAN gateway: GW-01
* 1 illustrative pilot: PPR Seri Anggerik

## Implemented mock functions
* Command Center
* Risk Map
* Network View
* Priority Zones
* Zone Detail
* intervention workflow
* verification workflow
* Device Fleet
* Evidence & Validation
* PDF export
* JSON export

## Session-only behavior
All data is stored in local browser state. Interventions, verifications, diagnostics, and settings will reset after a page refresh.

## Maps
The dashboard uses Google Maps for rendering geographic data if a `VITE_GOOGLE_MAPS_API_KEY` environment variable is provided. If it is not provided, a polished offline schematic map is used as a fallback.

## Validation
All scenario indices, confidence/match outputs, gateway links, device telemetry, Edge-AI output and forecasts shown in this interface are entirely simulated or represent planned targets.

## Commands
```bash
npm install
npm run dev
npm run lint
npm run build
```

## Build ID
mentor-handoff-final-v29
