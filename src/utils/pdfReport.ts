import { DashboardExportPayload } from '../types';
import { getTopPriorityZones, getPilotDisplayLocationForMetricZone, getPilotDisplayLocationForDevice } from './dashboard';
import { PILOT_NODES } from '../data';

export const downloadPdfReport = async (
  payload: DashboardExportPayload,
  filename: string
): Promise<void> => {
  const [{ jsPDF }, { autoTable }] = await Promise.all([
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
    return text.replace(/[\u2018\u2019]/g, "'")
               .replace(/[\u201C\u201D]/g, '"')
               .replace(/[\u2013\u2014]/g, '-')
               .replace(/\u2026/g, '...')
               .replace(/\u00A0/g, ' ');
  };

  let pageNumber = 1;
  const margin = 14;
  const pageWidth = doc.internal.pageSize.width;
  
  const addPageHeader = (title: string = 'OviZero · Mosquito Surveillance Summary') => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(primaryGreen);
    doc.text('OviZero', margin, margin + 5);
    
    doc.setFontSize(12);
    doc.setTextColor(nearBlack);
    doc.text(title, margin, margin + 12);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(criticalRed);
    const splitDisclaimer = doc.splitTextToSize('SIMULATED SCENARIO · NO LIVE DEVICES — Synthetic/demo values; not a live deployed network or field-validated epidemiological model.', pageWidth - margin * 2);
    doc.text(splitDisclaimer, margin, margin + 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(mutedGray);
    const dateText = `Period: 7-Day | Location: ${payload.locationLabel}`;
    doc.text(dateText, margin, margin + 26);
    
    const genDate = new Date(payload.generatedAt).toLocaleString();
    const genText = `Exported: ${genDate}`;
    doc.text(genText, pageWidth - margin - doc.getTextWidth(genText), margin + 26);
    
    doc.setDrawColor(27, 127, 71); // #1B7F47
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 26, pageWidth - margin, margin + 26);
  };

  const addPageFooter = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(mutedGray);
      
      const genDate = new Date(payload.generatedAt).toLocaleDateString();
      const footerTextLeft = `Exported: ${genDate} | Period: 7-Day`;
      const footerTextRight = `Page ${i} of ${totalPages}`;
      
      const pageHeight = doc.internal.pageSize.height;
      doc.text(footerTextLeft, margin, pageHeight - 10);
      doc.text(footerTextRight, pageWidth - margin - doc.getTextWidth(footerTextRight), pageHeight - 10);
    }
  };

  // Page 1: Executive Summary
  addPageHeader('Executive Summary');
  let currentY = margin + 30;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(nearBlack);
  doc.text('Overview', margin, currentY);
  currentY += 8;

  const summary = payload.summaries;
  
  // Create a pseudo-grid for cards
  const cardWidth = (pageWidth - margin * 2 - 10) / 3;
  const cardHeight = 20;
  
  const drawMetricCard = (x: number, y: number, title: string, value: string) => {
    doc.setDrawColor(228, 228, 231); // border-gray #E4E4E7
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(x, y, cardWidth, cardHeight, 2, 2, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(mutedGray);
    doc.text(title.toUpperCase(), x + 4, y + 6);
    
    doc.setFontSize(14);
    doc.setTextColor(nearBlack);
    doc.text(value, x + 4, y + 16);
  };

  const rankedZones = getTopPriorityZones(payload.zones, payload.zones.length);
  const topRiskScore = rankedZones.length > 0 ? rankedZones[0].interventionPriority.toString() : 'N/A';
  
  const formatZoneName = (zoneId: string, fallbackName: string) => {
    const loc = getPilotDisplayLocationForMetricZone(zoneId, PILOT_NODES, payload.zones);
    if (loc) {
      return loc.parentZone === loc.sublocation ? loc.parentZone : `${loc.parentZone} · ${loc.sublocation}`;
    }
    return fallbackName;
  };

  const metrics = [
    { title: 'Top-priority location', value: rankedZones.length > 0 ? sanitizePdfText(formatZoneName(rankedZones[0].id, rankedZones[0].name)) : 'None' },
    { title: 'Illustrative intervention priority', value: topRiskScore },
    { title: 'Simulated nodes', value: payload.devices.length.toString() },
    { title: 'High-priority locations', value: (summary.riskDistribution.critical + summary.riskDistribution.high).toString() },
    { title: 'Active field actions', value: summary.interventions.active.toString() },
    { title: 'Follow-up recorded', value: summary.interventions.verified.toString() }
  ];

  for (let i = 0; i < metrics.length; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const x = margin + col * (cardWidth + 5);
    const y = currentY + row * (cardHeight + 5);
    drawMetricCard(x, y, metrics[i].title, metrics[i].value);
  }
  
  currentY += 2 * (cardHeight + 5) + 10;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(nearBlack);
  doc.text('Demo priority bands', margin, currentY);
  currentY += 8;

  const risks = [
    { label: 'Critical', value: summary.riskDistribution.critical },
    { label: 'High', value: summary.riskDistribution.high },
    { label: 'Elevated', value: summary.riskDistribution.elevated },
    { label: 'Watch/Stable', value: summary.riskDistribution.watch }
  ];

  for (let i = 0; i < risks.length; i++) {
    const x = margin + i * (cardWidth + 5);
    const y = currentY;
    
    // Use narrower width (4 items)
    const riskCardWidth = (pageWidth - margin * 2 - 15) / 4;
    
    doc.setDrawColor(228, 228, 231);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin + i * (riskCardWidth + 5), y, riskCardWidth, cardHeight, 2, 2, 'FD');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(mutedGray);
    doc.text(risks[i].label.toUpperCase(), margin + i * (riskCardWidth + 5) + 4, y + 6);
    
    doc.setFontSize(14);
    doc.setTextColor(nearBlack);
    doc.text(risks[i].value.toString(), margin + i * (riskCardWidth + 5) + 4, y + 16);
  }
  currentY += cardHeight + 15;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(mutedGray);

  // Page 2: Priority Zones
  doc.addPage();
  addPageHeader('Priority Locations');
  
  autoTable(doc, {
    startY: margin + 30,
    head: [['Rank', 'Location', 'Priority', 'Demo band', '7-day egg change', 'Demo eggs', 'Temp', 'Humidity', 'Next step']],
    body: rankedZones.map((z, i) => [
      i + 1,
      sanitizePdfText(formatZoneName(z.id, z.name)),
      z.interventionPriority,
      z.demoPriorityBand,
      z.eggActivityChange,
      z.syntheticEggActivity,
      `${z.temperature}°C`,
      `${z.humidity}%`,
      sanitizePdfText(z.actionRequired)
    ]),
    theme: 'striped',
    headStyles: { fillColor: [27, 127, 71] },
    margin: { top: margin + 30, left: margin, right: margin, bottom: 20 },
    styles: { fontSize: 8, font: 'helvetica' },
    columnStyles: {
      8: { cellWidth: 'auto' }
    }
  });

  // Page 3: Devices
  doc.addPage();
  addPageHeader('Devices');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(nearBlack);
  doc.text('Device health', margin, margin + 30);
  
  const dh = summary.deviceHealth;
  const dhText = `Total: ${dh.total} | Low Battery: ${dh.lowBattery} | Strong Signal: ${dh.strongSignal} | Medium Signal: ${dh.mediumSignal} | Weak Signal: ${dh.weakSignal} | Maintenance: ${dh.maintenance}`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedGray);
  doc.text(dhText, margin, margin + 35);
  
  autoTable(doc, {
    startY: margin + 40,
    head: [['Node', 'Location', 'Battery', 'Solar', 'Signal', 'Last update', 'Maintenance']],
    body: payload.devices.map(d => [
      d.id,
      sanitizePdfText(getPilotDisplayLocationForDevice(d.id, PILOT_NODES) || d.location),
      `${d.battery}%`,
      d.solarStatus,
      d.loraSignal,
      d.lastSync,
      d.maintenanceState
    ]),
    theme: 'striped',
    headStyles: { fillColor: [27, 127, 71] },
    margin: { top: margin + 40, left: margin, right: margin, bottom: 20 },
    styles: { fontSize: 7, font: 'helvetica' }
  });

  // Page 4: Interventions
  doc.addPage();
  addPageHeader('Field Actions');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(nearBlack);
  doc.text('Summary', margin, margin + 30);
  
  const iv = summary.interventions;
  const ivText = `Total: ${iv.total} | Active: ${iv.active} | Awaiting follow-up: ${iv.awaitingVerification} | Follow-up recorded: ${iv.verified} | Needs attention: ${(iv.noEffect + iv.escalated)}`;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(mutedGray);
  doc.text(ivText, margin, margin + 35);

  const interventionRows = Object.entries(payload.interventions).map(([zoneId, inv]) => {
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
    
    let displayStatus: string = inv.status;
    if (displayStatus === 'Awaiting Verification') displayStatus = 'Awaiting follow-up';
    if (displayStatus === 'Action Completed') displayStatus = 'Action Completed';
    
    return [
      sanitizePdfText(displayName),
      displayStatus,
      inv.assignedTeam || '-',
      inv.createdAt.split('T')[0] || '-',
      inv.timeline[inv.timeline.length - 1]?.timestamp.split('T')[0] || '-'
    ];
  });

  if (interventionRows.length === 0) {
    doc.setDrawColor(228, 228, 231);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(margin, margin + 40, pageWidth - margin * 2, 20, 2, 2, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(mutedGray);
    doc.text('No intervention records are available for the current session.', margin + 5, margin + 52);
  } else {
    autoTable(doc, {
      startY: margin + 40,
      head: [['Location', 'Status', 'Team', 'Assigned', 'Last update']],
      body: interventionRows,
      theme: 'striped',
      headStyles: { fillColor: [27, 127, 71] },
      margin: { top: margin + 40, left: margin, right: margin, bottom: 20 },
      styles: { fontSize: 8, font: 'helvetica' }
    });
  }

  // Next Page: Activity Logs
  doc.addPage();
  addPageHeader('Activity Logs');

  autoTable(doc, {
    startY: margin + 30,
    head: [['Time', 'Tag', 'Level', 'Activity']],
    body: payload.reportLogs.map(l => [
      l.displayTime,
      l.tag,
      l.level,
      sanitizePdfText(l.message)
    ]),
    theme: 'striped',
    headStyles: { fillColor: [27, 127, 71] },
    margin: { top: margin + 30, left: margin, right: margin, bottom: 20 },
    styles: { fontSize: 8, font: 'helvetica' },
    columnStyles: {
      3: { cellWidth: 'auto' }
    }
  });

  addPageFooter();
  doc.save(filename);
};
