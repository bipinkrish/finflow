export const CRORE = 1_00_00_000;
export const LAKH = 1_00_000;
export const THOUSAND = 1_000;

interface CalculationParams {
  initial: number;
  monthly: number;
  expected: number;
  yearly: number;
  years: number;
}

interface DefaultValsParams {
  [key: string]: CalculationParams;
}

export const DefaultCalcValues: DefaultValsParams = {
  SIP: {
    initial: 10_00_000,
    monthly: 15_000,
    expected: 12,
    yearly: 10,
    years: 20,
  },
  SWP: {
    initial: 5_00_00_000,
    monthly: LAKH,
    expected: 10,
    yearly: 7,
    years: 30,
  },
};
