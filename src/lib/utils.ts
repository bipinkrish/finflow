import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const calcGraphsSize = (percentIncrese: number = 0) => {
  const scale = Math.min(1, window.innerWidth / 500);
  const graphsContainer = document.querySelector("#graphs-container");
  const width = graphsContainer?.clientWidth + "px";
  const heightWeightStyle = {
    height: `${Math.round(500 * scale)}px`,
    width: `calc(${width} + ${percentIncrese}%)`,
  }
  return heightWeightStyle;
}

export const exportPdfId = "export-card-container";
const pdfFileName = "FinFlow.pdf";

export const handleDownloadPDF = () => {
  const cardElement = document.getElementById(exportPdfId);

  if (cardElement) {
    html2canvas(cardElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(pdfFileName);
    });
  }
};
