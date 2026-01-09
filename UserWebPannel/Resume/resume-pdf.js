import jsPDF from "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js";
import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";

document.getElementById("downloadPdfBtn").addEventListener("click", async () => {
  const resume = document.getElementById("resumeContainer");

  // Capture as canvas
  const canvas = await html2canvas(resume, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");

  // Create PDF
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "pt", "a4"); // portrait A4
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("Resume.pdf");
});
