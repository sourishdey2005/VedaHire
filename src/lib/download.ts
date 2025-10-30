'use client';

import jsPDF from 'jspdf';

export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadPdf(content: string, filename: string) {
  const doc = new jsPDF();
  
  const margin = 15;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = pageWidth - margin * 2;
  
  const lines = doc.splitTextToSize(content, textWidth);
  
  let cursor = margin;
  
  lines.forEach((line: string) => {
    if (cursor > pageHeight - margin) {
      doc.addPage();
      cursor = margin;
    }
    doc.text(line, margin, cursor);
    cursor += 7; // Line height
  });

  doc.save(filename);
}
