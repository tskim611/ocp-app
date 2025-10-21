// Tax configuration for Korean car imports
// Based on simplified tier system

export interface TaxConfig {
    duty: number; // Import duty percentage
    vat: number; // VAT percentage
    specialConsumptionTax: number; // Special consumption tax percentage
    educationTax: number; // Education tax (% of special consumption tax)
  }
  
  export interface CountryConfig {
    name: string;
    dutyRate: number; // as decimal (0.08 = 8%)
    ftaEligible: boolean; // Korea FTA partner
  }
  
  export interface VehicleTier {
    name: string;
    minCC: number;
    maxCC: number;
    specialConsumptionTax: number; // as decimal
  }
  
  // Country-specific duty rates
  export const COUNTRIES: Record<string, CountryConfig> = {
    US: {
      name: 'United States',
      dutyRate: 0.00, // 0% with KORUS FTA
      ftaEligible: true
    },
    JP: {
      name: 'Japan',
      dutyRate: 0.08, // 8% (no FTA for cars)
      ftaEligible: false
    },
    UK: {
      name: 'United Kingdom',
      dutyRate: 0.00, // 0% with UK-Korea FTA
      ftaEligible: true
    },
    DE: {
      name: 'Germany',
      dutyRate: 0.00, // 0% with EU-Korea FTA
      ftaEligible: true
    },
    OTHER: {
      name: 'Other',
      dutyRate: 0.08, // 8% default
      ftaEligible: false
    }
  };
  
  // Vehicle tiers based on engine displacement
  export const VEHICLE_TIERS: VehicleTier[] = [
    {
      name: 'Small',
      minCC: 0,
      maxCC: 1000,
      specialConsumptionTax: 0.00 // Exempt (under 1000cc)
    },
    {
      name: 'Mid-size',
      minCC: 1001,
      maxCC: 2000,
      specialConsumptionTax: 0.05 // 5%
    },
    {
      name: 'Large',
      minCC: 2001,
      maxCC: 99999,
      specialConsumptionTax: 0.08 // 8% (over 2000cc)
    }
  ];
  
  // Fixed rates
  export const VAT_RATE = 0.10; // 10%
  export const EDUCATION_TAX_RATE = 0.30; // 30% of special consumption tax
  
  // Shipping estimates (USD)
  export const SHIPPING_COSTS = {
    RORO: {
      US: 2000,
      JP: 800,
      UK: 2500,
      DE: 2200,
      OTHER: 2500
    },
    CONTAINER: {
      US: 3500,
      JP: 1500,
      UK: 4000,
      DE: 3800,
      OTHER: 4000
    }
  };
  
  // Insurance (typically 1-2% of car value)
  export const INSURANCE_RATE = 0.015; // 1.5%
  
  // Port & broker fees (flat estimate in KRW)
  export const PORT_FEES = 800000; // ₩800k
  export const BROKER_FEES = 500000; // ₩500k
  
  // Registration tax (simplified estimate based on vehicle value)
  export const REGISTRATION_TAX_RATE = 0.05; // 5% of taxable value
  
  // Helper function to get vehicle tier
  export function getVehicleTier(engineCC: number): VehicleTier {
    return VEHICLE_TIERS.find(
      tier => engineCC >= tier.minCC && engineCC <= tier.maxCC
    ) || VEHICLE_TIERS[VEHICLE_TIERS.length - 1];
  }
  
  // Helper function to calculate total import cost
  export interface ImportCostBreakdown {
    purchasePriceUSD: number;
    purchasePriceKRW: number;
    shippingUSD: number;
    shippingKRW: number;
    insuranceUSD: number;
    insuranceKRW: number;
    cifKRW: number;
    dutyKRW: number;
    vatKRW: number;
    specialConsumptionTaxKRW: number;
    educationTaxKRW: number;
    registrationTaxKRW: number;
    portFeesKRW: number;
    brokerFeesKRW: number;
    totalLandedCostKRW: number;
    exchangeRate: number;
  }
  
  export function calculateImportCost(
    purchasePriceUSD: number,
    country: string,
    engineCC: number,
    shippingMethod: 'RORO' | 'CONTAINER',
    exchangeRate: number
  ): ImportCostBreakdown {
    // Get configurations
    const countryConfig = COUNTRIES[country] || COUNTRIES.OTHER;
    const vehicleTier = getVehicleTier(engineCC);
    
    // Calculate shipping
    const shippingCosts = SHIPPING_COSTS[shippingMethod];
    const shippingUSD = shippingCosts[country as keyof typeof shippingCosts] || shippingCosts.OTHER;
    
    // Calculate insurance
    const insuranceUSD = purchasePriceUSD * INSURANCE_RATE;
    
    // Convert to KRW
    const purchasePriceKRW = purchasePriceUSD * exchangeRate;
    const shippingKRW = shippingUSD * exchangeRate;
    const insuranceKRW = insuranceUSD * exchangeRate;
    
    // CIF (Cost, Insurance, Freight)
    const cifKRW = purchasePriceKRW + shippingKRW + insuranceKRW;
    
    // Import duty
    const dutyKRW = cifKRW * countryConfig.dutyRate;
    
    // Special consumption tax (based on CIF + Duty)
    const taxableBase = cifKRW + dutyKRW;
    const specialConsumptionTaxKRW = taxableBase * vehicleTier.specialConsumptionTax;
    
    // Education tax (30% of special consumption tax)
    const educationTaxKRW = specialConsumptionTaxKRW * EDUCATION_TAX_RATE;
    
    // VAT (10% of CIF + Duty + Special Tax + Education Tax)
    const vatBase = cifKRW + dutyKRW + specialConsumptionTaxKRW + educationTaxKRW;
    const vatKRW = vatBase * VAT_RATE;
    
    // Registration tax (simplified: 5% of CIF)
    const registrationTaxKRW = cifKRW * REGISTRATION_TAX_RATE;
    
    // Port and broker fees
    const portFeesKRW = PORT_FEES;
    const brokerFeesKRW = BROKER_FEES;
    
    // Total landed cost
    const totalLandedCostKRW = 
      cifKRW + 
      dutyKRW + 
      vatKRW + 
      specialConsumptionTaxKRW + 
      educationTaxKRW + 
      registrationTaxKRW + 
      portFeesKRW + 
      brokerFeesKRW;
    
    return {
      purchasePriceUSD,
      purchasePriceKRW,
      shippingUSD,
      shippingKRW,
      insuranceUSD,
      insuranceKRW,
      cifKRW,
      dutyKRW,
      vatKRW,
      specialConsumptionTaxKRW,
      educationTaxKRW,
      registrationTaxKRW,
      portFeesKRW,
      brokerFeesKRW,
      totalLandedCostKRW,
      exchangeRate
    };
  } 
