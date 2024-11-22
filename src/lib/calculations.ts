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

function calculateInvestment(
  params: CalculationParams & {
    type: 'SIP' | 'SWP'
  }
): CalculationResult {
  const {
    initialInvestment,
    monthlyAmount,
    expectedReturnRate,
    yearlyChangePercentage,
    yearsToProject,
    type
  } = params;

  const initialCrore = Math.floor(initialInvestment / 1_00_00_000);
  let totalInvestment = initialInvestment;
  let monthlyAmountValue = monthlyAmount;
  let year = 0;
  const croresMilestones = [];
  const chartData = [];
  let lastCroreYear = 0;

  // Track additional values based on calculation type
  let totalContributed = type === 'SIP' ? initialInvestment : 0;
  let totalWithdrawn = type === 'SWP' ? 0 : 0;

  while (year < yearsToProject && (type === 'SIP' || totalInvestment > 0)) {
    const yearValue = totalInvestment;

    for (let month = 1; month <= 12; month++) {
      if (type === 'SIP') {
        totalInvestment += monthlyAmountValue;
        totalContributed += monthlyAmountValue;
        totalInvestment *= 1 + expectedReturnRate / 100 / 12;
      } else { // SWP
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

    const currentCrore = Math.floor(totalInvestment / 1_00_00_000);
    const croreThreshold = type === 'SWP' ?
      croresMilestones.length + initialCrore :
      croresMilestones.length;

    if (currentCrore > croreThreshold) {
      const yearFraction =
        year -
        1 +
        Math.log((1_00_00_000 * currentCrore) / yearValue) /
        Math.log(yearValue / totalInvestment);

      croresMilestones.push({
        crores: currentCrore,
        years: yearFraction,
        timeFromPrevious: yearFraction - lastCroreYear,
      });
      lastCroreYear = yearFraction;
    }
  }

  const pieChartData = type === 'SIP'
    ? [
      { name: "Total Invested", value: totalContributed },
      { name: "Total Profit", value: totalInvestment - totalContributed },
    ]
    : [
      { name: "Remaining Investment", value: totalInvestment },
      { name: "Total Withdrawn", value: totalWithdrawn },
    ];

  return {
    croresMilestones,
    chartData,
    pieChartData,
  };
}

export function calculateSIP(params: CalculationParams): CalculationResult {
  return calculateInvestment({ ...params, type: 'SIP' });
}

export function calculateSWP(params: CalculationParams): CalculationResult {
  return calculateInvestment({ ...params, type: 'SWP' });
}
