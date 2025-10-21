import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Guide content
const guides = [
  {
    slug: 'us-to-kr-import',
    title: 'How to Import a Car from the US to Korea',
    content: `# How to Import a Car from the US to Korea

*A step-by-step guide to bringing your dream car home — from auction to registration*

---

## Introduction

So you've found it — that perfect car that's not sold in Korea, or costs way too much here. Maybe it's a classic Euro sports car like a 1975 BMW 3.0CSi, or an American pickup truck. Whatever it is, you're now asking: **"Can I actually import this myself?"**

Short answer: **Yes.** But it's not simple, and it's not cheap. This guide walks you through the entire process, from the moment you spot a listing to the day you get Korean plates.

We'll use a **1975 BMW 3.0CSi 5-Speed** as our running example — a European classic being imported from the US to Korea.

---

## Step 0: Reality Check & Budget

Before you fall in love with a car, get clear on three things:

### Can You Legally Import It?
- **Age matters**: Cars older than 25 years may qualify for classic vehicle exemptions (예외승인)
- **Left-hand drive only**: Korea drives on the right. RHD cars are legal but impractical
- **Emissions & safety**: Your car must pass Korean standards or get an exemption

For our 1975 3.0CSi: It's over 25 years old, LHD, and can apply for classic exemption.

### What's the Total Cost?
Don't just look at the purchase price. Add:
- **Purchase price** (FOB): $45,000 USD
- **Shipping** (US → Korea): $2,000 USD
- **Import duty** (8% for non-FTA): ~$3,760
- **VAT** (10%): ~$5,076
- **Special consumption tax** (5-20% based on engine): ~$2,538
- **Port fees & broker**: $800–1,500
- **TS inspection & registration**: $600–1,000

**Total landed cost estimate**: ~₩75–80 million for our example.

### Do You Have Time?
From purchase to registration: **2–4 months** on average.

---

## Step 1: Find & Research the Car

### Where to Look
- **Bring a Trailer** (classic/enthusiast cars)
- **Cars & Bids** (modern enthusiast cars)
- **Copart/IAAI** (salvage auctions — risky)
- **AutoTrader, CarGurus** (dealer inventory)
- **Facebook Marketplace** (private sellers)

### What to Check
- **VIN history**: Run a Carfax or AutoCheck report
- **Title status**: Must be "clean" — avoid salvage, rebuilt, or lien titles
- **Exportability**: Confirm no export restrictions
- **Ownership**: Verify the seller owns it outright

**For our 3.0CSi**: Found on Bring a Trailer with clean California title, no accidents, original numbers-matching engine.

---

## Step 2: Get a Pre-Purchase Inspection (PPI)

Never buy sight-unseen. Hire a local inspector near the car.

### Services to Use
- **LemonSquad** (~$150–300)
- **Mobile Inspections** (varies by area)
- **Marque-specific specialists** (best for classics)

### What They Should Check
- Rust (underbody, frame rails, rockers)
- Compression test (for older engines)
- Leaks, wear, functionality
- Paint depth & body panel alignment

**Cost**: $300–600 USD

**For our 3.0CSi**: Hired a BMW specialist in LA. Found minor oil seep, surface rust on exhaust — nothing deal-breaking.

---

## Step 3: Negotiate & Secure Payment

### Payment Methods
- **Escrow service** (safest — holds funds until car ships)
- **Wire transfer** (only if seller is verified/trusted)
- **PayPal/Venmo** (not recommended for cars)

### Key Contract Points
- **Incoterms**: FOB (buyer arranges shipping) or CIF (seller handles shipping)
- **Delivery timeline**: When can the car be picked up?
- **Included items**: Keys, manuals, service records, spare parts

**For our 3.0CSi**: Agreed on $45k FOB, escrow via Escrow.com, pickup in 10 days.

---

## Step 4: Arrange Shipping

### Choose Your Method
- **RoRo (Roll-on/Roll-off)**: Cheapest, car exposed to elements
- **Container (20' or 40')**: Safer, more expensive
- **Air freight**: Only for ultra-rare/expensive cars

### Shipping Companies (US → Korea)
- **K-Line**
- **Hyundai Glovis**
- **NYK Line**
- **Maersk**

### What You Need
- **Title** (original, signed over)
- **Bill of Sale**
- **Export declaration** (filed at US port)
- **Marine insurance** (cover transit damage)

**Cost for our 3.0CSi**: $2,000 via RoRo from Long Beach to Incheon (6 weeks transit).

---

## Step 5: Prepare Korean Import Paperwork

While the car is in transit, get your docs ready.

### Required Documents
1. **Invoice** (purchase price in USD)
2. **Bill of Lading** (shipping receipt)
3. **Title** (or certificate of origin)
4. **Your ID** (주민등록증 or passport)
5. **Power of Attorney** (if using a broker)

### Import Declaration
File with Korean Customs (관세청) — or hire a customs broker (~₩500k–1M).

### Tax Calculation
- **CIF value** = Car price + Shipping + Insurance
- **Duty** = CIF × 8% (if non-FTA origin)
- **VAT** = (CIF + Duty) × 10%
- **Special Consumption Tax** = Based on engine displacement

**For our 3.0CSi**:
- CIF = $47,000 → ~₩65.8M
- Duty = ₩5.26M
- VAT = ₩7.1M
- Total tax = ~₩12.4M

---

## Step 6: Clear Customs (Arrival in Korea)

### Timeline
- **Arrival notice**: Shipping company alerts you
- **Customs inspection**: 1–3 days
- **Payment**: Pay duties/VAT immediately
- **Release**: Customs issues release note

### Common Delays
- Missing/incorrect documents
- VIN discrepancy
- Additional inspection required

**For our 3.0CSi**: Cleared in 2 days, paid ₩12.4M in taxes, picked up at Incheon port.

---

## Step 7: Pass TS Inspection (교통안전공단)

Before you can register, your car must pass Korean safety/emissions tests.

### What They Check
- **Headlights** (beam pattern, aim)
- **Emissions** (older cars may get exemptions)
- **Noise levels**
- **Safety features** (seatbelts, lights, horn)

### Classic Car Exemption (고전차 예외승인)
Cars over 25 years old can apply for relaxed standards.

### Where to Go
- **TS Hwaseong Center** (화성자동차안전연구원)
- Local TS branches

**Cost**: ₩500k–1M

**For our 3.0CSi**: Applied for classic exemption, passed after minor headlight adjustment.

---

## Step 8: Register the Vehicle

### Documents Needed
- TS inspection pass certificate
- Customs clearance receipt
- Title/ownership proof
- Your ID
- Insurance proof

### Where to Register
Local 구청 (district office) vehicle registration desk.

### Fees
- Registration tax: ~₩200–500k
- License plates: ~₩50k
- Number assignment: ~₩30k

**For our 3.0CSi**: Registered in Seoul, total fees ₩320k.

---

## Step 9: Insure & Drive

Korean insurance companies will cover imported cars, but rates may be higher for uncommon models.

### Insurance Tips
- Get quotes from 3+ companies
- Ask about "parallel import car" coverage
- Consider agreed-value policies for classics

**For our 3.0CSi**: Insured through KB for ₩180k/month.

---

## Step 10: Maintenance & Parts

### Challenges
- No dealer network for parallel imports
- Parts must be ordered from overseas
- Find independent specialists

### Solutions
- Join owner communities (Naver Cafe, forums)
- Source parts from Germany/US via eBay, FCP Euro
- Build relationship with a trusted indie shop

**For our 3.0CSi**: Joined Korean BMW classic owners cafe, found a shop in Yongsan that services E9s.

---

## Common Mistakes to Avoid

### ❌ Buying salvage/rebuilt title
Korean customs may refuse entry or charge steep penalties.

### ❌ Underestimating total cost
Import taxes alone can add 30–40% to purchase price.

### ❌ Skipping the PPI
That "clean" car might have hidden frame damage or rust.

### ❌ Ignoring RHD reality
Right-hand drive is legal but daily-driving is miserable in Korea.

### ❌ Forgetting about parts availability
Exotic imports are cool until you need a $2,000 part shipped from Italy.

---

## Timeline Summary

| Stage | Duration |
|-------|----------|
| Research & PPI | 1–2 weeks |
| Purchase & escrow | 1 week |
| Shipping (US → Korea) | 4–6 weeks |
| Customs clearance | 2–5 days |
| TS inspection | 1–2 weeks |
| Registration | 1–3 days |
| **Total** | **2–4 months** |

---

## Is It Worth It?

**Yes, if:**
- The car isn't sold in Korea
- You're an enthusiast who values uniqueness
- You've budgeted for the full cost + maintenance

**No, if:**
- You're trying to "save money" vs buying locally
- You need dealer warranty/service
- The car has questionable history

---

## Final Thoughts

Importing a car to Korea is a journey — literally and figuratively. It's not for everyone, but for those who want something special, it's absolutely doable.

Our 1975 BMW 3.0CSi example cost about ₩80M all-in, but it's a numbers-matching Euro classic that would cost ₩120M+ if you could even find one locally.

If you're ready to take the leap, start with Step 0: get clear on costs, timeline, and legal requirements. Then trust the process.

Happy importing. 🚗🇰🇷

---

## Resources

- **Korean Customs Service**: [customs.go.kr](https://www.customs.go.kr)
- **TS (교통안전공단)**: [ts2020.kr](https://www.ts2020.kr)
- **Bring a Trailer**: [bringatrailer.com](https://bringatrailer.com)
- **Carfax**: [carfax.com](https://www.carfax.com)
- **LemonSquad Inspections**: [lemonsquad.com](https://www.lemonsquad.com)

---

*Last updated: October 2025*`,
    published: true
  }
  // Add more guides here as you write them
];

async function seedGuides() {
  console.log('🌱 Starting guide seed...\n');

  for (const guide of guides) {
    console.log(`📝 Inserting: ${guide.title}`);

    // Check if guide already exists
    const { data: existing } = await supabase
      .from('guides')
      .select('slug')
      .eq('slug', guide.slug)
      .single();

    if (existing) {
      console.log(`   ⚠️  Guide "${guide.slug}" already exists, skipping...`);
      continue;
    }

    // Insert the guide
    const { error } = await supabase
      .from('guides')
      .insert([guide]);

    if (error) {
      console.error(`   ❌ Error inserting "${guide.slug}":`, error.message);
    } else {
      console.log(`   ✅ Successfully inserted "${guide.slug}"`);
    }
  }

  console.log('\n✨ Seed complete!\n');
}

// Run the seed function
seedGuides()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 Seed failed:', error);
    process.exit(1);
  });
