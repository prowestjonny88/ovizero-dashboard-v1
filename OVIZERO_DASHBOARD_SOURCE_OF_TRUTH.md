# OviZero Dashboard — Source of Truth

**Purpose:** This file is the implementation authority for the judge-facing OviZero V1 dashboard redesign.  
**Use:** Any coding/design agent should follow this file before changing dashboard copy, data labels, maturity claims, numbers, navigation, or workflow.  
**Status:** Approved working source of truth for the simulated dashboard.  
**Date:** 1 September 2026.

> **Core rule:** The dashboard demonstrates an OviZero operational workflow using synthetic/demo values. It must never make simulated values look like live deployment data, validated dengue prediction, proven species confirmation, or proven intervention effect.

---

## 1. Product Definition

### Judge-facing one-line description

**OviZero is a proposed off-grid mosquito-surveillance system that combines mosquito-related biological signals, local microclimate context, and a dashboard to help teams prioritise field inspection and follow-up.**

### Dashboard-specific description

**The OviZero dashboard is a simulated mosquito-surveillance workflow showing how future OviZero node outputs could be translated into explainable intervention priorities, field actions, device maintenance, and follow-up observations.**

### Dashboard story

```text
SIGNAL
  ↓
EXPLAIN
  ↓
PRIORITISE
  ↓
ASSIGN
  ↓
FOLLOW UP
```

The dashboard is **decision support**, not an autonomous public-health decision-maker.

---

## 2. Current Maturity — Authoritative Status

| Component | Status to use | Judge-facing meaning |
|---|---|---|
| Dashboard UI/workflow | **Implemented simulated workflow** | Interactive software exists, but values shown are synthetic/demo values. |
| Acoustic classifier | **OviZero preliminary bench test** | Team has preliminary acoustic bench evidence. Treat it as a candidate mosquito-like wingbeat trigger, not species confirmation. |
| Adult mosquito vision model | **PLACEHOLDER — teammate integration pending** | Do not show fake predictions, fake accuracy, fake confidence, or fabricated screenshots. A future public/pretrained or team-evaluated model can be integrated when evidence is ready. |
| Egg-counting vision model | **PLACEHOLDER — teammate integration pending** | Do not show fake egg detections or claim an OviZero model result until teammate evidence is ready. Dashboard egg values remain explicitly synthetic demo inputs. |
| Temperature / humidity | **Proposed OviZero node inputs; simulated in dashboard** | The dashboard may show simulated local temperature/humidity values to demonstrate workflow. |
| Rainfall | **External demo weather context** | Rainfall is not measured by the OviZero node. If shown, it must be explicitly labelled as external and simulated/illustrative unless a real source is connected later. |
| 0–100 priority score | **Illustrative intervention priority** | Relative demo ranking aid for human review. It is not a probability, dengue risk estimate, outbreak probability, or validated epidemiological score. |
| Priority bands | **Demo priority bands** | UI categories only. They are not clinical or epidemiological thresholds. |
| Epidemiological prediction | **Not field validated** | Do not claim OviZero predicts dengue outbreaks or has validated warning lead time. |
| LoRaWAN | **Proposed communication architecture** | No live LoRaWAN network is represented by V1. Network status in the dashboard is demo/simulated unless replaced by actual hardware data. |
| Field durability | **Validation pending** | Weathering, condensation, image reliability, energy autonomy, lure servicing, and long-duration sensing still require field validation. |
| Sterilisation / electrical egg control | **Experimental / Phase 2 — not biologically validated** | Do not make it part of the core dashboard action story. |
| Passive/mechanical containment | **Preferred safety direction; validation pending** | Use only as proposed design intent unless a tested implementation exists. |
| Intervention effect | **Not established by dashboard** | Before/after change can be recorded descriptively; the UI must not claim causation. |

---

## 3. Placeholder Policy for Teammate-Owned Vision Work

### Adult mosquito vision placeholder

Until teammate evidence is ready, any adult-vision area must show only:

