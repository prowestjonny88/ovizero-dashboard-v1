import { DashboardExportPayload } from '../types';
import { getInterventionDisplayStatus } from './interventionWorkflow';
import { getTopPriorityZones, getPilotDisplayLocationForMetricZone, getPilotDisplayLocationForDevice } from './dashboard';
import { PILOT_NODES } from '../data';

export const downloadPdfReport = async (
  payload: DashboardExportPayload,
  filename: string
): Promise<void> => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable')
  ]);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryGreen = '#1B7F47';
  const nearBlack = '#18181B';
  const mutedGray = '#71717A';
  const criticalRed = '#DC2626';
  const highOrange = '#EA580C';
  const elevatedAmber = '#D97706';
  const watchGreen = '#16A34A';

  const getRiskColor = (status: string) => {
    if (status === 'Critical') return criticalRed;
    if (status === 'High') return highOrange;
    if (status === 'Elevated') return elevatedAmber;
    return watchGreen;
  };

  const sanitizePdfText = (text: string) => {
    if (!text) return '';
    return text.replace(/[‘’]/g, "'")
               .replace(/[“”]/g, '"')
               .replace(/[–—]/g, '-')
               .replace(/…/g, '...')
               .replace(/ /g, ' ');
  };

  const margin = 14;
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - margin * 2;

  // --- PAGE 1: EXECUTIVE SUMMARY ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryGreen);
  doc.text('OviZero', margin, margin + 5);
  
  doc.setFontSize(14);
  doc.setTextColor(nearBlack);
  doc.text('Mosquito Surveillance Summary', margin, margin + 12);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(mutedGray);
  doc.text('Simulated mosquito-surveillance workflow', margin, margin + 18);

  // Disclosure callout
  doc.setDrawColor(253, 230, 138); // amber-200
  doc.setFillColor(254, 252, 232); // yellow-50
  doc.roundedRect(margin, margin + 22, contentWidth, 14, 1.5, 1.5, 'FD');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(217, 119, 6); // amber-600
  doc.text('SIMULATED SCENARIO · NO LIVE DEVICES', margin + 4, margin + 27);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 113, 122);
  doc.text('Synthetic/demo values; not a live deployed network or field-validated epidemiological model.', margin + 4, margin + 32);

  // Metadata
  const dateStr = new Date(payload.generatedAt).toLocaleString();
  doc.setFontSize(8);
  doc.setTextColor(mutedGray);
  doc.text(`7-day demo  |  Illustrative residential-community scenario  |  Exported: ${dateStr}`, margin, margin + 42);

  let currentY = margin + 52;

  // HERO CARD
  const rankedZones = getTopPriorityZones(payload.zones, payload.zones.length);
  const topZone = rankedZones[0];

  const formatZoneName = (zoneId: string, fallbackName: string) => {
    const loc = getPilotDisplayLocationForMetricZone(zoneId, PILOT_NODES, payload.zones);
    if (loc) {
      return loc.parentZone === loc.sublocation ? loc.parentZone : `${loc.parentZone} · ${loc.sublocation}`;
    }
    return fallbackName;
  };
  
  const topZoneName = topZone ? sanitizePdfText(formatZoneName(topZone.id, topZone.name)) : 'N/A';
  const topScore = topZone ? topZone.interventionPriority.toString() : 'N/A';
  const topBand = topZone ? topZone.demoPriorityBand : 'N/A';

  const heroHeight = 60;
  doc.setDrawColor(228, 228, 231);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, currentY, contentWidth, heroHeight, 2, 2, 'FD');

  // Hero Left: Priority
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(mutedGray);
  doc.text('TOP-PRIORITY LOCATION', margin + 6, currentY + 8);
  
  doc.setFontSize(12);
  doc.setTextColor(nearBlack);
  doc.text(topZoneName, margin + 6, currentY + 14);

  doc.setFontSize(7);
  doc.setTextColor(getRiskColor(topBand));
  doc.text(topBand.toUpperCase(), margin + 6, currentY + 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(primaryGreen);
  doc.text(topScore, margin + 6, currentY + 34);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(mutedGray);
  doc.text('/ 100', margin + 22, currentY + 34);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(nearBlack);
  doc.text('Illustrative Intervention Priority', margin + 6, currentY + 44);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedGray);
  doc.text('Stored demo output · not field validated', margin + 6, currentY + 49);

  // Hero Right: Drivers
  const rightX = margin + 90;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(mutedGray);
  doc.text('WHAT SHAPED THIS DEMO PRIORITY', rightX, currentY + 8);
  
  if (topZone) {
      // row 1: Egg activity
      doc.setFontSize(8);
      doc.setTextColor(nearBlack);
      doc.text('Egg activity', rightX, currentY + 14);
      doc.text(sanitizePdfText(topZone.eggActivityChange), rightX + 80, currentY + 14, { align: 'right' });
      
      doc.setFontSize(7.5);
      doc.setTextColor(mutedGray);
      doc.text('HIGH', rightX, currentY + 18);
      doc.setDrawColor(212, 212, 216);
      doc.setFillColor(113, 113, 122);
      doc.roundedRect(rightX + 15, currentY + 16, 50, 2, 1, 1, 'FD');
      doc.roundedRect(rightX + 15, currentY + 16, 40, 2, 1, 1, 'F'); // 80%
      doc.text('Synthetic observation', rightX, currentY + 22);

      // row 2: Local microclimate
      doc.setFontSize(8);
      doc.setTextColor(nearBlack);
      doc.text('Local microclimate', rightX, currentY + 28);
      doc.text(sanitizePdfText(`${topZone.temperature}°C · ${topZone.humidity}% RH`), rightX + 80, currentY + 28, { align: 'right' });
      
      doc.setFontSize(7.5);
      doc.setTextColor(mutedGray);
      doc.text('HIGH', rightX, currentY + 32);
      doc.setDrawColor(212, 212, 216);
      doc.setFillColor(113, 113, 122);
      doc.roundedRect(rightX + 15, currentY + 30, 50, 2, 1, 1, 'FD');
      doc.roundedRect(rightX + 15, currentY + 30, 40, 2, 1, 1, 'F'); // 80%
      doc.text('Simulated node context', rightX, currentY + 36);

      // row 3: Rainfall context
      doc.setFontSize(8);
      doc.setTextColor(nearBlack);
      doc.text('Rainfall context', rightX, currentY + 42);
      doc.text(sanitizePdfText(topZone.rainfall), rightX + 80, currentY + 42, { align: 'right' });
      
      doc.setFontSize(7.5);
      doc.setTextColor(mutedGray);
      doc.text('MODERATE', rightX, currentY + 46);
      doc.setDrawColor(212, 212, 216);
      doc.setFillColor(161, 161, 170); 
      doc.roundedRect(rightX + 22, currentY + 44, 43, 2, 1, 1, 'FD');
      doc.roundedRect(rightX + 22, currentY + 44, 24, 2, 1, 1, 'F'); // 55%
      doc.text('External demo input', rightX, currentY + 50);
  }
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(mutedGray);
  doc.text('Illustrative factors only · no validated weights', rightX, currentY + 56);

  currentY += heroHeight + 10;

  // PRIORITY DISTRIBUTION
  const distWidth = (contentWidth - 15) / 4;
  const summary = payload.summaries || {
    riskDistribution: { critical: 0, high: 0, elevated: 0, watch: 0 }
  };
  
  const bands = [
    { label: 'Critical', val: summary.riskDistribution.critical, color: criticalRed, bg: [254, 242, 242] },
    { label: 'High', val: summary.riskDistribution.high, color: highOrange, bg: [255, 237, 213] },
    { label: 'Elevated', val: summary.riskDistribution.elevated, color: elevatedAmber, bg: [254, 243, 199] },
    { label: 'Watch', val: summary.riskDistribution.watch, color: watchGreen, bg: [240, 253, 244] }
  ];

  bands.forEach((b, i) => {
    const x = margin + i * (distWidth + 5);
    doc.setDrawColor(228, 228, 231);
    doc.setFillColor(b.bg[0], b.bg[1], b.bg[2]);
    doc.roundedRect(x, currentY, distWidth, 16, 1.5, 1.5, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(b.color);
    doc.text(b.label.toUpperCase(), x + 4, currentY + 6);
    
    doc.setFontSize(12);
    doc.setTextColor(nearBlack);
    doc.text(b.val.toString(), x + 4, currentY + 13);
  });
  
  currentY += 16 + 10;

  // TOP PRIORITY LOCATIONS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(nearBlack);
  doc.text('Top Priority Locations', margin, currentY);
  currentY += 4;
  
  autoTable(doc, {
    startY: currentY,
    head: [['Rank', 'Location', 'Priority', 'Demo band', '7-day egg change']],
    body: rankedZones.slice(0, 3).map((z, i) => [
      i + 1,
      sanitizePdfText(formatZoneName(z.id, z.name)),
      z.interventionPriority,
      z.demoPriorityBand,
      sanitizePdfText(z.eggActivityChange)
    ]),
    theme: 'plain',
    headStyles: { fillColor: [244, 244, 245], textColor: [113, 113, 122], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 8, font: 'helvetica', cellPadding: 3, textColor: [24, 24, 27] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: margin, right: margin }
  });

  // --- PAGE 2: OPERATIONAL SNAPSHOT ---
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(nearBlack);
  doc.text('Operational Snapshot', margin, margin + 8);
  
  doc.setFontSize(10);
  doc.text('Priority Locations', margin, margin + 18);
  
  autoTable(doc, {
    startY: margin + 22,
    head: [['Location', 'Priority', 'Demo band', '7-day egg change', 'Local conditions', 'Next step']],
    body: rankedZones.map(z => [
      sanitizePdfText(formatZoneName(z.id, z.name)),
      z.interventionPriority,
      z.demoPriorityBand,
      sanitizePdfText(z.eggActivityChange),
      sanitizePdfText(`${z.temperature}°C · ${z.humidity}% RH`),
      sanitizePdfText(z.actionRequired)
    ]),
    theme: 'plain',
    headStyles: { fillColor: [244, 244, 245], textColor: [113, 113, 122], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 8, font: 'helvetica', cellPadding: 3, textColor: [24, 24, 27] },
    margin: { left: margin, right: margin },
    didParseCell: function (data: any) {
      if (data.section === 'body') {
        const band = data.row.raw[2];
        if (band === 'Critical') {
            data.cell.styles.fillColor = [254, 242, 242]; 
        } else if (band === 'High') {
            data.cell.styles.fillColor = [255, 237, 213]; 
        } else if (band === 'Elevated') {
            data.cell.styles.fillColor = [254, 243, 199]; 
        } else if (band === 'Watch' || band === 'Stable') {
            data.cell.styles.fillColor = [240, 253, 244]; 
        }
      }
    }
  });

  const lastTableY = (doc as any).lastAutoTable.finalY + 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(nearBlack);
  doc.text('Device Health', margin, lastTableY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedGray);
  
  const dh = payload.summaries?.deviceHealth || { maintenance: 0, weakSignal: 0 };
  const dhText = `${payload.devices.length} simulated nodes  |  ${dh.maintenance} needs attention  |  ${dh.weakSignal} weak simulated link`;
  doc.text(dhText, margin, lastTableY + 5);

  autoTable(doc, {
    startY: lastTableY + 8,
    head: [['Node', 'Location', 'Battery / Power', 'Connectivity', 'Maintenance']],
    body: payload.devices.map(d => [
      d.id,
      sanitizePdfText(getPilotDisplayLocationForDevice(d.id, PILOT_NODES) || d.location),
      `${d.battery}% · ${d.solarStatus}`,
      d.loraSignal,
      d.maintenanceState
    ]),
    theme: 'plain',
    headStyles: { fillColor: [244, 244, 245], textColor: [113, 113, 122], fontStyle: 'bold', fontSize: 8 },
    styles: { fontSize: 8, font: 'helvetica', cellPadding: 3, textColor: [24, 24, 27] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { left: margin, right: margin },
    didParseCell: function(data: any) {
        if (data.section === 'body') {
            const maintenance = data.row.raw[4];
            if (maintenance !== 'Good') {
                data.cell.styles.fillColor = [254, 242, 242]; 
                data.cell.styles.textColor = [220, 38, 38];
            }
        }
    }
  });

  const finalTableY = (doc as any).lastAutoTable.finalY + 12;
  const interventionRows = Object.entries(payload.interventions || {}).map(([zoneId, inv]) => {
    const zone = payload.zones.find(z => z.id === zoneId);
    let displayName = zoneId;
    if (zone) {
      const loc = getPilotDisplayLocationForMetricZone(zone.id, PILOT_NODES, payload.zones);
      if (loc) {
        displayName = loc.parentZone === loc.sublocation ? loc.parentZone : `${loc.parentZone} · ${loc.sublocation}`;
      } else {
        displayName = zone.name;
      }
    }
    
    let displayStatus: string = getInterventionDisplayStatus(inv.status);
    let displayStage = displayStatus;
    if (['New Alert', 'Reviewed', 'Assigned'].includes(inv.status)) displayStage = 'Preparation';
    else if (inv.status === 'On Site') displayStage = 'Active field';
    else if (['Action Completed', 'Awaiting Verification'].includes(inv.status)) displayStage = 'Follow-up required';
    else displayStage = 'Closed';

    return [
      sanitizePdfText(displayName),
      sanitizePdfText(displayStage),
      sanitizePdfText(displayStatus),
      sanitizePdfText(inv.assignedTeam || '-'),
      sanitizePdfText(inv.timeline[inv.timeline.length - 1]?.timestamp.split('T')[0] || '-')
    ];
  });

  if (interventionRows.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(mutedGray);
    doc.text('Field actions: None recorded in this session.', margin, finalTableY);
  } else {
    // --- PAGE 3: FIELD ACTIONS (CONDITIONAL) ---
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(nearBlack);
    doc.text('Field Actions', margin, margin + 8);
    
    autoTable(doc, {
      startY: margin + 15,
      head: [['Location', 'Stage', 'Status', 'Team', 'Last update']],
      body: interventionRows,
      theme: 'plain',
      headStyles: { fillColor: [244, 244, 245], textColor: [113, 113, 122], fontStyle: 'bold', fontSize: 8 },
      styles: { fontSize: 8, font: 'helvetica', cellPadding: 3, textColor: [24, 24, 27] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { left: margin, right: margin }
    });

    const followUpRecordedCount = Object.values(payload.interventions).filter(i => {
        return ['Activity decreased', 'Little/no change', 'Activity increased', 'Not comparable', 'Inconclusive', 'Escalated'].includes(i.status);
    }).length;

    if (followUpRecordedCount > 0) {
        const afterActionsY = (doc as any).lastAutoTable.finalY + 12;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(nearBlack);
        doc.text('FOLLOW-UP', margin, afterActionsY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(mutedGray);
        doc.text(`${followUpRecordedCount} follow-up observations recorded.`, margin, afterActionsY + 6);
    }
  }

  // Footer on all pages
  const totalPagesExp = '{total_pages_count_string}';
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(mutedGray);
    doc.text('OviZero · Demo summary', margin, doc.internal.pageSize.height - 10);
    doc.text(`Page ${i} of ${totalPagesExp}`, pageWidth - margin, doc.internal.pageSize.height - 10, { align: 'right' });
  }

  if (typeof doc.putTotalPages === 'function') {
      doc.putTotalPages(totalPagesExp);
  }

  doc.save(filename);
};
