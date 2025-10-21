-- =============================================
-- Sample Guides Data
-- =============================================
-- This file contains sample guide data for testing
-- Run this after setting up your database schema
-- =============================================

-- Note: Replace 'YOUR_USER_ID_HERE' with an actual user ID from your auth.users table
-- You can get this from: SELECT id FROM auth.users LIMIT 1;

-- Guide 1: Getting Started with Vehicle Imports
INSERT INTO public.guides (slug, title, content, author_id, published) VALUES (
  'getting-started-vehicle-imports',
  'Getting Started with Vehicle Imports to Korea',
  '# Getting Started with Vehicle Imports to Korea

Welcome to the complete guide on importing vehicles to Korea! This guide will walk you through the entire process from start to finish.

## Overview

Importing a vehicle to Korea involves several steps, including:

1. **Research and Planning**
2. **Finding the Right Vehicle**
3. **Understanding Costs**
4. **Documentation**
5. **Shipping and Customs**
6. **Registration**

## Why Import a Vehicle?

There are several reasons why you might want to import a vehicle:

- **Unique Models**: Access to vehicles not available in Korea
- **Cost Savings**: Sometimes cheaper than buying locally
- **Personal Preference**: Specific configurations or features
- **Classic/Vintage Cars**: Rare models from abroad

## Basic Requirements

Before you start, make sure you meet these basic requirements:

- Valid Korean driver license
- Proof of residence in Korea
- Financial resources for purchase and import costs
- Understanding of Korean vehicle regulations

## Step 1: Research

Start by researching:

1. **Vehicle Specifications**: Check if the vehicle meets Korean standards
2. **Import Regulations**: Understand current import laws
3. **Costs**: Use our [Cost Calculator](/calculator) to estimate total expenses
4. **Timeline**: Plan for 2-4 months from purchase to registration

## Step 2: Budget Planning

Calculate your total budget including:

- Vehicle purchase price
- Shipping costs (varies by country and size)
- Import duties (8% of CIF value)
- Special consumption tax (0-8% based on engine size)
- Education tax (30% of special tax)
- VAT (10% of taxable base)
- Modification costs (₩500,000-2,000,000)
- Registration and inspection fees

> **Tip**: Our calculator provides detailed breakdowns of all these costs!

## Step 3: Documentation

Prepare these essential documents:

### From Country of Origin
- Original vehicle title/registration
- Bill of sale
- Export certificate
- Vehicle specifications document

### For Korean Customs
- Import declaration form
- Certificate of origin
- Insurance certificate
- Packing list

## Step 4: Finding a Customs Broker

A licensed customs broker will help you:

- Navigate import regulations
- Handle customs paperwork
- Clear the vehicle through customs
- Arrange domestic transportation

**Cost**: Typically ₩500,000-1,000,000

## Step 5: Shipping Options

Choose between:

### Container Shipping
- **Pros**: Better protection, secure
- **Cons**: More expensive
- **Cost**: $1,500-3,000

### Roll-on/Roll-off (RoRo)
- **Pros**: Cheaper, faster
- **Cons**: Less protection
- **Cost**: $800-1,500

## Common Mistakes to Avoid

1. ❌ Not checking vehicle compliance beforehand
2. ❌ Underestimating total costs
3. ❌ Skipping insurance
4. ❌ Not using a reputable shipping company
5. ❌ Ignoring modification requirements

## Timeline Estimate

| Phase | Duration |
|-------|----------|
| Vehicle sourcing | 2-4 weeks |
| Purchase and export | 1-2 weeks |
| Shipping | 2-6 weeks |
| Customs clearance | 1-2 weeks |
| Modifications | 1-2 weeks |
| Registration | 1 week |
| **Total** | **8-16 weeks** |

## Next Steps

Ready to proceed? Here is what to do next:

1. ✅ Use our [Cost Calculator](/calculator) to estimate expenses
2. ✅ Read our guide on "Understanding Import Taxes"
3. ✅ Join our [Community](/community) to learn from others
4. ✅ Find a reputable customs broker
5. ✅ Start vehicle shopping!

## Need Help?

If you have questions or need clarification, visit our [Community Forum](/community) where experienced importers share their knowledge.

---

*Last updated: January 2025*',
  'YOUR_USER_ID_HERE',
  true
);

