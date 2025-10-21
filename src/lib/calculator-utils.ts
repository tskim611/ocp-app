/**
 * Import Cost Calculator Utilities
 */

import config from './calculator-config.json';

export interface CalculatorInput {
  countryCode: string;
  vehiclePrice: number; // In foreign currency
  engineSize: number; // In cc
  year: number;
}

export interface CostBreakdown {
  // Original values
  vehiclePriceForeign: number;
  foreignCurrency: string;
  exchangeRate: number;

  // Converted to KRW
  vehiclePriceKRW: number;
  shippingCostKRW: number;
  cifValue: number; // Cost + Insurance + Freight

  // Taxes
  importDuty: number;
  specialConsumptionTax: number;
  educationTax: number;
  vat: number;

  // Additional costs
  registrationFee: number;
  inspectionFee: number;
  modificationFee: number;

  // Totals
  totalTaxes: number;
  totalAdditionalCosts: number;
  totalCost: number;

  // Breakdown details
  breakdown: {
    label: string;
    labelKo: string;
    amount: number;
    percentage?: number;
    note?: string;
  }[];
}

/**
 * Get country configuration
 */
export function getCountryConfig(countryCode: string) {
  return config.countries.find((c) => c.code === countryCode);
}

/**
 * Get exchange rate for a currency
 */
export function getExchangeRate(currency: string): number {
  const key = `${currency}_TO_KRW` as keyof typeof config.exchangeRates;
  return config.exchangeRates[key] || 1300; // Default to USD rate
}

/**
 * Calculate shipping cost based on country and engine size
 */
export function calculateShipping(
  countryCode: string,
  engineSize: number
): number {
  const country = getCountryConfig(countryCode);
  if (!country) return 1500000; // Default

  const shippingUSD = country.shippingBase + country.shippingPerCc * engineSize;
  return shippingUSD * getExchangeRate('USD');
}

/**
 * Get special consumption tax rate based on engine size
 */
export function getSpecialTaxRate(engineSize: number): number {
  const brackets = config.taxes.specialConsumptionTax.brackets;

  for (const bracket of brackets) {
    if (engineSize <= bracket.maxEngineSize) {
      return bracket.rate;
    }
  }

  return brackets[brackets.length - 1].rate;
}

/**
 * Get depreciation factor based on year
 */
export function getDepreciationFactor(year: number): number {
  const depreciation = config.depreciation.rates.find((r) => r.year === year);
  if (depreciation) {
    return depreciation.factor;
  }

  // For older cars, use default
  const oldestYear =
    config.depreciation.rates[config.depreciation.rates.length - 1].year;
  if (year < oldestYear) {
    return config.depreciation.defaultOldCarFactor;
  }

  // For newer cars, assume no depreciation
  return 1.0;
}

/**
 * Format number as KRW currency
 */
export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Calculate all import costs
 */
