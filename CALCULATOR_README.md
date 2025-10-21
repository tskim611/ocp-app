# Import Cost Calculator

A comprehensive tool for calculating the total cost of importing a vehicle to Korea.

## Features

- **Multi-currency support**: Calculate costs from US, Germany, UK, Japan, Canada, and Australia
- **Real-time calculations**: Instant cost breakdown as you enter details
- **Comprehensive tax calculations**: Includes all Korean import taxes and fees
- **Mobile-friendly**: Fully responsive design works on all devices
- **Bilingual**: Korean and English labels throughout
- **Detailed breakdown**: See exactly where your money goes

## What's Calculated

### Taxes (세금)

- **Import Duty (관세)**: 8% of CIF value
- **Special Consumption Tax (개별소비세)**: 0-8% based on engine size
  - Under 1000cc: 0%
  - 1001-2000cc: 5%
  - Over 2000cc: 8%
- **Education Tax (교육세)**: 30% of Special Consumption Tax
- **VAT (부가가치세)**: 10% of taxable base

### Additional Costs (추가 비용)

- **Shipping (운송비)**: Varies by country and engine size
- **Insurance (보험료)**: 2.5% of vehicle value
- **Registration (등록비)**: ₩50,000
- **Inspection (검사비)**: ₩200,000
- **Modification (개조비)**: ₩500,000 (estimated)

### Vehicle Depreciation

The calculator automatically applies depreciation based on vehicle year:

- 2024: 100% of value
- 2023: 90% of value
- 2022: 82% of value
- And so on...

## Files Structure

```
src/
├── lib/
│   ├── calculator-config.json    # Configuration (exchange rates, tax rates)
│   └── calculator-utils.ts       # Calculation logic
├── components/
│   ├── ImportCostCalculator.tsx  # Main calculator form
│   └── CostBreakdownDisplay.tsx  # Results display
└── app/
    └── calculator/
        └── page.tsx              # Calculator page route
```

## Configuration

Edit `src/lib/calculator-config.json` to update:

### Exchange Rates

```json
{
  "exchangeRates": {
    "USD_TO_KRW": 1300,
    "EUR_TO_KRW": 1420,
    "GBP_TO_KRW": 1650,
    "JPY_TO_KRW": 9.5
  }
}
```

### Tax Rates

```json
{
  "taxes": {
    "importDuty": { "rate": 0.08 },
    "vat": { "rate": 0.1 }
  }
}
```

### Shipping Costs

```json
{
  "countries": [
    {
      "code": "US",
      "shippingBase": 1200,
      "shippingPerCc": 0.5
    }
  ]
}
```

## Usage

### Basic Example

1. Go to `/calculator` page
2. Select country of origin
3. Enter vehicle price in foreign currency
4. Enter engine size (cc)
5. Select year
6. Click "Calculate"

### In Code

```typescript
import { calculateImportCosts } from '@/lib/calculator-utils';

const result = calculateImportCosts({
  countryCode: 'US',
  vehiclePrice: 30000,
  engineSize: 2000,
  year: 2023,
});

console.log(result.totalCost); // Total in KRW
console.log(result.breakdown); // Detailed breakdown
```

## Calculation Formula

### CIF Value

```
CIF = Vehicle Price + Insurance (2.5%) + Shipping
```

### Import Duty

```
Import Duty = CIF × 8%
```

### Special Consumption Tax

```
Special Tax = (CIF + Import Duty) × Rate (0-8%)
```

### Education Tax

```
Education Tax = Special Tax × 30%
```

### VAT

```
VAT = (CIF + Import Duty + Special Tax + Education Tax) × 10%
```

### Total Cost

```
Total = Vehicle Price + Shipping + Insurance + All Taxes + Additional Costs
```

## Example Calculation

**Vehicle**: 2023 BMW 320i from USA

- Price: $30,000
- Engine: 2000cc
- Exchange Rate: 1 USD = 1300 KRW

**Results**:

1. Vehicle Price KRW: ₩35,100,000 (after depreciation)
2. Shipping: ₩2,600,000
3. Insurance: ₩877,500
4. CIF Value: ₩38,577,500
5. Import Duty (8%): ₩3,086,200
6. Special Tax (5%): ₩2,083,185
7. Education Tax (30%): ₩624,956
8. VAT (10%): ₩4,437,184
9. Additional Costs: ₩750,000
10. **Total Cost: ₩49,558,525**

## Mobile Optimization

- Responsive grid layout
- Touch-friendly inputs
- Auto-scroll to results
- Sticky results panel on desktop
- Collapsible detailed breakdown

## Customization

### Add New Country

```json
{
  "code": "FR",
  "name": "France",
  "currency": "EUR",
  "shippingBase": 1500,
  "shippingPerCc": 0.6
}
```

### Adjust Tax Brackets

```json
{
  "specialConsumptionTax": {
    "brackets": [
      { "maxEngineSize": 1000, "rate": 0.0 },
      { "maxEngineSize": 2000, "rate": 0.05 },
      { "maxEngineSize": 99999, "rate": 0.08 }
    ]
  }
}
```

## Limitations & Disclaimers

1. **Estimates Only**: Actual costs may vary
2. **Exchange Rates**: Static rates, update regularly
3. **Shipping Costs**: Simplified calculation
4. **Vehicle Condition**: Doesn't account for damage/issues
5. **Special Cases**: Vintage cars, electric vehicles may have different rules
6. **Regulations**: Korean import laws may change

## Future Enhancements

- [ ] Real-time exchange rate API
- [ ] Save/share calculations
- [ ] Compare multiple vehicles
- [ ] Export to PDF
- [ ] Email results
- [ ] Vehicle history integration
- [ ] Electric vehicle tax incentives
- [ ] Vintage car exemptions

## Support

For questions or issues:

- Check the configuration file
- Review calculation logic in `calculator-utils.ts`
- Test with known values
- Consult Korean customs regulations

## Related Documentation

- [Korean Customs Service](https://www.customs.go.kr)
- [Exchange Rates](https://www.koreaexim.go.kr)
- [Vehicle Standards](https://www.kotsa.or.kr)
