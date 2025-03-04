export interface PositionInputs {
  token0Amount: number;
  token1Amount: number;
  token0Symbol: string;
  token1Symbol: string;
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
  uncollectedToken0: number;
  uncollectedToken1: number;
}

export interface CalculationResult {
  totalToken0: number;
  totalToken1: number;
  totalValueUSD: number;
  token0Symbol: string;
  token1Symbol: string;
}

export function calculatePosition(inputs: PositionInputs, scenario: 'below' | 'above'): CalculationResult {
  const {
    token0Amount,
    token1Amount,
    token0Symbol,
    token1Symbol,
    minPrice,
    maxPrice,
    currentPrice,
    uncollectedToken0,
    uncollectedToken1
  } = inputs;

  let totalToken0 = 0;
  let totalToken1 = 0;

  if (scenario === 'below') {
    // If price drops below MIN, all liquidity converts to token1
    // Formula: token0 / minPrice = token1 equivalent
    const token0ToToken1 = minPrice > 0 ? token0Amount / minPrice : 0;
    totalToken1 = token1Amount + token0ToToken1 + uncollectedToken1;
    totalToken0 = uncollectedToken0;
  } else {
    // If price goes above MAX, all liquidity converts to token0
    // Formula: token1 * maxPrice = token0 equivalent
    const token1ToToken0 = token1Amount * maxPrice;
    totalToken0 = token0Amount + token1ToToken0 + uncollectedToken0;
    totalToken1 = uncollectedToken1;
  }

  // Calculate total value in USD (assuming token0 is the stable/quote currency)
  const totalValueUSD = totalToken0 + (totalToken1 * currentPrice);

  return {
    totalToken0,
    totalToken1,
    totalValueUSD,
    token0Symbol,
    token1Symbol
  };
}