```text
ADULT MOSQUITO VISION
Integration pending

Planned role:
visual confirmation after an acoustic trigger

Evidence/status:
to be added after teammate validation
```

Allowed wording:

- **Vision integration pending**
- **Adult mosquito image classifier — placeholder**
- **Teammate validation in progress**
- **Planned second-modality confirmation layer**

Not allowed:

- “Aedes confirmed”
- “94% Aedes confidence”
- “Our model detected Aedes”
- any invented class output
- any invented accuracy/precision/recall
- any fake bounding boxes intended to look like inference

### Egg-counting placeholder

Until teammate evidence is ready, any egg-model area must show only:

```text
EGG COUNTING VISION
Integration pending

Planned role:
automated egg detection / counting from ovitrap imagery

Evidence/status:
to be added after teammate validation
```

Allowed wording:

- **Egg-counting integration pending**
- **Egg vision model — placeholder**
- **Teammate validation in progress**
- **Synthetic egg activity used for dashboard demonstration**

Not allowed:

- “Our egg model achieved XX%”
- fake egg bounding boxes
- fake AI count presented as model output
- fake agreement/accuracy
- an implication that dashboard egg values came from the pending model

### When teammate results arrive

Update this file first. The new entry must state:

1. model/source,
2. whether it is public pretrained or team-trained,
3. dataset used,
4. ground truth,
5. evaluation method,
6. actual result,
7. whether it was evaluated by the team,
8. whether it has been integrated into OviZero hardware,
9. exact safe judge-facing wording.

Only then should the dashboard claims change.

---

## 4. Dashboard Demo Scale

### Current dashboard

Use **one consistent five-node simulated site scenario**.

Authoritative language:

- **5 simulated monitoring nodes**
- **1 proposed LoRaWAN gateway**
- **1 illustrative residential-community scenario**
- **synthetic/demo node values**
- **fictionalised or illustrative locations/coordinates**

Do not make the five-node dashboard imply that five nodes are the final field-pilot design.

### Future pilot

Treat future field-pilot node count, placement, spacing, and gateway design as a separate planning decision.

Do not say:

- one node every 100 m,
- guaranteed X-m coverage,
- fixed X nodes/km²,
- 300 m gateway radius,

unless those are later supported by a site survey/link budget/field validation.

---

## 5. International-English Terminology

Use plain English suitable for international technical judges.

| Avoid | Preferred |
|---|---|
| PPR | **public-housing community** or **residential community** |
| PPR Seri Anggerik pilot | **illustrative residential-community scenario** |
| Risk Intelligence Engine | **Mosquito surveillance workflow** |
| Risk Map | **Priority Map** |
| Scenario Index | **Illustrative intervention priority** |
| Risk band | **Demo priority band** |
| Top Risk Zone | **Top-priority location** |
| Vector intelligence | **Mosquito surveillance information** |
| Egg velocity | **Egg-activity change** |
| Climate Trigger | **Weather and microclimate context** |
| Hatching Risk | remove unless validated |
| Hatching acceleration | remove unless validated |
| Effect Verified | **Follow-up observation recorded** |
| No Effect | **Little/no decrease observed** or **Inconclusive** |
| LoRa | first use: **LoRaWAN (low-power wide-area network)** |
| GW-01 | **Proposed gateway GW-01** |
| live telemetry | never use for V1 |
| real-time | never use for synthetic dashboard values |
| automatic intervention | **human-reviewed field action** |

---

## 6. Priority Score — Meaning and Display

### Preferred label

**ILLUSTRATIVE INTERVENTION PRIORITY**

Example:

```text
91 / 100
CRITICAL DEMO PRIORITY
Illustrative intervention priority
```

### Meaning

The 0–100 value is a **demo ranking aid** used to show the intended workflow.

It is not:

- 91% dengue probability,
- 91% outbreak probability,
- 91% confidence,
- validated mosquito-density risk,
- a clinical threshold,
- a field-calibrated epidemiological model.

### Required disclosure near the score

Use a concise line such as:

**Stored demo output · not field validated**

