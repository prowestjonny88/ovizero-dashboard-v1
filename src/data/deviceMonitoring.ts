import { DeviceMonitoringRecord, DeviceData } from '../types';
import { DEMO_SNAPSHOT_AT } from '../utils/dashboard';

export const getDeviceMonitoring = (device: DeviceData): DeviceMonitoringRecord => {
  const isOZ077 = device.id === 'OZ-077';
  
  // Stable mock timestamps
  const baseDate = new Date(DEMO_SNAPSHOT_AT);
  
  return {
    deviceId: device.id,
    dataSource: 'Simulated',
    connectivity: {
      gatewayId: 'GW-01',
      lastPacketAt: new Date(baseDate.getTime() - (device.lastSeenMinutes * 60000)).toISOString(),
      packetDeliveryPct: null,
      retryRatePct: null,
      offlineDurationMinutes: device.lastSeenMinutes,
      queuedPackets: isOZ077 ? 3 : 0,
      signalQuality: device.loraSignal,
    },
    power: {
      batteryPct: device.battery,
      solarInputStatus: device.solarStatus === 'Charging' ? 'Good' : (device.solarStatus === 'Low Solar' ? 'Low' : 'Unavailable'),
      solarInputWatts: null,
      estimatedDailyEnergyWh: null,
      estimatedAutonomyHours: null,
      validationStatus: 'Not Validated',
    },
    imaging: {
      focusQuality: isOZ077 ? 'Acceptable' : 'Good',
      condensation: isOZ077 ? 'Possible' : 'Clear',
      lastValidImageAt: new Date(baseDate.getTime() - ((device.lastSeenMinutes + 1) * 60000)).toISOString(),
      usableImageRatePct: null,
      lensStatus: 'Clear',
    },
    maintenance: {
      waterLevel: 'Adequate',
      infusionAgeDays: isOZ077 ? 28 : 12,
      substrateCondition: isOZ077 ? 'Replace Soon' : 'Good',
      lastCleaningAt: new Date(baseDate.getTime() - (isOZ077 ? 28 * 86400000 : 12 * 86400000)).toISOString(),
      nextServiceAt: new Date(baseDate.getTime() + (isOZ077 ? 2 * 86400000 : 18 * 86400000)).toISOString(),
      ticketStatus: isOZ077 ? 'Open' : 'None',
    },
    biologicalSafety: {
      escapeBarrier: 'Concept Check',
      adultEscapePrevention: 'Not Validated',
      experimentalEggControl: 'Planned Lab Test',
    }
  };
};