-- Guide 2: Understanding Import Costs
INSERT INTO public.guides (slug, title, content, author_id, published) VALUES (
  'understanding-import-costs',
  'Understanding Import Costs and Taxes in Korea',
  '# Understanding Import Costs and Taxes

A comprehensive breakdown of all costs involved in importing a vehicle to Korea.

## Total Cost Components

When importing a vehicle, your total cost consists of:

```
Total Cost = Vehicle Price + Shipping + Insurance + Taxes + Fees
```

## 1. Vehicle Purchase Price

The base cost of the vehicle in the country of origin.

### Considerations:
- Market value in origin country
- Vehicle condition and mileage
- Year of manufacture (affects depreciation)
- Currency exchange rates

### Depreciation Factors

Korean customs applies depreciation:

| Year | Depreciation Factor |
|------|-------------------|
| 2024 | 100% (current year) |
| 2023 | 90% |
| 2022 | 82% |
| 2021 | 75% |
| 2020 | 68% |

## 2. Shipping Costs

Shipping costs vary by:
- Country of origin
- Vehicle size/weight
- Shipping method
- Season

### Typical Costs by Country

- **USA**: $1,200-2,000
- **Germany**: $1,500-2,500
- **Japan**: $800-1,500
- **UK**: $1,400-2,200

## 3. Insurance

Required for shipping and customs:
- Typically 2.5% of vehicle value
- Covers loss or damage during transit
- Required for customs clearance

## 4. CIF Value

**CIF = Cost + Insurance + Freight**

This is the customs valuation used to calculate import duties and taxes.

Example:
```
Vehicle Price: $30,000
Insurance: $750 (2.5%)
Shipping: $1,500
CIF Value: $32,250
```

## 5. Import Duty (관세)

- **Rate**: 8% of CIF value
- Non-negotiable
- Applied to all imported vehicles

**Example**:
- CIF: ₩41,925,000
- Import Duty: ₩3,354,000 (8%)

## 6. Special Consumption Tax (개별소비세)

Based on engine displacement:

| Engine Size | Tax Rate |
|------------|----------|
| Under 1000cc | 0% |
| 1001-2000cc | 5% |
| Over 2000cc | 8% |

**Calculation Base**: CIF + Import Duty

## 7. Education Tax (교육세)

- **Rate**: 30% of Special Consumption Tax
- Funds education programs
- Applied automatically

## 8. Value Added Tax (부가가치세 / VAT)

- **Rate**: 10%
- **Base**: CIF + Import Duty + Special Tax + Education Tax

This is typically the largest tax component!

## Complete Tax Calculation Example

Let''s calculate for a 2023 BMW 320i from USA:

```
Vehicle Price: $30,000
Exchange Rate: 1 USD = ₩1,300
```

### Step-by-Step:

**1. Convert to KRW**
- $30,000 × 1,300 = ₩39,000,000

**2. Apply Depreciation (2023 = 90%)**
- ₩39,000,000 × 0.9 = ₩35,100,000

**3. Add Shipping**
- ₩35,100,000 + ₩1,950,000 = ₩37,050,000

**4. Add Insurance (2.5%)**
- Insurance: ₩877,500
- CIF: ₩37,927,500

**5. Import Duty (8%)**
- ₩37,927,500 × 0.08 = ₩3,034,200

**6. Special Tax (5% for 2000cc)**
- Base: ₩40,961,700
- Tax: ₩2,048,085

**7. Education Tax (30%)**
- ₩2,048,085 × 0.3 = ₩614,426

**8. VAT (10%)**
- Base: ₩43,624,211
- VAT: ₩4,362,421

### Total Taxes: ₩10,059,132

## Additional Costs

Beyond taxes, budget for:

### Mandatory:
- Registration fee: ₩50,000
- Safety inspection: ₩200,000
- Modifications: ₩500,000-2,000,000

### Optional:
- Customs broker: ₩500,000-1,000,000
- Domestic transport: ₩100,000-300,000
- Storage fees: varies

## Money-Saving Tips

1. **Buy in slower seasons**: Winter for northern countries
2. **Choose smaller engines**: Lower special tax
3. **Consider older vehicles**: Depreciation already applied
4. **DIY modifications**: If you''re handy
5. **Compare shipping quotes**: Prices vary significantly

## Use Our Calculator

Don''t want to calculate manually? Use our [Import Cost Calculator](/calculator) for instant estimates!

## Important Notes

> ⚠️ Exchange rates fluctuate - lock in rates when possible
> ⚠️ Regulations change - always verify current rules
> ⚠️ Additional fees may apply for special cases

## Next Steps

1. Use the [calculator](/calculator) with your vehicle details
2. Compare costs with local market prices
3. Factor in time and effort required
4. Make an informed decision

---

*Remember: These are estimates. Consult with a licensed customs broker for exact costs.*',
  'YOUR_USER_ID_HERE',
  true
);

