"use client";

import { useState, useEffect, FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Github, Download } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { calculate, type CalculationResult } from "@/lib/calculations";
import { GrowthChart } from "@/components/growth-chart";
import { BreakdownChart } from "@/components/breakdown-chart";
import { MilestoneChart } from "@/components/milestone-chart";
import { FormattedNumberInput } from "./fromat-number-input";
import { DefaultCalcValues, LAKH, THOUSAND } from "@/lib/constants";
import LOGO from "@/app/images/favicon.png";
import LOGO_LIGHT from "@/app/images/favicon-light.png";
import Image from "next/image";
import { exportPdfId, handleDownloadPDF } from "@/lib/utils";
import { CalculatorOptionsProps, GraphSectionProps, HeaderProps, InputSectionProps } from "@/lib/types";
import packageJson from "../../package.json";
const { version } = packageJson;

export const Header: FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-end">
            <Image src={isDarkMode ? LOGO : LOGO_LIGHT} alt="FF" width={32} />
            FinFlow
          </CardTitle>
          <div>
            <a
              href="https://github.com/bipinkrish/finflow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github />
              </Button>
            </a>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun /> : <Moon />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDownloadPDF}>
              <Download />
            </Button>
          </div>
        </div>
        <CardDescription>
          Plan your financial future with dynamic SIP/SWP calculator
        </CardDescription>
      </CardHeader>
    </>
  );
}

export const CalculatorOptions: FC<CalculatorOptionsProps> = ({
  calculatorType,
  setCalculatorType,
  realMode,
  setRealMode,
}) => {
  return (
    <>
      <div className="flex flex-wrap place-content-between items-center mb-4 gap-4">
        <div className="flex gap-2">
          <ToggleGroup
            type="single"
            variant="outline"
            value={calculatorType}
            onValueChange={(value) => value && setCalculatorType(value)}
          >
            <ToggleGroupItem value="SIP">SIP</ToggleGroupItem>
            <ToggleGroupItem value="SWP">SWP</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="flex items-center gap-1">
          <Toggle
            variant="outline"
            onPressedChange={setRealMode}
            className="important-button"
          >
            Real Mode
          </Toggle>
          <div className="text-xs text-muted-foreground text-center sm:ml-4 w-full sm:w-auto">
            <span className="block">5% p.a. Inflation and 12.5% LTCG</span>
            <span className="block">tax will be considered on profit.</span>
          </div>
        </div>
      </div>
    </>
  );
};

export const InputSection: FC<InputSectionProps> = ({
  calculatorType,
  initialInvestment,
  setInitialInvestment,
  monthlyAmount,
  setMonthlyAmount,
  expectedReturnRate,
  setExpectedReturnRate,
  yearlyChangePercentage,
  setYearlyChangePercentage,
  yearsToProject,
  setYearsToProject
}) => {
  return (
    <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div className="grid gap-4 md:col-span-full md:grid-cols-2">
        <div className="flex-1">
          <label htmlFor="initialInvestment">Initial Investment</label>
          <FormattedNumberInput
            id="initialInvestment"
            value={initialInvestment}
            onChange={setInitialInvestment}
            step={LAKH}
            unit="₹"
          />
        </div>
        <div className="flex-1">
          <label htmlFor="monthlyAmount">
            Monthly {calculatorType == "SIP" ? "Investment" : "Withdrawal"}
          </label>
          <FormattedNumberInput
            id="monthlyAmount"
            value={monthlyAmount}
            onChange={setMonthlyAmount}
            step={THOUSAND}
            unit="₹"
          />
        </div>
      </div>

      <div className="grid gap-4 md:col-span-full md:grid-cols-2">
        <div className="flex-1">
          <Label htmlFor="expectedReturnRate">Expected Return Rate</Label>
          <FormattedNumberInput
            id="expectedReturnRate"
            value={expectedReturnRate}
            onChange={setExpectedReturnRate}
            step={1}
            unit="%"
            showFooter={false}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="yearlyChangePercentage">
            Yearly {calculatorType} Increase
          </Label>
          <FormattedNumberInput
            id="yearlyChangePercentage"
            value={yearlyChangePercentage}
            onChange={setYearlyChangePercentage}
            step={1}
            unit="%"
            showFooter={false}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 col-span-full mt-2">
        <Label htmlFor="yearsToProject" className="whitespace-nowrap">
          Years to Project: {yearsToProject}
        </Label>
        <Slider
          id="yearsToProject"
          min={1}
          max={50}
          step={1}
          value={[yearsToProject]}
          onValueChange={(value) => setYearsToProject(value[0])}
          className="flex-1"
        />
      </div>
    </div>
  );
}

