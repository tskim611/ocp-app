'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  calculateImportCost,
  COUNTRIES,
  type ImportCostBreakdown,
} from '@/lib/tax-config';
import { getExchangeRate, formatKRW, formatUSD } from '@/lib/exchange-rate';

export default function CalculatorPage() {
  const t = useTranslations('calculator');
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
    <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('subtitle')}
          </p>
          {!fetchingRate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t('results.exchangeRate')}: 1 USD = {exchangeRate.toLocaleString()} KRW (updated hourly)
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calculator Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
              {t('form.vehicleDetails')}
            </h2>

            <form onSubmit={handleCalculate} className="space-y-5">
              {/* Purchase Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('form.purchasePrice')} <span className="text-red-500">*</span>
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
                  {t('form.priceHelp')}
                </p>
              </div>

              {/* Country of Origin */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('form.country')} <span className="text-red-500">*</span>
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
                  {selectedCountryConfig.ftaEligible ? t('form.ftaPartner') : `${t('form.importDuty')}: ${(selectedCountryConfig.dutyRate * 100).toFixed(0)}%`}
                </p>
              </div>

              {/* Vehicle Year */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('form.year')} <span className="text-red-500">*</span>
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
                  {t('form.yearHelp')} (1950 - {currentYear + 1})
                </p>
              </div>

              {/* Engine Displacement */}
              <div>
                <label htmlFor="engine" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t('form.engineCC')} <span className="text-red-500">*</span>
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
                  {t('form.engineHelp')}
                </p>
              </div>

              {/* Shipping Method */}
              <div>
                <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
                  {t('form.shippingMethod')} <span className="text-red-500">*</span>
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
                      <div className="font-medium text-gray-900 dark:text-gray-100">{t('form.roroLabel')}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('form.roroDesc')}</div>
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
                      <div className="font-medium text-gray-900 dark:text-gray-100">{t('form.containerLabel')}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('form.containerDesc')}</div>
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
                      <span>{t('form.calculating')}</span>
                    </>
                  ) : (
                    <span>{t('form.calculate')}</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200"
                >
                  {t('form.reset')}
                </button>
              </div>
            </form>
          </div>

          {/* Results Display */}
          <div id="results" className="lg:sticky lg:top-6 lg:self-start">
            {result ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {t('results.title')}
                </h2>

                {/* Purchase Details */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                    {t('results.purchaseDetails')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('results.purchasePrice')}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ${formatUSD(result.purchasePriceUSD)} → {formatKRW(result.purchasePriceKRW)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('results.shipping')} ({shippingMethod})</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ${formatUSD(result.shippingUSD)} → {formatKRW(result.shippingKRW)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('results.insurance')}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ${formatUSD(result.insuranceUSD)} → {formatKRW(result.insuranceKRW)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{t('results.cif')}</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatKRW(result.cifKRW)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Taxes & Duties */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                    {t('results.taxesAndDuties')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('results.duty')} ({(selectedCountryConfig.dutyRate * 100).toFixed(0)}%)
                      </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatKRW(result.dutyKRW)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('results.specialTax')}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatKRW(result.specialConsumptionTaxKRW)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('results.educationTax')} (30%)</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatKRW(result.educationTaxKRW)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('results.vat')} (10%)</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatKRW(result.vatKRW)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Other Fees */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                    {t('results.otherFees')}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('results.registrationTax')}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatKRW(result.registrationTaxKRW)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('results.portFees')}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {formatKRW(result.portFeesKRW)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('results.brokerFees')}</span>
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
                      {t('results.total').toUpperCase()}
                    </span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {formatKRW(result.totalLandedCostKRW)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-right">
                    {t('results.exchangeRate')}: 1 USD = {result.exchangeRate.toLocaleString()} KRW
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-6xl mb-4">🚗💰</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{t('results.readyToCalculate')}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t('results.fillDetails')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {t('disclaimer')}
          </p>
        </div>
      </div>
    </div>
  );
}
