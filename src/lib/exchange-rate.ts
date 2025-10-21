// Fetch current USD to KRW exchange rate

const FALLBACK_RATE = 1350; // Fallback if API fails

export async function getExchangeRate(): Promise<number> {
  try {
    // Using free currency API (no auth required)
    const response = await fetch(
      'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    
    if (!response.ok) {
      throw new Error('Exchange rate API failed');
    }
    
    const data = await response.json();
    const krwRate = data.usd?.krw;
    
    if (!krwRate || typeof krwRate !== 'number') {
      throw new Error('Invalid exchange rate data');
    }
    
    return Math.round(krwRate); // Round to nearest won
    
  } catch (error) {
    console.error('Failed to fetch exchange rate, using fallback:', error);
    return FALLBACK_RATE;
  }
}

// Format KRW with commas
export function formatKRW(amount: number): string {
  return `₩${Math.round(amount).toLocaleString('ko-KR')}`;
}

// Format USD with commas
export function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}