or:

**Simulated scenario · priority logic not field validated**

Do not rely only on a global banner.

---

## 7. Factor Explanation

The dashboard should explain why a location is prioritised.

### Inputs allowed in the judge-facing explanation

1. **Synthetic egg-activity trend**
2. **Simulated temperature**
3. **Simulated humidity**
4. **External demo rainfall context** — optional

### Preferred initial implementation

Use **qualitative influence labels** until a transparent demo formula is actually implemented:

```text
Illustrative priority factors

Egg-activity trend        High influence       Synthetic
Temperature + humidity    High influence       Simulated node context
Rainfall context          Moderate influence   External demo input

No validated weights. Human dengue case data are not connected.
```

### If a 40/30/20/10 visual is required

It may be used only if the team deliberately implements it as an **explicit demo scoring rule** and the displayed score is actually derived from that rule.

If so, label it:

**Illustrative demo weighting — not statistically fitted or field validated.**

Do not say:

- “learned weights”
- “AI contribution”
- “regression coefficients”
- “methodology based on published regression models”

unless exact sources/formula/calibration are documented and defensible.

---

## 8. Rainfall Provenance

Rainfall is not an OviZero node sensor.

If rainfall is displayed, use:

```text
External rainfall context
+28%
Simulated external weather input
```

A production version must later define:

- provider,
- units,
- spatial resolution,
- accumulation window,
- comparison baseline,
- observation timestamp.

Until then, it is a **demo contextual input**, not telemetry.

---

## 9. Egg Activity in the Dashboard

Until the teammate completes egg-model validation:

### Allowed

```text
Synthetic egg activity
127 demo eggs

7-day synthetic egg-activity change
+37%
```

### Not allowed

- “AI counted 127 eggs”
- “127 Aedes eggs detected”
- “camera detected 127 eggs”
- “confirmed egg count”
- “live egg count”

The dashboard story may show how a future egg-count signal would be used, but it must not imply the placeholder model produced the value.

### Consistency rule

There must be **one definition** for the displayed egg-activity change.

Do not simultaneously show conflicting values such as:

- +37%,
- +48%,
- +98%

for the same node/time period.

Choose one scenario definition and use it everywhere.

---

## 10. Acoustic Layer

### Safe role

**Candidate mosquito-like wingbeat trigger → wake the vision layer**

The acoustic system should not be presented as final Aedes species confirmation.

### Evidence status

Use:

**OviZero preliminary acoustic bench test**

Where detailed evidence is appropriate, the current project material reports:

- 2,113 recordings,
- 76.31% accuracy,
- 95.59% recall,
- 260/272 mosquito-positive windows detected.

Only show these if the team can reproduce and defend the exact experiment.

### Safe dashboard wording

- **Candidate acoustic trigger**
- **Mosquito-like wingbeat event**
- **Acoustic screening**

Avoid:

- **Aedes confirmed by wingbeat**
- **species verified by sound**
- uncalibrated percentage confidence
- exact narrow wingbeat ranges as proof of species

---

## 11. Temperature / Humidity

Safe label:

**Simulated local temperature and humidity context**

Use them as contextual variables alongside egg activity.

Avoid causal wording such as:

- temperature caused the surge,
- humidity triggered hatching,
- optimal hatching climate,
- hatching acceleration.

Preferred:

**Local temperature and humidity provide microclimate context for the simulated priority scenario.**

---

## 12. Epidemiological Claim Boundary

### Current claim

The dashboard demonstrates **inspection/intervention prioritisation**, not dengue-outbreak prediction.

### Safe wording

- **intervention priority**
- **mosquito-surveillance priority**
- **vector-related signals**
- **early biological surveillance concept**
- **future validation against dengue case data**

### Do not say

- OviZero predicts dengue outbreaks,
- OviZero predicts transmission,
- OviZero provides a validated X-day warning,
- 91/100 is dengue risk,
- high priority = outbreak imminent.

### Future validation

A later field study may test whether OviZero signals add value relative to clinical/vector surveillance.