-- Guide 3: Required Documentation
INSERT INTO public.guides (slug, title, content, author_id, published) VALUES (
  'required-documentation',
  'Complete Documentation Checklist for Vehicle Imports',
  '# Required Documentation for Vehicle Imports

A comprehensive checklist of all documents you''ll need to successfully import a vehicle to Korea.

## Document Categories

We''ll cover four main categories:

1. 🇺🇸 **Origin Country Documents**
2. 🚢 **Shipping Documents**
3. 🇰🇷 **Korean Customs Documents**
4. 📋 **Post-Import Documents**

---

## 1. Origin Country Documents

### Vehicle Title/Registration (필수)
- **Original** vehicle title from country of origin
- Must show clear ownership
- No liens or loans outstanding
- Properly signed over to you

### Bill of Sale (필수)
- Detailed invoice showing:
  - Purchase price
  - Date of sale
  - Buyer and seller information
  - Vehicle VIN
- Notarized if possible

### Export Certificate (필수)
- Issued by origin country
- Proves legal export
- Required for customs

### Vehicle Specifications
- Manufacturer certificate
- Engine specifications
- Emission standards met
- Safety features list

## 2. Shipping Documents

### Bill of Lading (선하증권)
- Issued by shipping company
- Proof of shipment
- Required for customs clearance
- **Keep original safe!**

### Packing List
- Details of shipment contents
- Vehicle condition
- Personal items (if any)
- Photos recommended

### Marine Insurance Certificate
- Coverage during transit
- Minimum CIF value
- Original certificate required

### Arrival Notice
- From shipping company
- Confirms arrival in Korea
- Includes container/vessel details

## 3. Korean Customs Documents

### Import Declaration (수입신고서)
- Filed by customs broker
- Includes all vehicle details
- CIF value calculation
- Tax calculations

### Certificate of Origin
- Proves vehicle origin country
- Required for duty calculation
- From manufacturer or chamber of commerce

### Self-Certification of Compliance
- Environmental standards
- Safety standards
- Emissions compliance

### Power of Attorney (위임장)
- For customs broker
- Allows them to act on your behalf
- Must be notarized

## 4. Personal Documents

### For You (Importer):

**Identity Documents**
- ✅ Korean ARC/Registration Card
- ✅ Valid passport
- ✅ Proof of residence

**Financial Documents**
- ✅ Bank statements
- ✅ Proof of payment
- ✅ Foreign exchange records

**Other**
- ✅ Korean driver license
- ✅ Contact information
- ✅ Email for notifications

## 5. Post-Import Documents

After customs clearance:

### Vehicle Registration
- Import clearance certificate
- Customs duty payment receipt
- Inspection certificate
- Insurance certificate

### Modification Certificate (if required)
- List of modifications made
- Photos before/after
- Shop certification

### Final Registration
- License plates
- Registration card (등록증)
- Emissions certificate

## Document Checklist

Print this checklist and check off as you collect:

### Before Purchase
- [ ] Verify vehicle title is clean
- [ ] Get bill of sale template ready
- [ ] Research origin country export process
- [ ] Prepare budget documents

### Before Shipping
- [ ] Original vehicle title (signed)
- [ ] Notarized bill of sale
- [ ] Export certificate
- [ ] Vehicle specifications
- [ ] Photos of vehicle (all angles)
- [ ] Marine insurance quote

### During Shipping
- [ ] Bill of lading (original)
- [ ] Packing list
- [ ] Insurance certificate
- [ ] Shipping company contact
- [ ] Tracking information

### At Korean Customs
- [ ] All origin documents
- [ ] All shipping documents
- [ ] Import declaration form
- [ ] Certificate of origin
- [ ] Power of attorney for broker
- [ ] Personal ID documents
- [ ] Payment proof
- [ ] Customs broker contract

### After Clearance
- [ ] Customs clearance certificate
- [ ] Tax payment receipts
- [ ] Import permit
- [ ] Inspection appointment
- [ ] Modification quotes (if needed)

## Document Storage Tips

### Physical Documents
1. Use a waterproof document folder
2. Make copies of everything
3. Organize by category
4. Keep in safe place

### Digital Copies
1. Scan all documents at high resolution
2. Store in cloud (Google Drive, etc.)
3. Email copies to yourself
4. Keep backup on USB drive

> **Pro Tip**: Take photos with your phone as immediate backup!

## Common Document Issues

### ❌ Missing Original Title
**Solution**: Contact origin DMV for duplicate

### ❌ Title Has Lien
**Solution**: Pay off loan, get lien release

### ❌ Unsigned Bill of Sale
**Solution**: Contact seller for signature

### ❌ Lost Bill of Lading
**Solution**: Contact shipping company for duplicate (may cost fee)

### ❌ Expired Insurance
**Solution**: Renew before customs clearance

## Language Requirements

Most documents need Korean translation:

- Find certified translator (공증 번역)
- Costs: ₩20,000-50,000 per document
- Required for customs
- Keep both original and translation

## Working with Customs Broker

Your broker will help with:
- ✅ Document review
- ✅ Translation coordination
- ✅ Form preparation
- ✅ Submission to customs
- ✅ Following up on issues

**Cost**: ₩500,000-1,000,000 for full service

## Document Verification

Before submitting to customs:

1. **Check all names match** across documents
2. **Verify VIN consistency**
3. **Confirm all signatures** are present
4. **Ensure dates are logical** (purchase → export → shipping)
5. **Have clear copies** of everything

## Timeline

Document preparation timeline:

| Task | Duration |
|------|----------|
| Collect origin docs | 1-2 weeks |
| Shipping docs | Same as shipping |
| Customs preparation | 3-5 days |
| Translation | 2-3 days |
| Submission | 1 day |
| **Total** | **2-4 weeks** |

## Need Help?

- Use this checklist systematically
- Don''t rush document collection
- Work with experienced broker
- Ask in our [Community](/community) forum

---

*Keep this guide handy throughout your import process!*',
  'YOUR_USER_ID_HERE',
  true
);

-- Note: After running this, update 'YOUR_USER_ID_HERE' with actual user IDs
-- You can do this with:
-- UPDATE public.guides SET author_id = 'actual-user-id' WHERE author_id = 'YOUR_USER_ID_HERE';
