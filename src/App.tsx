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
import { getRiskDistribution, getDeviceHealthSummary, getInterventionSummary, buildDashboardExportPayload, getPilotDisplayLocationForMetricZone, DEMO_SNAPSHOT_AT } from './utils/dashboard';
import { downloadPdfReport } from './utils/pdfReport';
import { ALLOWED_INTERVENTION_TRANSITIONS } from './utils/interventionWorkflow';


export default function App() {

  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.COMMAND_CENTER);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  const [selectedZoneId, setSelectedZoneId] = useState<string>('north-residential-block');
  
  
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

  const dynamicZones = ZONES;
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

  const getDemoTimestamp = (timelineLength: number = 0) => {
    const baseTime = new Date(DEMO_SNAPSHOT_AT).getTime();
    return new Date(baseTime + timelineLength * 15 * 60 * 1000).toISOString();
  };

  // Action Triggers
  const handleExport = async (format: ExportFormat): Promise<void> => {
    if (exportingFormat) return;
    setExportingFormat(format);
    
    try {
      const payload = buildDashboardExportPayload(
        
        dynamicZones,
        DEVICES,
        interventions
      );
      
      const dateStr = new Date().toISOString().split('T')[0];
      
      if (format === 'pdf') {
        const filename = `ovizero-mosquito-surveillance-summary-${dateStr}.pdf`;
        await downloadPdfReport(payload, filename);
        setToast({
          message: 'PDF exported.',
          type: 'success',
        });
      } else if (format === 'json') {
        const filename = `ovizero-demo-data-${dateStr}.json`;
        const jsonPayload = {
          simulationDisclosure: {
            isSimulated: true,
            representsLiveDeployedNetwork: false,
            fieldValidatedEpidemiologicalModel: false
          },
          _disclaimer: 'Demo dashboard data · not for operational field use.',
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
          message: 'JSON exported.',
          type: 'success',
        });
      }
    } catch (e) {
      console.error(e);
      setToast({
        message: 'Export failed.',
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
        createdAt: getDemoTimestamp(0),
        timeline: [{
          id: `EV-${Date.now()}`,
          status: 'New Alert',
          timestamp: getDemoTimestamp(0),
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
      const nextTimestamp = getDemoTimestamp(record.timeline.length);
      
      const newEvent = {
        id: `EV-${Date.now()}`,
        status,
        timestamp: nextTimestamp,
        actor: payload.reviewerName || payload.assignedTeam || payload.verificationOwner || 'System',
        note: payload.reviewNote || payload.completionNotes || payload.inspectionNote || ''
      };

      const updatedRecord = {
        ...record,
        ...payload,
        status,
        timeline: [...record.timeline, newEvent]
      };

      if (status === 'Reviewed') updatedRecord.reviewedAt = nextTimestamp;
      if (status === 'Assigned') updatedRecord.assignedAt = nextTimestamp;
      if (status === 'On Site') updatedRecord.onSiteAt = nextTimestamp;
      if (status === 'Action Completed') updatedRecord.actionCompletedAt = nextTimestamp;
      if (status === 'Awaiting Verification') updatedRecord.verificationDueAt = nextTimestamp;
      if (['Activity decreased', 'Little/no change', 'Activity increased', 'Not comparable', 'Inconclusive', 'Escalated'].includes(status)) updatedRecord.closedAt = nextTimestamp;

      return {
        ...prev,
        [zoneId]: updatedRecord
      };
    });
    
    setTimeout(() => {
      if (!allowed) {
        setToast({ message: `Invalid transition to ${status}`, type: 'error' });
      } else {
        setToast({ message: "Field action updated.", type: 'success' });
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
        'Activity decreased': 'Activity decreased',
        'Little/no change': 'Little/no change',
        'Escalated': 'Escalated',
        'Activity increased': 'Activity increased',
        'Not comparable': 'Not comparable',
        'Inconclusive': 'Inconclusive'
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

    setToast({ message: "Follow-up saved.", type: 'success' });
  };

  const handleDiagnosticRun = (deviceId: string) => {
    setDiagnosticResult((prev) => ({
      ...prev,
      [deviceId]: 'Device check complete · no live device connected.',
    }));
    setToast({
      message: "Device check complete · no live device connected.",
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
            
            
            
            onOpenRiskMap={() => setCurrentScreen(AppScreen.RISK_MAP)}
            onNavigateToPriorityZones={() => setCurrentScreen(AppScreen.PRIORITY_ZONES)}
          />
        );
      case AppScreen.PRIORITY_ZONES:
        return (
          <PriorityZones interventions={interventions}
            zones={dynamicZones}
            
            onZoneSelect={handleZoneSelect}
            
          />
        );
      case AppScreen.ZONE_DETAIL:
        return (
          <ZoneDetail interventions={interventions}
            zone={activeZone}
            zones={dynamicZones}
            onBackToCommandCenter={() => setCurrentScreen(AppScreen.PRIORITY_ZONES)}
            onZoneChange={(id) => setSelectedZoneId(id)}
            onCreateIntervention={handleCreateIntervention}
            onInterventionTransition={handleInterventionTransition}
            onRecordVerification={handleRecordVerification}
            
            verifications={verifications}
            
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
          <RiskMap interventions={interventions}
            zones={ZONES}
            onZoneSelect={handleZoneSelect}
            
            onAssignIntervention={handleCreateIntervention}
          />
        );
      case AppScreen.REPORTS:
        return (
          <Reports interventions={interventions}
            zones={dynamicZones}
            devices={DEVICES}
            
            onExport={handleExport}
            exportingFormat={exportingFormat}
            onZoneSelect={handleZoneSelect}
            
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
          aria-label="Open navigation"
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
                  aria-label="Close navigation"
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
          activeZoneName={activeZone ? (getPilotDisplayLocationForMetricZone(activeZone.id, PILOT_NODES, dynamicZones) ? getPilotDisplayLocationForMetricZone(activeZone.id, PILOT_NODES, dynamicZones)!.sublocation : activeZone.name) : 'No zone selected'}
          onExport={handleExport}
          exportingFormat={exportingFormat}
          
          
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
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