Potential future metrics belong in a validation plan, not as achieved dashboard results.

---

## 13. Action Recommendations

OviZero is decision support.

### Default next-step wording

**Review nearby breeding sources and assign a field assessment.**

Possible human-selected actions:

- inspect potential breeding sources,
- inspect drains / water-holding containers,
- record source removal,
- request larvicide assessment under local protocol,
- request vector-control authority assessment,
- resident communication where authorised,
- schedule follow-up monitoring.

### Do not automatically prescribe

- fog a 100 m radius,
- immediate fogging,
- automatic larvicide,
- chemical control solely because of the demo score.

### Service timing

If a timing target is shown:

**Provisional demo service target: review within 48 hours**

This is an operational demo target, not biological/model output.

---

## 14. Field Action Workflow

Use four visible stages:

```text
NEEDS REVIEW
   ↓
ASSIGNED
   ↓
FIELD ACTION RECORDED
   ↓
FOLLOW-UP RECORDED
```

Escalation may be an outcome, not another normal stage.

The UI must show that a human reviewer chooses and approves the action.

---

## 15. Follow-Up / Verification

The dashboard may demonstrate a before → action → follow-up workflow.

### Safe output

```text
Baseline synthetic egg activity: 127
Field action: breeding-source inspection recorded
Follow-up synthetic egg activity: 72
Observed change: -43%

No causal attribution.
```

### Follow-up outcomes

- **Activity decreased**
- **Little/no change**
- **Activity increased**
- **Not comparable**
- **Escalated**

Do not use:

- **Effect Verified**
- **Intervention worked**
- **No Effect**

A before/after difference does not prove that the recorded action caused the change.

---

## 16. Device / Field-Durability Page

### Purpose

Show that OviZero understands operational reliability requirements.

### Judge-facing minimum fields

1. **Demo availability / mock update age**
2. **Simulated battery/power state**
3. **Simulated connectivity state**
4. **Simulated image/condensation health**
5. **Demo maintenance due**
6. **Attention reason**

Example:

```text
OZ-077
Needs attention

Battery       22%        [simulated]
Connectivity  Degraded   [simulated]
Image health  Condensation warning [simulated]
Service       Due soon   [demo schedule]
```

### Required disclosure

**Device-health values are simulated. Field durability, power autonomy, condensation control, image reliability, containment, and service intervals remain to be validated.**

### Remove from judge-facing device roster

- priority score,
- egg count,
- Aedes confidence,
- unvalidated acoustic confidence,
- empty technical KPI cards,
- fake diagnostics.

---

## 17. LoRaWAN / Network

Safe wording:

**Proposed LoRaWAN communication architecture**

Network View, if retained, is secondary/Q&A.

Use:

- **Proposed gateway**
- **Simulated link**
- **Illustrative topology**

Avoid:

- active gateway,
- connected live network,
- guaranteed coverage,
- 300 m radius,
- validated node density.

---

## 18. Sterilisation / Biological Safety

Judge feedback states sterilisation remains unvalidated.

### Dashboard treatment

Do not make sterilisation part of the main dashboard workflow.

If mentioned in Evidence & limits:

```text
Experimental / Phase 2
Biological efficacy and safe-failure behaviour not yet validated.
```

The main MVP dashboard story remains useful without it.

---

## 19. Simulation Disclosure Strategy

### Global

Persistent header badge:

**SIMULATED SCENARIO · NO LIVE DEVICES**

Expanded disclosure:

> This interface demonstrates a proposed OviZero workflow using synthetic values. It does not represent a live deployed network or a field-validated epidemiological model.

### Field-level provenance

Use explicit types:

- **Synthetic observation**
- **Simulated node input**
- **External demo input**
- **Stored demo output**
- **Provisional service target**
- **Placeholder / integration pending**
- **Preliminary bench test**
- **Planned / field validation pending**

### Never use fake freshness

Remove:

- “Updated just now”
- “10 min ago” if hard-coded
- animated live dots implying streaming

Use one fixed:

