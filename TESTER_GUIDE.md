# OCP App MVP - Tester Guide

Hey! Thanks for testing the OCP (Overseas Car Purchase) App MVP! 🚗

## What is this app?

OCP App helps people calculate the cost of importing vehicles to Korea, with guides and community features.

---

## How to Access

**Option 1: Same Network**
If we're on the same WiFi:
- Korean version: http://172.100.100.84:3005/ko
- English version: http://172.100.100.84:3005/en

**Option 2: Online (if deployed)**
- URL: [Will be provided after Vercel deployment]

---

## What to Test (30-45 minutes)

### 🏠 Homepage (5 min)
1. Open the app on your phone
2. Check if everything looks clean and organized
3. Try switching between 한국어 and English
4. Click around - does navigation feel smooth?

### 🧮 Import Cost Calculator (15 min)

**Test Case 1: US Car (FTA - should be 0% duty)**
- Country: United States
- Purchase Price: $30,000
- Engine Size: 2300cc (over 2000cc)
- Shipping: RORO

**Expected Results:**
- Import Duty: ₩0 (0% because of FTA)
- Special Consumption Tax: ~8% (because over 2000cc)
- VAT: 10%

**Test Case 2: Japanese Car (No FTA - should be 8% duty)**
- Country: Japan
- Purchase Price: $25,000
- Engine Size: 1500cc (mid-size)
- Shipping: Container

**Expected Results:**
- Import Duty: 8% of CIF value
- Special Consumption Tax: 5% (because 1000-2000cc)
- VAT: 10%

**Test Case 3: Small Engine (Tax Exempt)**
- Any country
- Price: $15,000
- Engine Size: 800cc (under 1000cc)

**Expected Results:**
- Special Consumption Tax: ₩0 (exempt for under 1000cc)

### 📚 Guides Section (10 min)
1. Browse the guides list
2. Open "Understanding Korean Import Taxes"
3. Check if information is clear and helpful
4. Open "Shipping Methods: RORO vs Container"
5. Verify shipping costs show $2,500-$7,000 for containers
6. Check that over 2000cc shows 8-10% special consumption tax

### 👥 Community/Forum (10 min)
1. Sign up for an account
2. Create a test post
3. Reply to a post
4. Check if you can see your user avatar
5. Log out and log back in
6. Try to edit someone else's post (should NOT work)

---

## What I'm Looking For

### ✅ Check These:
- [ ] Does mobile navigation feel clean and organized?
- [ ] Is the hamburger menu easy to use?
- [ ] Can you easily switch languages?
- [ ] Are calculator results accurate?
- [ ] Is guide content readable and helpful?
- [ ] Does authentication work smoothly?
- [ ] Do you see any weird layouts or broken elements?

### 🐛 Report Issues Like This:
**Device**: iPhone 13, Safari
**What I did**: Clicked calculator, entered $30,000 US car
**Expected**: 0% import duty
**Got**: 8% import duty
**Screenshot**: [if possible]

---

## Questions to Consider

1. **First Impression**: Does it look professional enough?
2. **Navigation**: Easy to find what you need?
3. **Mobile Experience**: Comfortable to use on phone?
4. **Language Switching**: Works well?
5. **Calculator**: Results make sense?
6. **Guides**: Informative and clear?
7. **Overall**: Would you use this if importing a car?

---

## Known Features

- English and Korean language support
- Import cost calculator with accurate FTA rates
- Comprehensive guides on importing vehicles
- Community forum for questions
- User authentication

---

## Send Feedback To:

**Preferred Format:**
- Screenshots of any issues
- Device and browser used
- Step-by-step what you did
- What you expected vs what happened
- Any suggestions or improvements

---

Thank you for testing! Your feedback helps make this better! 🙏
