import { CRORE } from "./constants";

const inflationRate = 5; // per year
const taxRate = 12.5; // of total

export interface CalculationParams {
  initialInvestment: number;
  monthlyAmount: number;
  expectedReturnRate: number;
  yearlyChangePercentage: number;
  yearsToProject: number;
}

export interface CalculationResult {
  croresMilestones: Array<{
    crores: number;
    years: number;
    timeFromPrevious: number;
  }>;
  chartData: Array<{
    year: number;
    value: number;
  }>;
  pieChartData: Array<{
    name: string;
    value: number;
  }>;
}

function calculatePresentValue(
  futureValue: number,
  inflationRate: number,
  years: number
) {
  const rate = inflationRate / 100;
  return futureValue / Math.pow(1 + rate, years);
}

function calculateAfterTax(amount: number, taxRate: number) {
  const rate = taxRate / 100;
  return amount * (1 - rate);
}

function makeItReal(
  { chartData, pieChartData, croresMilestones }: CalculationResult,
  inflationRate: number,
  taxRate: number,
  yearsToProject: number
): CalculationResult {
  const realChartData = chartData.map(({ year, value }) => ({
    year,
    value: calculateAfterTax(
      calculatePresentValue(value, inflationRate, year),
      taxRate
    ),
  }));

  const realPieChartData = pieChartData.map(({ name, value }) => ({
    name,
    value: calculateAfterTax(
      calculatePresentValue(value, inflationRate, yearsToProject),
      taxRate
    ),
  }));

  return {
    croresMilestones,
    chartData: realChartData,
    pieChartData: realPieChartData,
  };
}

export function calculate(
  params: CalculationParams,
  type: "SIP" | "SWP",
  realMode: boolean = false
): CalculationResult {
  const {
    initialInvestment,
    monthlyAmount,
    expectedReturnRate,
    yearlyChangePercentage,
    yearsToProject,
  } = params;

  const initialCrore = Math.floor(initialInvestment / CRORE);
  let totalInvestment = initialInvestment;
  let monthlyAmountValue = monthlyAmount;
  let year = 0;
  const croresMilestones = [];
  const chartData = [];
  let lastCroreYear = 0;

  // Track additional values based on calculation type
  let totalContributed = type === "SIP" ? initialInvestment : 0;
  let totalWithdrawn = type === "SWP" ? 0 : 0;

  while (year < yearsToProject && (type === "SIP" || totalInvestment > 0)) {
    const yearValue = totalInvestment;

    for (let month = 1; month <= 12; month++) {
      if (type === "SIP") {
        totalInvestment += monthlyAmountValue;
        totalContributed += monthlyAmountValue;
        totalInvestment *= 1 + expectedReturnRate / 100 / 12;
      } else {
        // SWP
        if (totalInvestment >= monthlyAmountValue) {
          totalInvestment -= monthlyAmountValue;
          totalWithdrawn += monthlyAmountValue;
          totalInvestment *= 1 + expectedReturnRate / 100 / 12;
        } else {
          totalWithdrawn += totalInvestment;
          totalInvestment = 0;
          break;
        }
      }
    }

    year++;
    if (year % 1 === 0) {
      monthlyAmountValue *= 1 + yearlyChangePercentage / 100;
    }

    chartData.push({
      year,
      value: Math.round(totalInvestment),
    });

    const currentCrore = Math.floor(totalInvestment / CRORE);
    const croreThreshold =
      type === "SWP"
        ? croresMilestones.length + initialCrore
        : croresMilestones.length;

    if (currentCrore > croreThreshold) {
      const yearFraction =
        year -
        1 +
        Math.log((CRORE * currentCrore) / yearValue) /
          Math.log(yearValue / totalInvestment);

      croresMilestones.push({
        crores: currentCrore,
        years: yearFraction,
        timeFromPrevious: yearFraction - lastCroreYear,
      });
      lastCroreYear = yearFraction;
    }
  }

  const pieChartData =
    type === "SIP"
      ? [
          { name: "Total Invested", value: totalContributed },
          { name: "Total Profit", value: totalInvestment - totalContributed },
        ]
      : [
          { name: "Remaining Investment", value: totalInvestment },
          { name: "Total Withdrawn", value: totalWithdrawn },
        ];

  const baseValues = {
    chartData,
    pieChartData,
    croresMilestones,
  };

  if (realMode) {
    return makeItReal(baseValues, inflationRate, taxRate, yearsToProject);
  }
  return baseValues;
}
