import { DEMO_SNAPSHOT_AT } from './dashboard';
import { ZoneData, RiskExplanation, ContributionLevel } from '../types';

export const getRiskBand = (score: number): ZoneData['demoPriorityBand'] => {
  if (score >= 88) return 'Critical';
  if (score >= 78) return 'High';
  if (score >= 65) return 'Elevated';
  if (score >= 50) return 'Watch';
  return 'Stable';
};

const classifyEggVelocity = (valueStr: string): ContributionLevel => {
  const value = parseInt(valueStr.replace('%', '').replace('+', ''));
  if (isNaN(value)) return 'None';
  if (value >= 35) return 'High';
  if (value >= 20) return 'Moderate';
  if (value > 0) return 'Low';
  return 'None';
};

const classifyEggCount = (value: number): ContributionLevel => {
  if (value >= 100) return 'High';
  if (value >= 60) return 'Moderate';
  if (value >= 20) return 'Low';
  return 'None';
};

const classifyHumidity = (value: number): ContributionLevel => {
  if (value >= 80) return 'High';
  if (value >= 70) return 'Moderate';
  return 'Low';
};

const classifyTemperature = (value: number): ContributionLevel => {
  if (value >= 32) return 'High';
  if (value >= 30) return 'Moderate';
  return 'Low';
};

const classifyRainfall = (valueStr: string): ContributionLevel => {
  const value = parseInt(valueStr.replace('%', '').replace('+', ''));
  if (isNaN(value)) return 'None';
  if (value >= 20) return 'High';
  if (value >= 10) return 'Moderate';
  if (value > 0) return 'Low';
  return 'None';
};

export const generateRiskExplanation = (zone: ZoneData): RiskExplanation => {
  // Stable mock timestamp
  const baseDate = new Date(DEMO_SNAPSHOT_AT);

  return {
    zoneId: zone.id,
    scenarioIndex: zone.interventionPriority,
    riskBand: getRiskBand(zone.interventionPriority),
    modelVersion: 'demo-scenario-v0.1',
    calculationType: 'Stored Mock Scenario',
    dataCompleteness: 'Partial',
    humanReviewStatus: 'Not Reviewed',
    uncertainty: 'High',
    lastCalculatedAt: baseDate.toISOString(),
    missingInputs: [
      'Nearby case trend not connected',
      'No manually verified egg count',
      'No trained image model',
      'No field-calibrated threshold',
      'No packet history'
    ],
    contributions: [
      {
        input: 'Rolling growth indicator',
        currentCondition: zone.eggActivityChange,
        contribution: classifyEggVelocity(zone.eggActivityChange),
        included: true
      },
      {
        input: 'Weekly egg count',
        currentCondition: zone.syntheticEggActivity.toString(),
        contribution: classifyEggCount(zone.syntheticEggActivity),
        included: true
      },
      {
        input: 'Humidity',
        currentCondition: `${zone.humidity}%`,
        contribution: classifyHumidity(zone.humidity),
        included: true
      },
      {
        input: 'Temperature',
        currentCondition: `${zone.temperature}°C`,
        contribution: classifyTemperature(zone.temperature),
        included: true
      },
      {
        input: 'Rainfall change',
        currentCondition: zone.rainfall,
        contribution: classifyRainfall(zone.rainfall),
        included: true
      },
      {
        input: 'Nearby case data',
        currentCondition: 'Not connected',
        contribution: 'None',
        included: false
      },
            {
        input: 'Wingbeat trigger',
        currentCondition: 'Capture trigger',
        contribution: 'None',
        included: false,
        note: 'Used to demonstrate the camera-wake sequence; not included in the scenario index.'
      },
      {
        input: 'Image quality',
        currentCondition: 'Acceptable state',
        contribution: 'None',
        included: false,
        note: 'Supports data-quality note'
      }
    ]
  };
};
