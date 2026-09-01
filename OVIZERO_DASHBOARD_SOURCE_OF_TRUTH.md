# OviZero Dashboard V1 Source of Truth

## Core Conceptual Definitions
* **`interventionPriority`**: A 0-100 scale indicating the priority for deploying an intervention to a specific zone.
* **`demoPriorityBand`**: The categorization of `interventionPriority` ('Critical', 'High', 'Elevated', 'Watch', 'Stable').
* **`syntheticEggActivity`**: The raw estimated egg count (a synthetic data point for this demo).
* **`eggActivityChange`**: The percentage change or trend description of the egg activity.

## Location / Scenario
* **Scenario Label**: "Illustrative residential-community scenario"
* **Zones (Canonical IDs)**:
  * `north-residential-block`
  * `drain-corridor`
  * `community-courtyard`
  * `playground-area`
  * `community-hall`

## Workflow States (Interventions)
* **Status Enum**:
  * `New Alert`
  * `Reviewed`
  * `Assigned`
  * `On Site`
  * `Action Completed`
  * `Awaiting Verification`
  * `Activity decreased`
  * `Little/no change`
  * `Escalated`

## Timestamps
* **Snapshot**: Use `DEMO_SNAPSHOT_AT` as the unified snapshot time representing the "current state" of the static scenario.

## Excluded Capabilities
* No `predictions` (e.g., next 3/7 days).
* No biological outlooks (e.g., `hatchingRate`, `adultEmergence`).
* No `aedesConfidence` percentages.
* No exact acoustic Hz thresholds.

## Placeholder Dependencies
* **Vision Models (Adult / Egg)**: Integration pending.
* **Acoustic Tracking**: "Candidate acoustic trigger — simulated".
