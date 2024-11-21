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
    height: `${Math.round(300 * scale)}px`,
    width: `calc(${width} + ${percentIncrese}%)`,
  }
  return heightWeightStyle;
}
