"use client";

import { useState, useEffect } from "react";
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
import { Sun, Moon, Github } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  calculateSIP,
  calculateSWP,
  type CalculationResult,
} from "@/lib/calculations";
import { GrowthChart } from "@/components/growth-chart";
import { BreakdownChart } from "@/components/breakdown-chart";
import { MilestoneChart } from "@/components/milestone-chart";
import { FormattedNumberInput } from "./fromat-number-input";
import { DefaultCalcValues } from "@/lib/constants";
import LOGO from "@/app/images/favicon.png";
import LOGO_LIGHT from "@/app/images/favicon-light.png";
import Image from "next/image";

export function FinanceFlow() {
  const [initialInvestment, setInitialInvestment] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [expectedReturnRate, setExpectedReturnRate] = useState(0);
  const [yearlyChangePercentage, setYearlyChangePercentage] = useState(0);
  const [yearsToProject, setYearsToProject] = useState(0);
  const [calculatorType, setCalculatorType] = useState("SIP");
  const [isDarkMode, setIsDarkMode] = useState(false);
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

    const result =
      calculatorType === "SIP" ? calculateSIP(params) : calculateSWP(params);

    setResults(result);
  }, [
    initialInvestment,
    monthlyAmount,
    expectedReturnRate,
    yearlyChangePercentage,
    yearsToProject,
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
    <Card className={`w-full max-w-3xl mx-auto ${isDarkMode ? "dark" : ""}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-end"><Image src={isDarkMode ? LOGO : LOGO_LIGHT} alt="FF" width={32} />FinFlow</CardTitle>
          <div>
            <a href="https://github.com/bipinkrish/finflow" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Github />
              </Button>
            </a>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {isDarkMode ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
          </div>
        </div>
        <CardDescription>
          <div className="flex justify-between items-center">
            <span>
              Plan your financial future with dynamic SIP/SWP calculator
            </span>
            <ToggleGroup
              type="single"
              value={calculatorType}
              onValueChange={(value) => value && setCalculatorType(value)}
            >
              <ToggleGroupItem value="SIP">SIP</ToggleGroupItem>
              <ToggleGroupItem value="SWP">SWP</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-4" />
        <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Row 1: Initial Investment and Monthly Investment */}
          <div className="grid gap-4 md:col-span-full md:grid-cols-2">
            <div className="flex-1">
              <label htmlFor="initialInvestment">Initial Investment</label>
              <FormattedNumberInput
                id="initialInvestment"
                value={initialInvestment}
                onChange={setInitialInvestment}
                step={1_00_000}
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
                step={1_000}
                unit="₹"
              />
            </div>
          </div>

          {/* Row 2: Expected Return Rate and Yearly Change */}
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

          {/* Slider */}
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

        {/* Graphs */}
        <Separator className="mt-8 mb-4" />
        {showGraphs ? (
          <div className="grid gap-6" id="graphs-container">
            <GrowthChart
              data={results.chartData}
              calculatorType={calculatorType}
            />
            <BreakdownChart
              data={results.pieChartData}
              calculatorType={calculatorType}
            />
            <MilestoneChart data={results.croresMilestones} />
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            Enter some values to see the projections
          </div>
        )}
      </CardContent>
    </Card>
  );
}