export const GraphSection: FC<GraphSectionProps> = ({
  showGraphs,
  results,
  calculatorType
}) => {
  if (!showGraphs) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No Values to see the projections
      </div>
    );
  }

  return (
    <div className="grid gap-6" id="graphs-container">
      <GrowthChart data={results.chartData} calculatorType={calculatorType} />
      <BreakdownChart data={results.pieChartData} calculatorType={calculatorType} />
      <MilestoneChart data={results.croresMilestones} />
    </div>
  );
}

export function FinanceFlow() {
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [expectedReturnRate, setExpectedReturnRate] = useState(0);
  const [yearlyChangePercentage, setYearlyChangePercentage] = useState(0);
  const [yearsToProject, setYearsToProject] = useState(0);
  const [calculatorType, setCalculatorType] = useState("SIP");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [realMode, setRealMode] = useState(false);
  const [results, setResults] = useState<CalculationResult>({
    croresMilestones: [],
    chartData: [],
    pieChartData: [],
  });
  const showGraphs = initialInvestment > 0 || monthlyAmount > 0;

  useEffect(() => {
    const savedPreference = localStorage.getItem("theme");

    if (savedPreference) {
      const isDark = savedPreference === "dark";
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  useEffect(() => {
    const params = {
      initialInvestment,
      monthlyAmount,
      expectedReturnRate,
      yearlyChangePercentage,
      yearsToProject,
    };

    const result = calculate(
      params,
      calculatorType === "SIP" ? "SIP" : "SWP",
      realMode
    );
    setResults(result);
  }, [
    initialInvestment,
    monthlyAmount,
    expectedReturnRate,
    yearlyChangePercentage,
    yearsToProject,
    realMode,
  ]);

  useEffect(() => {
    const defaultValues = DefaultCalcValues[calculatorType];
    setInitialInvestment(defaultValues.initial);
    setMonthlyAmount(defaultValues.monthly);
    setExpectedReturnRate(defaultValues.expected);
    setYearlyChangePercentage(defaultValues.yearly);
    setYearsToProject(defaultValues.years);
  }, [calculatorType]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", !isDarkMode ? "dark" : "light");
  };

  return (
    <Card id={exportPdfId} className={`w-full max-w-3xl mx-auto my-2 ${isDarkMode ? "dark" : ""}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <CardContent>
        <Separator className="mb-4" />
        <CalculatorOptions
          calculatorType={calculatorType}
          setCalculatorType={setCalculatorType}
          realMode={realMode}
          setRealMode={setRealMode}
        />
        <Separator className="mb-4" />
        <InputSection
          calculatorType={calculatorType}
          initialInvestment={initialInvestment}
          setInitialInvestment={setInitialInvestment}
          monthlyAmount={monthlyAmount}
          setMonthlyAmount={setMonthlyAmount}
          expectedReturnRate={expectedReturnRate}
          setExpectedReturnRate={setExpectedReturnRate}
          yearlyChangePercentage={yearlyChangePercentage}
          setYearlyChangePercentage={setYearlyChangePercentage}
          yearsToProject={yearsToProject}
          setYearsToProject={setYearsToProject}
        />
        <Separator className="mt-8 mb-4" />
        <GraphSection
          showGraphs={showGraphs}
          results={results}
          calculatorType={calculatorType}
        />
      </CardContent>
      <Separator className="mt-2" />
      <div className="text-center text-xs text-muted-foreground">
        MIT Licensed © 2024 Bipin | v{version} | Best viewed in Desktop Browser
      </div>
    </Card>
  );
}
