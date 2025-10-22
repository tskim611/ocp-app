'use client';

import { useState, useEffect } from 'react';
import {
  calculateImportCost,
  COUNTRIES,
  type ImportCostBreakdown,
} from '@/lib/tax-config';
import { getExchangeRate, formatKRW, formatUSD } from '@/lib/exchange-rate';

export default function ImportCostCalculator() {
  const [purchasePrice, setPurchasePrice] = useState<number>(30000);
  const [country, setCountry] = useState<string>('US');
  const [year, setYear] = useState<number>(2020);
  const [engineCC, setEngineCC] = useState<number>(2000);
  const [shippingMethod, setShippingMethod] = useState<'RORO' | 'CONTAINER'>('RORO');

  const [exchangeRate, setExchangeRate] = useState<number>(1350);
  const [result, setResult] = useState<ImportCostBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingRate, setFetchingRate] = useState(true);

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

      // Scroll to results on mobile
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }, 500);
  };

  const handleReset = () => {
    setPurchasePrice(30000);
    setCountry('US');
    setYear(2020);
    setEngineCC(2000);
    setShippingMethod('RORO');
    setResult(null);
  };

  const isFormValid = purchasePrice >= 1000 && purchasePrice <= 500000 && engineCC >= 500 && engineCC <= 8000;

  const selectedCountryConfig = COUNTRIES[country];
  const currentYear = new Date().getFullYear();

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100 leading-tight">
          Import Cost Calculator
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
          Estimate your total landed cost for importing a car to Korea
        </p>
        {!fetchingRate && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Exchange Rate: 1 USD = {exchangeRate.toLocaleString()} KRW (updated hourly)
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            Vehicle Details
          </h2>

          <form onSubmit={handleCalculate} className="space-y-5">
            {/* Purchase Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Purchase Price (USD) <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(Number(e.target.value))}
                min="1000"
                max="500000"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="30000"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              >
                {Object.entries(COUNTRIES).map(([code, config]) => (
                  <option key={code} value={code}>
                    {config.name} {config.ftaEligible ? '(FTA)' : ''}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {selectedCountryConfig.ftaEligible ? 'FTA partner - may qualify for reduced duty' : `Import duty: ${(selectedCountryConfig.dutyRate * 100).toFixed(0)}%`}
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
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="2020"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Model year (1950 - {currentYear + 1})
              </p>
            </div>

            {/* Engine Displacement */}
            <div>
              <label htmlFor="engine" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Engine Displacement (cc) <span className="text-red-500">*</span>
              </label>
              <input
                id="engine"
                type="number"
                value={engineCC}
                onChange={(e) => setEngineCC(Number(e.target.value))}
                min="500"
                max="8000"
                step="100"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="2000"
                required
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Engine size in cubic centimeters (500cc - 8000cc)
              </p>
            </div>

            {/* Shipping Method */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                Shipping Method <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <label className="flex items-start p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="shipping"
                    value="RORO"
                    checked={shippingMethod === 'RORO'}
                    onChange={(e) => setShippingMethod(e.target.value as 'RORO')}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">RoRo (Roll-on/Roll-off)</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Cheaper option, car driven onto ship (exposed to elements)</div>
                  </div>
                </label>
                <label className="flex items-start p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <input
                    type="radio"
                    name="shipping"
                    value="CONTAINER"
                    checked={shippingMethod === 'CONTAINER'}
                    onChange={(e) => setShippingMethod(e.target.value as 'CONTAINER')}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex-1">
                    <div className="font-medium text-gray-900 dark:text-gray-100">Container Shipping</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Safer option, car enclosed in container (more expensive)</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Calculating...</span>
                  </>
                ) : (
                  <span>Calculate Total Cost</span>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results Display */}
        <div id="results" className="lg:sticky lg:top-6 lg:self-start">
          {result ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Cost Breakdown
              </h2>

              {/* Purchase Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                  Purchase Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Purchase Price</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${formatUSD(result.purchasePriceUSD)} → {formatKRW(result.purchasePriceKRW)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping ({shippingMethod})</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${formatUSD(result.shippingUSD)} → {formatKRW(result.shippingKRW)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Insurance</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ${formatUSD(result.insuranceUSD)} → {formatKRW(result.insuranceKRW)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">CIF Total</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatKRW(result.cifKRW)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Taxes & Duties */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                  Taxes & Duties
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Import Duty ({(selectedCountryConfig.dutyRate * 100).toFixed(0)}%)
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatKRW(result.dutyKRW)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Special Consumption Tax</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatKRW(result.specialConsumptionTaxKRW)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Education Tax (30%)</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatKRW(result.educationTaxKRW)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">VAT (10%)</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatKRW(result.vatKRW)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Other Fees */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                  Other Fees
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Registration Tax</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatKRW(result.registrationTaxKRW)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Port Fees</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatKRW(result.portFeesKRW)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Broker Fees</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formatKRW(result.brokerFeesKRW)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t-2 border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    TOTAL LANDED COST
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatKRW(result.totalLandedCostKRW)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                  Exchange Rate: 1 USD = {result.exchangeRate.toLocaleString()} KRW
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-6xl mb-4">🚗💰</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Ready to Calculate</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fill in the vehicle details and click &quot;Calculate Total Cost&quot; to see the estimated import costs.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>⚠️ Disclaimer:</strong> Estimates are approximate. Actual costs may vary based on specific circumstances, current exchange rates, vehicle condition, and changing regulations. Always consult with a licensed customs broker for accurate quotes.
        </p>
      </div>
    </div>
  );
}
