import Link from 'next/link';

export default function Tools() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Tools 도구</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Practical tools for importing vehicles to Korea
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Import Cost Calculator - Featured */}
            <Link
              href="/tools/calculator"
              className="p-6 border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:border-blue-600 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🧮</span>
                <div>
                  <h2 className="text-2xl font-semibold mb-1">
                    Import Cost Calculator
                  </h2>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    수입 비용 계산기
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Calculate total costs including duties, taxes, shipping, and
                fees for importing a vehicle to Korea.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <span>Calculate Now</span>
                <span>→</span>
              </div>
            </Link>

            {/* Coming Soon Tools */}
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg opacity-60">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">📋</span>
                <div>
                  <h2 className="text-2xl font-semibold mb-1">
                    Document Checklist
                  </h2>
                  <p className="text-sm text-gray-500">서류 체크리스트</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Track required documents and certifications for import process.
              </p>
              <div className="inline-block px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg cursor-not-allowed">
                Coming Soon
              </div>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg opacity-60">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">🔍</span>
                <div>
                  <h2 className="text-2xl font-semibold mb-1">
                    Compliance Checker
                  </h2>
                  <p className="text-sm text-gray-500">규정 확인</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Check if your vehicle meets Korean safety and emission
                standards.
              </p>
              <div className="inline-block px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg cursor-not-allowed">
                Coming Soon
              </div>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg opacity-60">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">⏱️</span>
                <div>
                  <h2 className="text-2xl font-semibold mb-3">
                    Timeline Estimator
                  </h2>
                  <p className="text-sm text-gray-500">일정 예측</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Estimate the time required for each step of the import process.
              </p>
              <div className="inline-block px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg cursor-not-allowed">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
