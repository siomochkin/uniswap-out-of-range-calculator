import { describe, it, expect } from 'vitest';
import { calculatePosition, PositionInputs } from '../utils/calculator';

describe('Uniswap V3 Calculator', () => {
  // Test data
  const sampleInputs: PositionInputs = {
    token0Amount: 1000,
    token1Amount: 0.5,
    token0Symbol: 'USDC',
    token1Symbol: 'WETH',
    minPrice: 1000, // WETH priced at 1000 USDC minimum
    maxPrice: 3000, // WETH priced at 3000 USDC maximum
    currentPrice: 2000, // WETH is currently 2000 USDC
    uncollectedToken0: 10,
    uncollectedToken1: 0.05
  };

  describe('Below price range scenario', () => {
    it('should convert all token0 to token1 and add to current token1 when price drops below range', () => {
      const result = calculatePosition(sampleInputs, 'below');
      
      // When price is below range, token0/minPrice = additional token1
      // 1000/1000 = 1 WETH
      // Total token1 = 0.5 + 1 + 0.05 = 1.55
      
      expect(result.totalToken1).toBeCloseTo(1.55);
      // Only uncollected token0 remains
      expect(result.totalToken0).toEqual(sampleInputs.uncollectedToken0);
      // Total value = token0 + (token1 * current price) = 10 + (1.55 * 2000) = 3110
      expect(result.totalValueUSD).toBeCloseTo(3110);
      // Check that the symbols are preserved
      expect(result.token0Symbol).toEqual(sampleInputs.token0Symbol);
      expect(result.token1Symbol).toEqual(sampleInputs.token1Symbol);
    });

    it('should handle zero minPrice case', () => {
      const zeroMinPriceInputs = {
        ...sampleInputs,
        minPrice: 0
      };
      
      const result = calculatePosition(zeroMinPriceInputs, 'below');
      
      // With min price of 0, no token0 should be converted to token1
      expect(result.totalToken1).toBeCloseTo(0.55); // Just current token1 + uncollected token1
      expect(result.totalToken0).toEqual(10); // Only uncollected token0
      expect(result.totalValueUSD).toBeCloseTo(1110); // 10 + (0.55 * 2000)
    });
  });

  describe('Above price range scenario', () => {
    it('should convert all token1 to token0 and add to current token0 when price goes above range', () => {
      const result = calculatePosition(sampleInputs, 'above');
      
      // When price is above range, token1 * maxPrice = additional token0
      // 0.5 * 3000 = 1500 USDC
      // Total token0 = 1000 + 1500 + 10 = 2510
      
      expect(result.totalToken0).toBeCloseTo(2510);
      // Only uncollected token1 remains
      expect(result.totalToken1).toEqual(sampleInputs.uncollectedToken1);
      // Total value = token0 + (token1 * current price) = 2510 + (0.05 * 2000) = 2610
      expect(result.totalValueUSD).toBeCloseTo(2610);
      // Check that the symbols are preserved
      expect(result.token0Symbol).toEqual(sampleInputs.token0Symbol);
      expect(result.token1Symbol).toEqual(sampleInputs.token1Symbol);
    });

    it('should handle zero maxPrice case', () => {
      const zeroMaxPriceInputs = {
        ...sampleInputs,
        maxPrice: 0
      };
      
      const result = calculatePosition(zeroMaxPriceInputs, 'above');
      
      // With max price of 0, no token1 should be converted to token0
      expect(result.totalToken0).toBeCloseTo(1010); // Just current token0 + uncollected token0
      expect(result.totalToken1).toEqual(0.05); // Only uncollected token1
      expect(result.totalValueUSD).toBeCloseTo(1110); // 1010 + (0.05 * 2000)
    });
  });

  describe('Edge cases', () => {
    it('should handle all zeros', () => {
      const zeroInputs: PositionInputs = {
        token0Amount: 0,
        token1Amount: 0,
        token0Symbol: 'USDC',
        token1Symbol: 'WETH',
        minPrice: 0,
        maxPrice: 0,
        currentPrice: 0,
        uncollectedToken0: 0,
        uncollectedToken1: 0
      };
      
      const resultBelow = calculatePosition(zeroInputs, 'below');
      const resultAbove = calculatePosition(zeroInputs, 'above');
      
      // For both scenarios, we expect zeros
      expect(resultBelow.totalToken1).toEqual(0);
      expect(resultBelow.totalToken0).toEqual(0);
      expect(resultBelow.totalValueUSD).toEqual(0);
      
      expect(resultAbove.totalToken1).toEqual(0);
      expect(resultAbove.totalToken0).toEqual(0);
      expect(resultAbove.totalValueUSD).toEqual(0);
    });

    it('should handle negative inputs gracefully', () => {
      const negativeInputs: PositionInputs = {
        token0Amount: -100,
        token1Amount: -0.5,
        token0Symbol: 'USDC',
        token1Symbol: 'WETH',
        minPrice: 1000,
        maxPrice: 3000,
        currentPrice: 2000,
        uncollectedToken0: 0,
        uncollectedToken1: 0
      };
      
      // Below range scenario
      const resultBelow = calculatePosition(negativeInputs, 'below');
      // -100/1000 = -0.1, so -0.1 + (-0.5) = -0.6
      expect(resultBelow.totalToken1).toBeCloseTo(-0.6);
      expect(resultBelow.totalToken0).toEqual(0);
      
      // Above range scenario
      const resultAbove = calculatePosition(negativeInputs, 'above');
      // -0.5 * 3000 = -1500, so -1500 + (-100) = -1600
      expect(resultAbove.totalToken0).toBeCloseTo(-1600);
      expect(resultAbove.totalToken1).toEqual(0);
    });
  });
});