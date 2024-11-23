// types.ts
import { CalculationResult } from "@/lib/calculations";

export interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export interface CalculatorOptionsProps {
    calculatorType: string | "SIP" | "SWP";
    setCalculatorType: (type: string | "SIP" | "SWP") => void;
    realMode: boolean;
    setRealMode: (mode: boolean) => void;
}

export interface InputSectionProps {
    calculatorType: string | "SIP" | "SWP";
    initialInvestment: number;
    setInitialInvestment: (value: number) => void;
    monthlyAmount: number;
    setMonthlyAmount: (value: number) => void;
    expectedReturnRate: number;
    setExpectedReturnRate: (value: number) => void;
    yearlyChangePercentage: number;
    setYearlyChangePercentage: (value: number) => void;
    yearsToProject: number;
    setYearsToProject: (value: number) => void;
}

export interface GraphSectionProps {
    showGraphs: boolean;
    results: CalculationResult;
    calculatorType: string | "SIP" | "SWP";
}
