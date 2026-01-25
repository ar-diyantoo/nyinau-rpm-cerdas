import jsPDF from 'jspdf';

interface LessonPlan {
  title?: string;
  satuan_pendidikan?: string;
  jenjang?: string;
  fase?: string;
  semester?: string;
  subject?: string;
  topic?: string;
  duration_jp?: number;
  capaian_pembelajaran?: string;
  learning_objectives?: string;
  meaningful_understanding?: string;
  trigger_questions?: string;
  activities_opening?: string;
  activities_core?: string;
  activities_closing?: string;
  assessment_initial?: string;
  assessment_formative?: string;
  assessment_summative?: string;
  resources?: string;
  reflection_teacher?: string;
  reflection_students?: string;
  profil_pelajar_pancasila?: string[];
  learning_approach?: string[];
}

export const exportToPDF = (plan: LessonPlan) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primaryColor: [number, number, number] = [0, 119, 204];
  const textColor: [number, number, number] = [51, 51, 51];
  const mutedColor: [number, number, number] = [102, 102, 102];

  const checkPageBreak = (requiredHeight: number) => {
    if (y + requiredHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  const addSectionTitle = (title: string) => {
    checkPageBreak(15);
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(margin, y, contentWidth, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 3, y + 5.5);
    y += 12;
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  };

  const addParagraph = (text: string, isBold = false) => {
    if (!text) return;
    doc.setFontSize(10);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, contentWidth - 6);
    const lineHeight = 5;
    const totalHeight = lines.length * lineHeight;
    
    checkPageBreak(totalHeight + 5);
    
    lines.forEach((line: string) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin + 3, y);
      y += lineHeight;
    });
    y += 2;
  };

  const addLabelValue = (label: string, value: string) => {
    if (!value) return;
    checkPageBreak(10);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text(label + ':', margin + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    
    const labelWidth = doc.getTextWidth(label + ': ');
    const valueLines = doc.splitTextToSize(value, contentWidth - labelWidth - 10);
    
    if (valueLines.length === 1) {
      doc.text(valueLines[0], margin + 3 + labelWidth, y);
      y += 6;
    } else {
      y += 5;
      valueLines.forEach((line: string) => {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin + 6, y);
        y += 5;
      });
    }
    y += 1;
  };

  // Header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('RENCANA PEMBELAJARAN MENDALAM', pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('(RPM)', pageWidth / 2, 22, { align: 'center' });
  doc.setFontSize(10);
  doc.text(plan.title || 'Untitled', pageWidth / 2, 30, { align: 'center' });
  
  y = 45;
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  // Section 1: Identitas
  addSectionTitle('📌 IDENTITAS PEMBELAJARAN');
  addLabelValue('Satuan Pendidikan', plan.satuan_pendidikan || '-');
  addLabelValue('Jenjang / Fase', `${plan.jenjang || '-'} / ${plan.fase || '-'}`);
  addLabelValue('Semester', plan.semester || '-');
  addLabelValue('Mata Pelajaran', plan.subject || '-');
  addLabelValue('Topik/Materi', plan.topic || '-');
  addLabelValue('Durasi', `${plan.duration_jp || '-'} JP`);
  y += 5;

  // Section 2: Capaian & Tujuan
  addSectionTitle('🎯 CAPAIAN & TUJUAN PEMBELAJARAN');
  addLabelValue('Capaian Pembelajaran', plan.capaian_pembelajaran || '-');
  addLabelValue('Tujuan Pembelajaran', plan.learning_objectives || '-');
  
  if (plan.profil_pelajar_pancasila?.length) {
    addLabelValue('Profil Pelajar Pancasila', plan.profil_pelajar_pancasila.join(', '));
  }
  if (plan.learning_approach?.length) {
    addLabelValue('Pendekatan Pembelajaran', plan.learning_approach.join(', '));
  }
  y += 5;

  // Section 3: Pemahaman Bermakna
  addSectionTitle('💡 PEMAHAMAN BERMAKNA');
  addParagraph(plan.meaningful_understanding || 'Belum diisi');
  y += 3;

  // Section 4: Pertanyaan Pemantik
  addSectionTitle('❓ PERTANYAAN PEMANTIK');
  addParagraph(plan.trigger_questions || 'Belum diisi');
  y += 3;

  // Section 5: Kegiatan Pembelajaran
  addSectionTitle('📚 KEGIATAN PEMBELAJARAN');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  addParagraph('Kegiatan Pendahuluan:', true);
  doc.setFont('helvetica', 'normal');
  addParagraph(plan.activities_opening || 'Belum diisi');
  
  addParagraph('Kegiatan Inti:', true);
  addParagraph(plan.activities_core || 'Belum diisi');
  
  addParagraph('Kegiatan Penutup:', true);
  addParagraph(plan.activities_closing || 'Belum diisi');
  y += 3;

  // Section 6: Asesmen
  addSectionTitle('📊 ASESMEN');
  addLabelValue('Asesmen Awal (Diagnostik)', plan.assessment_initial || '-');
  addLabelValue('Asesmen Formatif', plan.assessment_formative || '-');
  addLabelValue('Asesmen Sumatif', plan.assessment_summative || '-');
  y += 3;

  // Section 7: Sumber Belajar
  addSectionTitle('📖 SUMBER BELAJAR');
  addParagraph(plan.resources || 'Belum diisi');
  y += 3;

  // Section 8: Refleksi
  addSectionTitle('🔄 REFLEKSI');
  addLabelValue('Refleksi Guru', plan.reflection_teacher || '-');
  addLabelValue('Refleksi Siswa', plan.reflection_students || '-');

  // Footer on each page
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text(
      `Halaman ${i} dari ${pageCount} | Dibuat dengan Nyinauidn`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      pageWidth - margin,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // Save the PDF
  const filename = `RPM-${plan.title?.replace(/[^a-zA-Z0-9]/g, '_') || 'dokumen'}-${Date.now()}.pdf`;
  doc.save(filename);
  
  return filename;
};
