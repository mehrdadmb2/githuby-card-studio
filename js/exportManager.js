// ============================================================
//  EXPORT MANAGER – PNG, PDF, Print
// ============================================================
const ExportManager = (function() {
  function exportImage(cardElement) {
    if (!cardElement) return;
    html2canvas(cardElement, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: null,
      logging: false
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'postcard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }).catch(err => alert('Error: ' + err));
  }

  function exportPDF(cardElement) {
    if (!cardElement) return;
    html2canvas(cardElement, {
      scale: 2.5,
      useCORS: true,
      backgroundColor: null,
      logging: false
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('postcard.pdf');
    }).catch(err => alert('Error: ' + err));
  }

  function printCard() {
    window.print();
  }

  return {
    exportImage,
    exportPDF,
    printCard
  };
})();

window.ExportManager = ExportManager;
