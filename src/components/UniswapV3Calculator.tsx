import React, { useState, useEffect } from 'react';
import { calculatePosition, PositionInputs, CalculationResult } from '../utils/calculator';

const UniswapV3Calculator = () => {
  const [token0, setToken0] = useState({ symbol: 'USDC', name: 'USD Coin' });
  const [token1, setToken1] = useState({ symbol: 'WETH', name: 'Wrapped Ethereum' });
  
  const [inputs, setInputs] = useState<PositionInputs>({
    token0Amount: 0,
    token1Amount: 0,
    token0Symbol: token0.symbol,
    token1Symbol: token1.symbol,
    minPrice: 0,
    maxPrice: 0,
    currentPrice: 0,
    uncollectedToken0: 0,
    uncollectedToken1: 0
  });

  const [result, setResult] = useState<CalculationResult>({
    totalToken0: 0,
    totalToken1: 0,
    totalValueUSD: 0,
    token0Symbol: token0.symbol,
    token1Symbol: token1.symbol
  });

  const [scenario, setScenario] = useState<'below' | 'above'>('below');

  // Handle token symbol input changes
  const handleToken0SymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSymbol = e.target.value;
    setToken0(prev => ({ ...prev, symbol: newSymbol }));
    setInputs(prev => ({
      ...prev,
      token0Symbol: newSymbol
    }));
  };

  const handleToken1SymbolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSymbol = e.target.value;
    setToken1(prev => ({ ...prev, symbol: newSymbol }));
    setInputs(prev => ({
      ...prev,
      token1Symbol: newSymbol
    }));
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: parseFloat(value) || 0
    });
  };

  // Update results when inputs change
  useEffect(() => {
    const results = calculatePosition(inputs, scenario);
    setResult(results);
  }, [inputs, scenario]);
  
  // Update tokens in inputs when token selection changes
  useEffect(() => {
    setInputs(prev => ({
      ...prev,
      token0Symbol: token0.symbol,
      token1Symbol: token1.symbol
    }));
  }, [token0, token1]);

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Uniswap V3 Out-of-Range Calculator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="token0Symbol" className="block text-sm font-medium mb-1">Token 0 Symbol (Quote):</label>
          <input
            id="token0Symbol"
            data-testid="token0Symbol"
            type="text"
            value={token0.symbol}
            onChange={handleToken0SymbolChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., USDC"
          />
        </div>
        <div>
          <label htmlFor="token1Symbol" className="block text-sm font-medium mb-1">Token 1 Symbol (Base):</label>
          <input
            id="token1Symbol"
            data-testid="token1Symbol"
            type="text"
            value={token1.symbol}
            onChange={handleToken1SymbolChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g., WETH"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Scenario:</label>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-md ${scenario === 'below' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setScenario('below')}
          >
            Price Below Range
          </button>
          <button
            className={`px-4 py-2 rounded-md ${scenario === 'above' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setScenario('above')}
          >
            Price Above Range
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="token0Amount" className="block text-sm font-medium mb-1">Current {token0.symbol} Amount:</label>
          <input
            id="token0Amount"
            type="number"
            name="token0Amount"
            value={inputs.token0Amount || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={`E.g., 2991.84266`}
          />
        </div>
        <div>
          <label htmlFor="token1Amount" className="block text-sm font-medium mb-1">Current {token1.symbol} Amount:</label>
          <input
            id="token1Amount"
            type="number"
            name="token1Amount"
            value={inputs.token1Amount || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder={`E.g., 0.60760544`}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="minPrice" className="block text-sm font-medium mb-1">MIN Price ({token0.symbol}/{token1.symbol}):</label>
          <input
            id="minPrice"
            type="number"
            name="minPrice"
            value={inputs.minPrice || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="E.g., 0.00040891"
            step="0.00000001"
          />
        </div>
        <div>
          <label htmlFor="maxPrice" className="block text-sm font-medium mb-1">MAX Price ({token0.symbol}/{token1.symbol}):</label>
          <input
            id="maxPrice"
            type="number"
            name="maxPrice"
            value={inputs.maxPrice || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="E.g., 0.00046661"
            step="0.00000001"
          />
        </div>
        <div>
          <label htmlFor="currentPrice" className="block text-sm font-medium mb-1">Current Price ({token0.symbol}/{token1.symbol}):</label>
          <input
            id="currentPrice"
            type="number"
            name="currentPrice"
            value={inputs.currentPrice || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="E.g., 0.00042655"
            step="0.00000001"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="uncollectedToken0" className="block text-sm font-medium mb-1">Uncollected {token0.symbol} Fees:</label>
          <input
            id="uncollectedToken0"
            type="number"
            name="uncollectedToken0"
            value={inputs.uncollectedToken0 || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="E.g., 53.24627"
          />
        </div>
        <div>
          <label htmlFor="uncollectedToken1" className="block text-sm font-medium mb-1">Uncollected {token1.symbol} Fees:</label>
          <input
            id="uncollectedToken1"
            type="number"
            name="uncollectedToken1"
            value={inputs.uncollectedToken1 || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="E.g., 0.01950299"
          />
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Results:</h2>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between">
            <span className="font-medium">Total {result.token1Symbol}:</span>
            <span data-testid="total-token1">{result.totalToken1.toFixed(8)} {result.token1Symbol}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total {result.token0Symbol}:</span>
            <span data-testid="total-token0">{result.totalToken0.toFixed(2)} {result.token0Symbol}</span>
          </div>
          {inputs.currentPrice > 0 && (
            <div className="flex justify-between">
              <span className="font-medium">Estimated Total Value:</span>
              <span data-testid="total-value">${result.totalValueUSD.toFixed(2)} USD</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Note: This calculator provides an estimation based on your inputs. Actual results may vary due to slippage, price impact, and other factors.</p>
      </div>
    </div>
  );
};

export default UniswapV3Calculator;