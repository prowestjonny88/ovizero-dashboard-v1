import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AppScreen,
  ZoneData,
  InterventionMap,
  ExportFormat,
  InterventionVerificationMap,
  InterventionVerification,
  InterventionStatus,
  InterventionTransitionPayload,
  VerificationOutcome
} from './types';
import { ZONES, DEVICES, PILOT_NODES } from './data';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CommandCenter from './components/CommandCenter';
import ZoneDetail from './components/ZoneDetail';
import DeviceFleet from './components/DeviceFleet';
import ComingSoon from './components/ComingSoon';
import RiskMap from './components/RiskMap';
import PriorityZones from './components/PriorityZones';
import Reports from './components/Reports';
import EvidenceValidation from './components/EvidenceValidation';
import Settings from './components/Settings';
import { CheckCircle, Info, X, Menu } from 'lucide-react';
import SimulationBanner from './components/SimulationBanner';
import { getRiskDistribution, getDeviceHealthSummary, getInterventionSummary, buildDashboardExportPayload, getPilotDisplayLocationForMetricZone } from './utils/dashboard';
import { downloadPdfReport } from './utils/pdfReport';
import { ALLOWED_INTERVENTION_TRANSITIONS } from './utils/interventionWorkflow';

export const BUILD_ID = 'mentor-handoff-final-v29';
console.info(`OviZero build: ${BUILD_ID}`);