export function calculateImportCosts(
  input: CalculatorInput
): CostBreakdown | null {
  const country = getCountryConfig(input.countryCode);
  if (!country) return null;

  const exchangeRate = getExchangeRate(country.currency);

  // Step 1: Convert vehicle price to KRW
  const vehiclePriceKRW = input.vehiclePrice * exchangeRate;

  // Apply depreciation based on year
  const depreciationFactor = getDepreciationFactor(input.year);
  const adjustedVehiclePriceKRW = vehiclePriceKRW * depreciationFactor;

  // Step 2: Calculate shipping
  const shippingCostKRW = calculateShipping(
    input.countryCode,
    input.engineSize
  );

  // Step 3: Calculate CIF (Cost + Insurance + Freight)
  // Insurance is typically 2-3% of vehicle value
  const insuranceCostKRW = adjustedVehiclePriceKRW * 0.025;
  const cifValue = adjustedVehiclePriceKRW + insuranceCostKRW + shippingCostKRW;

  // Step 4: Calculate Import Duty (관세)
  const importDutyRate = config.taxes.importDuty.rate;
  const importDuty = cifValue * importDutyRate;

  // Step 5: Calculate Special Consumption Tax (개별소비세)
  const specialTaxRate = getSpecialTaxRate(input.engineSize);
  const specialConsumptionTax = (cifValue + importDuty) * specialTaxRate;

  // Step 6: Calculate Education Tax (교육세)
  const educationTaxRate = config.taxes.educationTax.rate;
  const educationTax = specialConsumptionTax * educationTaxRate;

  // Step 7: Calculate VAT (부가가치세)
  const vatRate = config.taxes.vat.rate;
  const taxableBase =
    cifValue + importDuty + specialConsumptionTax + educationTax;
  const vat = taxableBase * vatRate;

  // Step 8: Additional costs
  const registrationFee = config.additionalCosts.registration.baseAmount;
  const inspectionFee = config.additionalCosts.inspection.baseAmount;
  const modificationFee = config.additionalCosts.modification.baseAmount;

  // Step 9: Calculate totals
  const totalTaxes = importDuty + specialConsumptionTax + educationTax + vat;
  const totalAdditionalCosts =
    registrationFee + inspectionFee + modificationFee;
  const totalCost =
    adjustedVehiclePriceKRW +
    shippingCostKRW +
    insuranceCostKRW +
    totalTaxes +
    totalAdditionalCosts;

  // Build breakdown
  const breakdown = [
    {
      label: 'Vehicle Price',
      labelKo: '차량 가격',
      amount: adjustedVehiclePriceKRW,
      percentage: (adjustedVehiclePriceKRW / totalCost) * 100,
      note:
        depreciationFactor < 1
          ? `${input.year} model (${Math.round(depreciationFactor * 100)}% of new)`
          : undefined,
    },
    {
      label: 'Insurance',
      labelKo: '보험료',
      amount: insuranceCostKRW,
      percentage: (insuranceCostKRW / totalCost) * 100,
      note: '2.5% of vehicle value',
    },
    {
      label: 'Shipping',
      labelKo: '운송비',
      amount: shippingCostKRW,
      percentage: (shippingCostKRW / totalCost) * 100,
      note: `From ${country.name}`,
    },
    {
      label: 'Import Duty',
      labelKo: '관세',
      amount: importDuty,
      percentage: (importDuty / totalCost) * 100,
      note: `${importDutyRate * 100}% of CIF`,
    },
    {
      label: 'Special Tax',
      labelKo: '개별소비세',
      amount: specialConsumptionTax,
      percentage: (specialConsumptionTax / totalCost) * 100,
      note: `${specialTaxRate * 100}% (${input.engineSize}cc)`,
    },
    {
      label: 'Education Tax',
      labelKo: '교육세',
      amount: educationTax,
      percentage: (educationTax / totalCost) * 100,
      note: `${educationTaxRate * 100}% of Special Tax`,
    },
    {
      label: 'VAT',
      labelKo: '부가가치세',
      amount: vat,
      percentage: (vat / totalCost) * 100,
      note: `${vatRate * 100}% of taxable base`,
    },
    {
      label: 'Registration',
      labelKo: '등록비',
      amount: registrationFee,
      percentage: (registrationFee / totalCost) * 100,
    },
    {
      label: 'Inspection',
      labelKo: '검사비',
      amount: inspectionFee,
      percentage: (inspectionFee / totalCost) * 100,
    },
    {
      label: 'Modification',
      labelKo: '개조비',
      amount: modificationFee,
      percentage: (modificationFee / totalCost) * 100,
      note: 'Estimated for Korean compliance',
    },
  ];

  return {
    vehiclePriceForeign: input.vehiclePrice,
    foreignCurrency: country.currency,
    exchangeRate,
    vehiclePriceKRW: adjustedVehiclePriceKRW,
    shippingCostKRW,
    cifValue,
    importDuty,
    specialConsumptionTax,
    educationTax,
    vat,
    registrationFee,
    inspectionFee,
    modificationFee,
    totalTaxes,
    totalAdditionalCosts,
    totalCost,
    breakdown,
  };
}

/**
 * Get current year for form defaults
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Generate year options for dropdown
 */
export function getYearOptions(): number[] {
  const currentYear = getCurrentYear();
  const years: number[] = [];

  for (let year = currentYear; year >= 1990; year--) {
    years.push(year);
  }

  return years;
}