**Scenario timestamp: [date/time]**

---

## 20. Approved Navigation Direction

Judge-facing top-level navigation:

1. **Overview**
2. **Priority Map**
3. **Field Actions**
4. **Devices**

Secondary utility:

- **Evidence & limits**
- **Export demo briefing**
- **Proposed architecture**

Remove from main judge navigation:

- separate Priority Zones page,
- Reports page,
- Settings,
- developer/demo controls.

---

## 21. Overview — Required Information Hierarchy

### Primary

```text
North residential block
91 / 100
CRITICAL DEMO PRIORITY

Highest-priority location in this simulated scenario.
```

One-sentence interpretation:

> Synthetic egg activity and simulated local conditions place this location highest in the demonstration priority queue; review nearby breeding sources.

### Secondary

Three supporting observations maximum:

- synthetic egg-activity change,
- simulated temperature/humidity,
- external demo rainfall context if retained.

### Action

**REVIEW PRIORITY**

### Tertiary

- other priority locations,
- field action status,
- one device requiring attention.

Do not return to six/eight equal KPI cards.

---

## 22. Priority Map — Required Information Hierarchy

### Left

Large geographic/schematic map.

### Right selected-location panel

1. plain-English location,
2. demo priority band,
3. dominant 0–100 illustrative priority,
4. one-sentence conclusion,
5. 3 supporting observations maximum,
6. illustrative factor explanation,
7. provenance/uncertainty,
8. **Review priority** CTA.

Node ID is secondary.

Do not make model placeholders a dominant part of this panel.

---

## 23. Evidence & Limits

This should be one click away, not the main demo path.

Preferred matrix:

| Component | Current status | What exists | Next proof |
|---|---|---|---|
| Dashboard workflow | Implemented simulated workflow | interactive V1 UI | usability / stakeholder feedback |
| Acoustic trigger | Preliminary bench test | team bench result | field/noise validation + integration |
| Adult mosquito vision | Placeholder — teammate integration pending | none shown yet | teammate model/evaluation |
| Egg counting | Placeholder — teammate integration pending | none shown yet | teammate model/evaluation |
| Temperature/humidity sensing | Planned / simulated in dashboard | design intent | sensor bench + field drift testing |
| LoRaWAN | Proposed | architecture only | bench + site link validation |
| Priority logic | Illustrative demo | stored/transparent demo rule | field/case-linked validation |
| Epidemiological prediction | Not validated | none | prospective field study |
| Sterilisation | Experimental / Phase 2 | concept/literature only | biological efficacy + safety |
| Field durability | Pending | proposed mitigations | outdoor test |

Do not put unsupported performance targets beside achieved results.

---

## 24. Hard-Coded Numbers — Approved Treatment

### 91 / 100

Keep only as **illustrative intervention priority**.

### Critical / High / Elevated / Watch

Keep only as **demo priority bands**.

### +37% egg activity

May remain as a synthetic scenario value **only after it becomes the single consistent definition everywhere**.

### +28% rainfall

May remain only as **external demo rainfall context** with a defined demo baseline or clear “illustrative” wording.

### 48 hours

May remain only as:

**Provisional demo service target — not model output**

### 127 eggs

May remain only as:

**Synthetic egg-activity value**

until teammate egg-counting evidence is integrated.

### 87–96% Aedes confidence / match scores

Remove.

### Exact emergence windows such as 6–9 days

Remove.

### 300 m gateway radius / fixed node spacing

Remove.

---

## 25. Data-Consistency Rules Before Visual Redesign

The next implementation pass must establish:

1. **one scenario store** feeding every screen;
2. **one location identity** per node;
3. **one egg-activity definition** per period;
4. **one priority score/band definition**;
5. **one fixed scenario timestamp**;
6. explicit provenance for every important value;
7. no adult-vision model output until teammate integration;
8. no egg-model output until teammate integration;
9. no fake calibrated confidence;
10. no live-network wording.

Recommended conceptual data separation:

