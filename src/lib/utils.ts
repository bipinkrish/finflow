import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
const pdfOptions = {
  margin: 4,
  filename: pdfFileName,
  image: { type: 'jpeg', quality: 100 },
  html2canvas: { scale: 2 },
  jsPDF: { orientation: 'portrait' },
  pagebreak: { mode: 'avoid-all', }
};

let cachedHtml2pdf: any = null;
export const handleDownloadPDF = async () => {
  try {
    if (!cachedHtml2pdf) {
      // @ts-expect-error dynamic load
      const html2pdfModule = await import("@0x170818/html2pdf");
      cachedHtml2pdf = html2pdfModule.default || html2pdfModule;
    }
    const html2pdf = cachedHtml2pdf;

    const element = document.getElementById(exportPdfId);
    if (!element) {
      console.error(`Element with ID "${exportPdfId}" not found.`);
      return;
    }

    html2pdf()
      .set(pdfOptions)
      .from(element)
      .save();
  } catch (error) {
    console.error("Error downloading PDF:", error);
  }
};
