'use client';

import { useState } from 'react';
import { formatKRW, type CostBreakdown } from '@/lib/calculator-utils';

interface CostBreakdownDisplayProps {
  result: CostBreakdown;
}

export default function CostBreakdownDisplay({
  result,
}: CostBreakdownDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Total Cost Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="text-sm font-medium mb-1 opacity-90">
          Total Estimated Cost
        </div>
        <div className="text-3xl md:text-4xl font-bold mb-1">
          {formatKRW(result.totalCost)}
        </div>
        <div className="text-sm opacity-90">
          {result.foreignCurrency} {result.vehiclePriceForeign.toLocaleString()}{' '}
          → KRW (Rate: {result.exchangeRate.toLocaleString()})
        </div>
      </div>

      {/* Quick Summary */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">Cost Summary 비용 요약</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Vehicle + Shipping
            </div>
            <div className="text-lg font-semibold">
              {formatKRW(result.vehiclePriceKRW + result.shippingCostKRW)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {(
                ((result.vehiclePriceKRW + result.shippingCostKRW) /
                  result.totalCost) *
                100
              ).toFixed(1)}
              %
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-xs text-red-600 dark:text-red-400 mb-1">
              Total Taxes
            </div>
            <div className="text-lg font-semibold text-red-700 dark:text-red-300">
              {formatKRW(result.totalTaxes)}
            </div>
            <div className="text-xs text-red-600 dark:text-red-400 mt-1">
              {((result.totalTaxes / result.totalCost) * 100).toFixed(1)}%
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
              Additional Costs
            </div>
            <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
              {formatKRW(result.totalAdditionalCosts)}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {((result.totalAdditionalCosts / result.totalCost) * 100).toFixed(
                1
              )}
              %
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Toggle */}
      <div className="p-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          <span className="font-semibold">
            {showDetails ? '▼' : '▶'} Detailed Breakdown 상세 내역
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {showDetails ? 'Hide' : 'Show'} details
          </span>
        </button>

        {showDetails && (
          <div className="mt-4 space-y-3">
            {result.breakdown.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex-1 mb-2 sm:mb-0">
                  <div className="font-medium">
                    {item.label}{' '}
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.labelKo}
                    </span>
                  </div>
                  {item.note && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {item.note}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {item.percentage !== undefined && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 min-w-[50px] text-right">
                      {item.percentage.toFixed(1)}%
                    </div>
                  )}
                  <div className="font-semibold min-w-[140px] text-right">
                    {formatKRW(item.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Key Taxes Breakdown */}
      <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold mb-3 text-sm">Tax Breakdown 세금 내역</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Import Duty (관세)
            </span>
            <span className="font-medium">{formatKRW(result.importDuty)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Special Tax (개별소비세)
            </span>
            <span className="font-medium">
              {formatKRW(result.specialConsumptionTax)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Education Tax (교육세)
            </span>
            <span className="font-medium">
              {formatKRW(result.educationTax)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              VAT (부가세)
            </span>
            <span className="font-medium">{formatKRW(result.vat)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-600 font-semibold">
            <span>Total Taxes</span>
            <span>{formatKRW(result.totalTaxes)}</span>
          </div>
        </div>
      </div>

      {/* CIF Information */}
      <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold mb-2 text-sm text-blue-900 dark:text-blue-300">
          📦 CIF Value (Cost + Insurance + Freight)
        </h4>
        <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2">
          {formatKRW(result.cifValue)}
        </div>
        <p className="text-xs text-blue-800 dark:text-blue-200">
          This is the customs value used to calculate import duties and taxes.
          It includes the vehicle price, insurance (2.5%), and shipping costs.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
          >
            🖨️ Print Results
          </button>
          <button
            onClick={() => {
              const text = `Import Cost Estimate\n\nTotal: ${formatKRW(result.totalCost)}\nVehicle: ${formatKRW(result.vehiclePriceKRW)}\nTaxes: ${formatKRW(result.totalTaxes)}\nAdditional: ${formatKRW(result.totalAdditionalCosts)}`;
              navigator.clipboard.writeText(text);
              alert('Copied to clipboard!');
            }}
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
          >
            📋 Copy Summary
          </button>
        </div>
      </div>
    </div>
  );
}