```text
scenario
├── locations
├── syntheticObservations
│   └── eggActivity
├── simulatedNodeInputs
│   ├── temperature
│   ├── humidity
│   ├── battery
│   └── deviceHealth
├── externalDemoContext
│   └── rainfall
├── priorityOutput
│   ├── score
│   ├── demoBand
│   └── explanation
├── evidenceStatus
│   ├── acoustic
│   ├── adultVisionPlaceholder
│   └── eggVisionPlaceholder
└── fieldActionState
```

---

## 26. Source-of-Truth Claim Labels

### Use

- **Simulated OviZero operations dashboard**
- **Illustrative intervention priority**
- **Critical demo priority**
- **Synthetic egg activity**
- **Simulated local temperature / humidity**
- **External demo rainfall context**
- **Candidate acoustic trigger**
- **Adult mosquito vision — integration pending**
- **Egg-counting vision — integration pending**
- **Proposed LoRaWAN gateway**
- **Field durability — validation pending**
- **Experimental / Phase 2 — biological efficacy not validated**
- **Follow-up observation**

### Never use without new evidence

- validated dengue prediction,
- dengue outbreak probability,
- confirmed Aedes from acoustic signal,
- OviZero adult vision accuracy,
- OviZero egg-count accuracy,
- live telemetry,
- live network,
- guaranteed coverage,
- proven intervention effect,
- autonomous fogging,
- field validated.

---

## 27. Final Judge Comprehension Target

### After 5 seconds

> “This simulated dashboard shows the highest-priority location for human review.”

### After 30 seconds

> “I can see why that location ranks highest, where each input came from, and what field review is suggested.”

### After 2 minutes

> “I understand the proposed sensing-to-action workflow, which components are already preliminary/implemented, which model integrations are still pending, and what still needs field validation.”

---

## 28. Implementation Order

Do not start with cosmetic redesign.

### Phase 1 — source-of-truth/data consistency

- unify scenario data,
- resolve contradictory growth values,
- remove legacy location remapping,
- remove fake Aedes confidence,
- mark provenance,
- standardise scenario timestamp,
- insert vision/egg placeholders,
- remove unsupported numerical outputs.

### Phase 2 — high-impact hierarchy

- rebuild Overview,
- simplify Priority Map selected panel,
- add one-sentence summary,
- establish dominant 91/100 priority,
- reduce cards and duplicated information.

### Phase 3 — action workflow

- Review → Assign → Field action → Follow-up,
- descriptive follow-up only,
- remove causal wording.

### Phase 4 — Devices

- simplify to durability/maintenance indicators,
- clear simulated provenance.

### Phase 5 — navigation / evidence / polish

- reduce navigation,
- move Evidence & limits to utility/Q&A,
- remove Reports/Settings from judge path,
- projector/mobile/offline test,
- final claim audit.

---

## 29. Acceptance Rule for Every Future Change

Before any sentence, number, badge, chart, or model output is added, answer:

1. What exactly does it mean?
2. Where did it come from?
3. Is it synthetic, simulated, external-demo, preliminary bench-tested, placeholder, public proof-of-concept, experimental, planned, or field validated?
4. Could a judge mistake it for dengue prediction, species confirmation, live telemetry, guaranteed coverage, or proven intervention effect?
5. Does it help a judge understand and trust OviZero faster?

If any answer is unclear, relabel, move to Evidence & limits, or remove it.

---

## 30. Source Basis

This source-of-truth file reconciles the following project materials:

- `OVIZERO_V1_DASHBOARD_AUDIT.md`
- `OviZero_Demo_Runbook.md`
- `Idea Brainstorm (4).docx`
- OviZero V1 dashboard repository audit findings

Important reconciliation decision:

The V1 repository audit correctly identifies that the repository itself does not contain a completed adult-vision or egg-counting model. Those two components are therefore intentionally treated here as **placeholders pending teammate work**, rather than borrowing public-model metrics or older claims into the judge-facing dashboard.

The existing acoustic work remains separately labelled as an **OviZero preliminary bench test**.
