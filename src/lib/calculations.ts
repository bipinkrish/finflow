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

export function calculateSIP({
  initialInvestment,
  monthlyAmount,
  expectedReturnRate,
  yearlyChangePercentage,
  yearsToProject,
}: CalculationParams): CalculationResult {
  let totalInvestment = initialInvestment;
  let totalContributed = initialInvestment;
  let monthlyInvestmentAmount = monthlyAmount;
  let year = 0;
  const croresMilestones = [];
  const chartData = [];
  let lastCroreYear = 0;

  while (year < yearsToProject) {
    const yearValue = totalInvestment;
    for (let month = 1; month <= 12; month++) {
      totalInvestment += monthlyInvestmentAmount;
      totalContributed += monthlyInvestmentAmount;
      totalInvestment *= 1 + expectedReturnRate / 100 / 12;
    }

    year++;
    if (year % 1 === 0) {
      monthlyInvestmentAmount *= 1 + yearlyChangePercentage / 100;
    }

    chartData.push({
      year,
      value: Math.round(totalInvestment),
    });

    const currentCrore = Math.floor(totalInvestment / 10000000);
    if (currentCrore > croresMilestones.length) {
      const yearFraction =
        year -
        1 +
        Math.log((10000000 * currentCrore) / yearValue) /
          Math.log(totalInvestment / yearValue);
      croresMilestones.push({
        crores: currentCrore,
        years: yearFraction,
        timeFromPrevious: yearFraction - lastCroreYear,
      });
      lastCroreYear = yearFraction;
    }
  }

  return {
    croresMilestones,
    chartData,
    pieChartData: [
      { name: "Total Invested", value: totalContributed },
      { name: "Total Profit", value: totalInvestment - totalContributed },
    ],
  };
}

export function calculateSWP({
  initialInvestment,
  monthlyAmount,
  expectedReturnRate,
  yearlyChangePercentage,
  yearsToProject,
}: CalculationParams): CalculationResult {
  const initalCrore = Math.floor(initialInvestment / 10000000);
  let totalInvestment = initialInvestment;
  let totalWithdrawn = 0;
  let monthlyWithdrawalAmount = monthlyAmount;
  let year = 0;
  const croresMilestones = [];
  const chartData = [];
  let lastCroreYear = 0;

  while (year < yearsToProject && totalInvestment > 0) {
    const yearValue = totalInvestment;
    for (let month = 1; month <= 12; month++) {
      totalInvestment *= 1 + expectedReturnRate / 100 / 12;
      if (totalInvestment >= monthlyWithdrawalAmount) {
        totalInvestment -= monthlyWithdrawalAmount;
        totalWithdrawn += monthlyWithdrawalAmount;
      } else {
        totalWithdrawn += totalInvestment;
        totalInvestment = 0;
        break;
      }
    }

    year++;
    if (year % 1 === 0) {
      monthlyWithdrawalAmount *= 1 + yearlyChangePercentage / 100;
    }

    chartData.push({
      year,
      value: Math.round(totalInvestment),
    });

    const currentCrore = Math.floor(totalInvestment / 10000000);
    if (currentCrore > (croresMilestones.length + initalCrore)) {
      const yearFraction =
        year -
        1 +
        Math.log((10000000 * currentCrore) / yearValue) /
          Math.log(yearValue / totalInvestment);
      croresMilestones.push({
        crores: currentCrore,
        years: yearFraction,
        timeFromPrevious: yearFraction - lastCroreYear,
      });
      lastCroreYear = yearFraction;
    }
  }

  return {
    croresMilestones,
    chartData,
    pieChartData: [
      { name: "Remaining Investment", value: totalInvestment },
      { name: "Total Withdrawn", value: totalWithdrawn },
    ],
  };
}
