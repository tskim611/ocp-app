'use client';

import { useState, useEffect } from 'react';
import {
  calculateImportCost,
  COUNTRIES,
  type ImportCostBreakdown,
} from '@/lib/tax-config';
import { getExchangeRate, formatKRW, formatUSD } from '@/lib/exchange-rate';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { ProgressBar } from './ui/ProgressBar';
import { useSwipeable } from '@/hooks/useSwipeable';
import { FadeIn } from './animations/FadeIn';
import { CountUp } from './animations/CountUp';
import { cn } from '@/lib/utils';

export default function ImportCostCalculatorEnhanced() {
  const [purchasePrice, setPurchasePrice] = useState<number>(30000);
  const [country, setCountry] = useState<string>('US');
  const [year, setYear] = useState<number>(2020);
  const [engineCC, setEngineCC] = useState<number>(2000);
  const [shippingMethod, setShippingMethod] = useState<'RORO' | 'CONTAINER'>('RORO');

  const [exchangeRate, setExchangeRate] = useState<number>(1350);
  const [result, setResult] = useState<ImportCostBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingRate, setFetchingRate] = useState(true);
  const [resultPanelOpen, setResultPanelOpen] = useState(false);

  // Fetch exchange rate on mount
  useEffect(() => {
    async function fetchRate() {
      setFetchingRate(true);
      const rate = await getExchangeRate();
      setExchangeRate(rate);
      setFetchingRate(false);
    }
    fetchRate();
  }, []);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate calculation delay for UX
    setTimeout(() => {
      const breakdown = calculateImportCost(
        purchasePrice,
        country,
        engineCC,
        shippingMethod,
        exchangeRate
      );
      setResult(breakdown);
      setLoading(false);
      setResultPanelOpen(true);

      // Scroll to results on mobile
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }, 1200);
  };

  const handleReset = () => {
    setPurchasePrice(30000);
    setCountry('US');
    setYear(2020);
    setEngineCC(2000);
    setShippingMethod('RORO');
    setResult(null);
    setResultPanelOpen(false);
  };

  // Swipe handlers for mobile result panel
  const swipeHandlers = useSwipeable({
    onSwipeDown: () => setResultPanelOpen(false),
    onSwipeUp: () => setResultPanelOpen(true),
  });

  const isFormValid = purchasePrice >= 1000 && purchasePrice <= 500000 && engineCC >= 500 && engineCC <= 8000;

  const selectedCountryConfig = COUNTRIES[country];
  const currentYear = new Date().getFullYear();

  // Calculate progress percentages for visualization
  const getTaxPercentage = (amount: number, total: number) =>
    total > 0 ? (amount / total) * 100 : 0;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header with fade-in animation */}
      <FadeIn className="mb-8 text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100 leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Import Cost Calculator
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          Estimate your total landed cost for importing a car to Korea
        </p>
        {!fetchingRate && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Exchange Rate: <span className="font-semibold">1 USD = {exchangeRate.toLocaleString()} KRW</span>
            </span>
          </div>
        )}
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <FadeIn direction="left" delay={100}>
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Vehicle Details
              </h2>
            </div>

            <form onSubmit={handleCalculate} className="space-y-5">
              {/* Purchase Price */}
              <div className="group">
                <label htmlFor="price" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                  Purchase Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                  <input
                    id="price"
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    min="1000"
                    max="500000"
                    step="1000"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                    placeholder="30000"
                    required
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Purchase price in USD ($1,000 - $500,000)
                </p>
              </div>

              {/* Country of Origin */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Country of Origin <span className="text-red-500">*</span>
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                  required
                >
                  {Object.entries(COUNTRIES).map(([code, config]) => (
                    <option key={code} value={code}>
                      {config.name} {config.ftaEligible ? '(FTA)' : ''}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {selectedCountryConfig.ftaEligible ? '✓ FTA partner - may qualify for reduced duty' : `Import duty: ${(selectedCountryConfig.dutyRate * 100).toFixed(0)}%`}
                </p>
              </div>

              {/* Vehicle Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Vehicle Year <span className="text-red-500">*</span>
                </label>
                <input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  min="1950"
                  max={currentYear + 1}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                  placeholder="2020"
                  required
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Model year (1950 - {currentYear + 1})
                </p>
              </div>

              {/* Engine Displacement */}
              <div>
                <label htmlFor="engine" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Engine Displacement (cc) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="engine"
                    type="number"
                    value={engineCC}
                    onChange={(e) => setEngineCC(Number(e.target.value))}
                    min="500"
                    max="8000"
                    step="100"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all"
                    placeholder="2000"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">cc</span>
                </div>
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Engine size in cubic centimeters (500cc - 8000cc)
                </p>
              </div>

              {/* Shipping Method */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  Shipping Method <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {[
                    {
                      value: 'RORO' as const,
                      title: 'RoRo (Roll-on/Roll-off)',
                      desc: 'Cheaper option, car driven onto ship',
                      icon: '🚢',
                    },
                    {
                      value: 'CONTAINER' as const,
                      title: 'Container Shipping',
                      desc: 'Safer option, car enclosed in container',
                      icon: '📦',
                    },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={cn(
                        'flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200',
                        shippingMethod === method.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      )}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.value}
                        checked={shippingMethod === method.value}
                        onChange={(e) => setShippingMethod(e.target.value as 'RORO' | 'CONTAINER')}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{method.icon}</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{method.title}</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{method.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!isFormValid || loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" automotive className="text-white" />
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Calculate Total Cost</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3.5 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </FadeIn>

        {/* Results Display */}
        <FadeIn direction="right" delay={200}>
          <div id="results" className="lg:sticky lg:top-6 lg:self-start">
            {result ? (
              <div
                {...swipeHandlers}
                className={cn(
                  'bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-6 border border-blue-200 dark:border-blue-800 space-y-6 transition-all duration-300',
                  resultPanelOpen ? 'opacity-100' : 'opacity-95'
                )}
              >
                {/* Swipe indicator for mobile */}
                <div className="lg:hidden flex justify-center mb-2">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </div>

                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Cost Breakdown
                  </h2>
                </div>

                {/* Purchase Details */}
                <div className="space-y-3 p-4 bg-white dark:bg-gray-800/50 rounded-xl">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full" />
                    Purchase Details
                  </h3>
                  <div className="space-y-2.5 text-sm">
                    {[
                      {
                        label: 'Purchase Price',
                        value: `$${formatUSD(result.purchasePriceUSD)} → ${formatKRW(result.purchasePriceKRW)}`,
                      },
                      {
                        label: `Shipping (${shippingMethod})`,
                        value: `$${formatUSD(result.shippingUSD)} → ${formatKRW(result.shippingKRW)}`,
                      },
                      {
                        label: 'Insurance',
                        value: `$${formatUSD(result.insuranceUSD)} → ${formatKRW(result.insuranceKRW)}`,
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-right">
                          {item.value}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">CIF Total</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {formatKRW(result.cifKRW)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Taxes & Duties with Progress Bars */}
                <div className="space-y-4 p-4 bg-white dark:bg-gray-800/50 rounded-xl">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full" />
                    Taxes & Duties
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: `Import Duty (${(selectedCountryConfig.dutyRate * 100).toFixed(0)}%)`,
                        amount: result.dutyKRW,
                      },
                      {
                        label: 'Special Consumption Tax',
                        amount: result.specialConsumptionTaxKRW,
                      },
                      {
                        label: 'Education Tax (30%)',
                        amount: result.educationTaxKRW,
                      },
                      {
                        label: 'VAT (10%)',
                        amount: result.vatKRW,
                      },
                    ].map((tax, idx) => (
                      <div key={idx}>
                        <ProgressBar
                          value={getTaxPercentage(tax.amount, result.totalLandedCostKRW)}
                          label={tax.label}
                          automotive
                          className="mb-1"
                        />
                        <div className="text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatKRW(tax.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Fees */}
                <div className="space-y-3 p-4 bg-white dark:bg-gray-800/50 rounded-xl">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-600 rounded-full" />
                    Other Fees
                  </h3>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Registration Tax', amount: result.registrationTaxKRW },
                      { label: 'Port Fees', amount: result.portFeesKRW },
                      { label: 'Broker Fees', amount: result.brokerFeesKRW },
                    ].map((fee, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{fee.label}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {formatKRW(fee.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total with CountUp Animation */}
                <div className="pt-4 border-t-2 border-blue-300 dark:border-blue-600 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-5 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      TOTAL LANDED COST
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₩ <CountUp end={result.totalLandedCostKRW} decimals={0} />
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-right">
                    Exchange Rate: 1 USD = {result.exchangeRate.toLocaleString()} KRW
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-7xl mb-5 animate-bounce">🚗💰</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Ready to Calculate</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                  Fill in the vehicle details and click &quot;Calculate Total Cost&quot; to see your estimated import costs.
                </p>
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Disclaimer */}
      <FadeIn delay={300} className="mt-8">
        <div className="p-5 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl shadow-md">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                ⚠️ Important Disclaimer
              </p>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Estimates are approximate. Actual costs may vary based on specific circumstances, current exchange rates, vehicle condition, and changing regulations. Always consult with a licensed customs broker for accurate quotes.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
