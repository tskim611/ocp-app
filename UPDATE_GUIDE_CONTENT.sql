-- ============================================
-- UPDATE GUIDE CONTENT - FIX INACCURACIES
-- ============================================
-- This script fixes the shipping cost and tax rate inconsistencies
-- Run this in Supabase SQL Editor
-- ============================================

-- Update Guide: Understanding Korean Import Taxes and Duties
-- Fix: Special Consumption Tax rates (Over 2000cc should be 8-10%, not 5%)
UPDATE guides
SET content = E'# Understanding Korean Import Taxes and Duties

The tax structure for importing vehicles is complex. Here''s a breakdown:

## Overview of Taxes

1. **Import Duty** - 0% to 8% (FTA dependent)
2. **Special Consumption Tax** - Varies by engine size
3. **Education Tax** - 30% of special consumption tax
4. **VAT** - 10% of total value
5. **Registration Tax** - Varies by region

## Import Duty Details

**Standard Rate**: 8% of CIF value

**FTA Rate**: 0% for vehicles from:
- United States
- European Union
- Chile, Turkey, and other FTA partners

## Special Consumption Tax

| Engine Size | Tax Rate |
|------------|----------|
| Under 1000cc | Exempt |
| 1000-2000cc | 5% |
| Over 2000cc | 8-10% |

⚠️ **Note**: Tax rates are subject to change. Always verify current rates with Korean customs authorities.

## Example Calculation

For a **2020 Ford Mustang (2.3L)** at **$30,000**:

```
Purchase: $30,000
Shipping: $2,500
Insurance: $450
CIF Total: $32,950 = ₩44,482,500

Import Duty (0% FTA): ₩0
Special Consumption Tax: ₩2,224,125 (5% for 1000-2000cc)
Education Tax: ₩667,238
VAT: ₩4,737,386
Registration: ₩3,113,775
Fees: ₩1,500,000

Total: ₩56,725,024 ($42,018)
```

## Use Our Calculator

Get accurate estimates with our [Import Cost Calculator](/tools/calculator)!

📊 **Important**: Budget an extra 10-20% for unexpected fees and always consult with licensed customs brokers for final quotes.',
updated_at = NOW()
WHERE slug = 'understanding-korean-import-taxes';

-- Update Guide: Shipping Methods RORO vs Container
-- Fix: Container cost range should be $2,500-$7,000 consistently
UPDATE guides
SET content = E'# Shipping Methods: RORO vs Container

Choosing the right shipping method is crucial for your vehicle import.

## RORO (Roll-on/Roll-off)

### How It Works
- Vehicle driven onto ship
- Parked in cargo hold
- Driven off at destination port

### Pros ✅
- **Cost-effective**: $1,500-$2,500 (USA to Korea)
- Faster port processing
- Widely available
- No special crating needed

### Cons ❌
- Exposed to elements during transit
- Can''t ship personal items
- Less security
- Limited to driveable vehicles

## Container Shipping

### Types
1. **Shared Container** - Multiple vehicles ($2,500-$3,500)
2. **Exclusive 20ft** - Your vehicle only ($3,500-$5,000)
3. **Exclusive 40ft** - Large/multiple vehicles ($5,000-$7,000)

### Pros ✅
- Maximum protection from elements
- Can ship personal items (check regulations)
- Better for valuable/classic cars
- Works for non-running vehicles

### Cons ❌
- Higher cost: **$2,500-$7,000** (USA to Korea)
- Slower loading and processing
- May require advance booking

## Comparison Table

| Feature | RORO | Container |
|---------|------|----------|
| **Cost** | $1,500-2,500 | $2,500-7,000 |
| **Protection** | Moderate | Excellent |
| **Speed** | Faster | Slower |
| **Personal Items** | No | Yes* |
| **Non-running Cars** | No | Yes |

*Subject to customs regulations

## Recommendation

**Choose RORO if:**
- Car worth less than $30,000
- Budget is a priority
- Daily driver vehicle
- Car is in running condition

**Choose Container if:**
- Car worth more than $50,000
- Classic, exotic, or luxury vehicle
- Need maximum protection
- Vehicle is not running
- Want to ship personal belongings

🚢 **Pro Tip**: For vehicles worth $30,000-$50,000, get quotes for both methods. Sometimes the extra protection is worth just a few hundred dollars more!

⚠️ **Disclaimer**: Shipping costs vary by route, season, and shipping company. Always get multiple quotes and read contracts carefully.',
updated_at = NOW()
WHERE slug = 'shipping-methods-roro-vs-container';

-- Display success message
DO $$
BEGIN
  RAISE NOTICE '✅ Guide content updated successfully!';
  RAISE NOTICE '📝 Fixed shipping cost range: $2,500-$7,000';
  RAISE NOTICE '📝 Fixed special consumption tax: 8-10%% for over 2000cc';
  RAISE NOTICE '';
  RAISE NOTICE '🌐 Refresh your guides page to see the updates:';
  RAISE NOTICE '   http://localhost:3005/ko/guides';
END $$;