export default function App() {

  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.COMMAND_CENTER);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const [selectedZoneId, setSelectedZoneId] = useState<string>('ppr-seri-anggerik');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('7d');
  
  // Dynamic intervention status map
  const [interventions, setInterventions] = useState<InterventionMap>({});
  const [verifications, setVerifications] = useState<InterventionVerificationMap>({});
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);
  const interventionsRef = useRef<InterventionMap>({});

  useEffect(() => {
    interventionsRef.current = interventions;
  }, [interventions]);

  // Mobile sidebar states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dynamic feedback alerts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<{ [key: string]: string }>({});

  // Generate dynamic zones data depending on selectedDateRange
  const getDynamicZones = (): ZoneData[] => {
    return ZONES.map(z => {
      let velocity = z.eggVelocity;
      let trendData = [...z.trendData];
      let temp = z.temperature;
      let humidity = z.humidity;
      let rainfall = z.rainfall;
      let status = z.status;
      let risk = z.risk;
      
      if (selectedDateRange === '7d') {
        if (z.id === 'ppr-seri-anggerik') velocity = '+37%';
        else if (z.id === 'block-c-taman-muda') velocity = '+30%';
        else if (z.id === 'market-zone-4') velocity = '+25%';
        else if (z.id === 'flat-sri-murni') velocity = '+19%';
        else if (z.id === 'school-zone-2') velocity = '+12%';
      } else if (selectedDateRange === '30d') {
        if (z.id === 'ppr-seri-anggerik') { velocity = '+24%'; trendData = [55, 62, 70, 78, 85, 92, 100]; temp = 31.5; humidity = 80; rainfall = '+15%'; risk = 88; status = 'Critical'; }
        else if (z.id === 'block-c-taman-muda') { velocity = '+20%'; trendData = [60, 68, 72, 75, 78, 82, 85]; temp = 32.1; humidity = 78; rainfall = '+10%'; risk = 82; status = 'High'; }
        else if (z.id === 'market-zone-4') { velocity = '+16%'; trendData = [40, 45, 52, 60, 65, 70, 75]; temp = 31.8; humidity = 75; risk = 75; status = 'Elevated'; }
        else if (z.id === 'flat-sri-murni') { velocity = '+12%'; trendData = [35, 38, 42, 48, 55, 60, 65]; risk = 68; status = 'Elevated'; }
        else if (z.id === 'school-zone-2') { velocity = '+8%'; trendData = [20, 22, 25, 30, 32, 35, 40]; risk = 55; status = 'Watch'; }
      } else if (selectedDateRange === '90d') {
        if (z.id === 'ppr-seri-anggerik') { velocity = '+18%'; trendData = [40, 48, 55, 62, 70, 78, 85]; temp = 30.2; humidity = 75; rainfall = '+8%'; risk = 78; status = 'High'; }
        else if (z.id === 'block-c-taman-muda') { velocity = '+14%'; trendData = [50, 52, 55, 58, 62, 65, 70]; temp = 30.5; humidity = 70; rainfall = '+5%'; risk = 72; status = 'Elevated'; }
        else if (z.id === 'market-zone-4') { velocity = '+11%'; trendData = [30, 32, 35, 40, 45, 50, 55]; temp = 31.0; humidity = 68; risk = 65; status = 'Elevated'; }
        else if (z.id === 'flat-sri-murni') { velocity = '+8%'; trendData = [25, 28, 30, 32, 35, 38, 42]; risk = 58; status = 'Watch'; }
        else if (z.id === 'school-zone-2') { velocity = '+5%'; trendData = [15, 18, 20, 22, 25, 28, 30]; risk = 45; status = 'Stable'; }
      }
      
      return {
        ...z,
        eggVelocity: velocity,
        trendData,
        temperature: temp,
        humidity,
        rainfall,
        status,
        risk
      };
    });
  };

  const dynamicZones = getDynamicZones();
  const activeZone = dynamicZones.find((z) => z.id === selectedZoneId) ?? null;

  // Auto-dismiss toast helper
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Action Triggers
  const handleExport = async (format: ExportFormat): Promise<void> => {
    if (exportingFormat) return;
    setExportingFormat(format);
    
    try {
      const payload = buildDashboardExportPayload(
        selectedDateRange,
        dynamicZones,
        DEVICES,
        interventions
      );
      
      const dateStr = new Date().toISOString().split('T')[0];
      
      if (format === 'pdf') {
        const filename = `ovizero-risk-report-${selectedDateRange}-${dateStr}.pdf`;
        await downloadPdfReport(payload, filename);
        setToast({
          message: 'PDF report exported successfully.',
          type: 'success',
        });
      } else if (format === 'json') {
        const filename = `ovizero-simulated-scenario-${selectedDateRange}-${dateStr}.json`;
        const jsonPayload = {
          simulationDisclosure: {
            isSimulated: true,
            physicalPrototypeBuilt: false,
            liveNetworkConnected: false,
            modelTrained: false,
            fieldValidated: false,
          },
          _disclaimer: 'OviZero simulated demo data. Do not use for physical intervention planning.',
          ...payload
        };
        const blob = new Blob([JSON.stringify(jsonPayload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setToast({
          message: 'JSON data exported successfully.',
          type: 'success',
        });
      }
    } catch (e) {
      console.error(e);
      setToast({
        message: 'Report export failed.',
        type: 'error',
      });
    } finally {
      setExportingFormat(null);
    }
  };

  const handleCreateIntervention = (zoneId: string) => {
    setInterventions(prev => ({
      ...prev,
      [zoneId]: {
        id: `INT-${Date.now()}`,
        zoneId,
        status: 'New Alert',
        createdAt: new Date().toISOString(),
        timeline: [{
          id: `EV-${Date.now()}`,
          status: 'New Alert',
          timestamp: new Date().toISOString(),
          actor: 'System'
        }]
      }
    }));
  };

  const handleInterventionTransition = (zoneId: string, status: InterventionStatus, payload: InterventionTransitionPayload) => {
    let allowed = false;
    setInterventions(prev => {
      const record = prev[zoneId];
      if (!record) return prev;
      
      const allowedTransitions = ALLOWED_INTERVENTION_TRANSITIONS[record.status] || [];
      if (!allowedTransitions.includes(status)) {
        allowed = false;
        return prev;
      }
      
      allowed = true;
      
      const newEvent = {
        id: `EV-${Date.now()}`,
        status,
        timestamp: new Date().toISOString(),
        actor: payload.reviewerName || payload.assignedTeam || payload.verificationOwner || 'System',
        note: payload.reviewNote || payload.completionNotes || payload.inspectionNote || ''
      };

      const now = new Date().toISOString();
      const updatedRecord = {
        ...record,
        ...payload,
        status,
        timeline: [...record.timeline, newEvent]
      };

      if (status === 'Reviewed') updatedRecord.reviewedAt = now;
      if (status === 'Assigned') updatedRecord.assignedAt = now;
      if (status === 'On Site') updatedRecord.onSiteAt = now;
      if (status === 'Action Completed') updatedRecord.actionCompletedAt = now;
      if (status === 'Awaiting Verification') updatedRecord.verificationDueAt = now;
      if (['Effect Verified', 'No Effect', 'Escalated'].includes(status)) updatedRecord.closedAt = now;

      return {
        ...prev,
        [zoneId]: updatedRecord
      };
    });
    
    setTimeout(() => {
      if (!allowed) {
        setToast({ message: `Invalid transition to ${status}`, type: 'error' });
      } else {
        setToast({ message: `Intervention updated to ${status}`, type: 'success' });
      }
    }, 0);
  };

  const handleRecordVerification = (
    zoneId: string,
    verification: InterventionVerification
  ) => {
    // Current intervention
    const intervention = interventions[zoneId];
    
    // Validate transition first if attempting to set a final outcome
    if (verification.outcome !== 'Pending' && intervention) {
      const statusMap: Record<Exclude<VerificationOutcome, 'Pending'>, InterventionStatus> = {
        'Effect Verified': 'Effect Verified',
        'No Effect': 'No Effect',
        'Escalated': 'Escalated'
      };
      
      const finalStatus = statusMap[verification.outcome as Exclude<VerificationOutcome, 'Pending'>];
      const allowedTransitions = ALLOWED_INTERVENTION_TRANSITIONS[intervention.status] || [];
      
      // If it's already in that status, we are just saving observation edits.
      // But if it's a transition, check if allowed.
      if (intervention.status !== finalStatus && !allowedTransitions.includes(finalStatus)) {
        setToast({ message: `Cannot transition from ${intervention.status} to ${finalStatus}`, type: 'error' });
        return; // Early return, do not save verification or intervention
      }
      
      if (intervention.status !== finalStatus) {
        handleInterventionTransition(zoneId, finalStatus, {
          inspectionNote: verification.inspectionResult,
          verificationOwner: verification.inspector,
          followUpDate: verification.followUpDate
        });
      }
    }

    setVerifications(prev => ({
      ...prev,
      [zoneId]: verification
    }));

    setToast({ message: `Verification saved`, type: 'success' });
  };

  const handleDiagnosticRun = (deviceId: string) => {
    setDiagnosticResult((prev) => ({
      ...prev,
      [deviceId]: 'Simulated diagnostic completed. No live device is connected.',
    }));
    setToast({
      message: `Simulated diagnostic for ${deviceId} completed. No live device is connected.`,
      type: 'info',
    });
  };

  const handleZoneSelect = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setCurrentScreen(AppScreen.ZONE_DETAIL);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.COMMAND_CENTER:
        return (
          <CommandCenter
            zones={dynamicZones} 
            onZoneSelect={handleZoneSelect} 
            selectedDateRange={selectedDateRange}
            onDateRangeChange={(range) => setSelectedDateRange(range)}
            interventions={interventions}
            onOpenRiskMap={() => setCurrentScreen(AppScreen.RISK_MAP)}
            onNavigateToPriorityZones={() => setCurrentScreen(AppScreen.PRIORITY_ZONES)}
          />
        );
      case AppScreen.PRIORITY_ZONES:
        return (
          <PriorityZones
            zones={dynamicZones}
            interventions={interventions}
            onZoneSelect={handleZoneSelect}
            selectedDateRange={selectedDateRange}
          />
        );
      case AppScreen.ZONE_DETAIL:
        return (
          <ZoneDetail
            zone={activeZone}
            zones={dynamicZones}
            onBackToCommandCenter={() => setCurrentScreen(AppScreen.PRIORITY_ZONES)}
            onZoneChange={(id) => setSelectedZoneId(id)}
            onCreateIntervention={handleCreateIntervention}
            onInterventionTransition={handleInterventionTransition}
            onRecordVerification={handleRecordVerification}
            interventions={interventions}
            verifications={verifications}
            selectedDateRange={selectedDateRange}
          />
        );
      case AppScreen.DEVICES:
        return (
          <DeviceFleet
            devices={DEVICES}
            onDiagnosticRun={handleDiagnosticRun}
            diagnosticResult={diagnosticResult}
          />
        );
      case AppScreen.RISK_MAP:
        return (
          <RiskMap
            zones={ZONES}
            onZoneSelect={handleZoneSelect}
            interventions={interventions}
            onAssignIntervention={handleCreateIntervention}
          />
        );
      case AppScreen.REPORTS:
        return (
          <Reports
            zones={dynamicZones}
            devices={DEVICES}
            selectedDateRange={selectedDateRange}
            onExport={handleExport}
            exportingFormat={exportingFormat}
            onZoneSelect={handleZoneSelect}
            interventions={interventions}
          />
        );
      case AppScreen.EVIDENCE_VALIDATION:
        return <EvidenceValidation />;
      case AppScreen.SETTINGS:
        return <Settings />;
      default:
        return <ComingSoon title="Module Unavailable" description="This screen is undergoing deployment maintenance." />;
    }
  };

  return (
    <div id="ovizero-dashboard-root" className="min-h-screen bg-[#f7faf8] text-[#07130c] font-sans antialiased overflow-x-hidden flex">
      
      {/* 1. Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          currentScreen={currentScreen} 
          onScreenChange={(screen) => setCurrentScreen(screen)} 
        />
      </div>

      {/* 2. Mobile Nav Trigger & Mobile Sidebar Drawer */}
      <div className="lg:hidden">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg border border-zinc-200 shadow-sm text-black active:scale-95 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Backdrop drawer */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileSidebarOpen(false)}
                className="fixed inset-0 bg-black z-40"
              />

              {/* Sidebar container */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 p-6 shadow-2xl flex flex-col"
              >
                {/* Close Button inside mobile drawer */}
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="absolute top-4 right-4 text-[#545f73] hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <Sidebar variant="drawer" currentScreen={currentScreen} onScreenChange={(screen) => { setCurrentScreen(screen); setIsMobileSidebarOpen(false); }} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Main content area offset by sidebar on desktop */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        
        {/* Top Navbar Header */}
        <Header
          currentScreen={currentScreen}
          activeZoneName={activeZone ? (getPilotDisplayLocationForMetricZone(activeZone.id, PILOT_NODES, dynamicZones) ? `PPR Seri Anggerik · ${getPilotDisplayLocationForMetricZone(activeZone.id, PILOT_NODES, dynamicZones)!.sublocation}` : activeZone.name) : 'No zone selected'}
          onExport={handleExport}
          exportingFormat={exportingFormat}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={(range) => setSelectedDateRange(range)}
        />

        <SimulationBanner />

        {/* Dynamic page contents with transition animation */}
        <main className="p-4 lg:p-8 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen + selectedZoneId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 4. Elegant Custom Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black text-white px-5 py-4 rounded-xl border border-white/10 shadow-2xl max-w-sm"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-white shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-[#cfc4c5] shrink-0" />
            )}
            
            <p className="text-xs font-semibold uppercase tracking-wider leading-relaxed">
              {toast.message}
            </p>

            <button
              onClick={() => setToast(null)}
              className="text-[#cfc4c5] hover:text-white transition-colors ml-2 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
