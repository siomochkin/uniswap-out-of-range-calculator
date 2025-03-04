import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import UniswapV3Calculator from '../components/UniswapV3Calculator';
import * as calculatorModule from '../utils/calculator';

// Mock the calculator module
vi.mock('../utils/calculator', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    calculatePosition: vi.fn(),
  };
});

describe('UniswapV3Calculator component', () => {
  beforeEach(() => {
    // Reset the mock implementation for each test
    vi.mocked(calculatorModule.calculatePosition).mockReturnValue({
      totalToken1: 1.5,
      totalToken0: 2000,
      totalValueUSD: 5000,
      token0Symbol: 'USDC',
      token1Symbol: 'WETH'
    });
  });

  it('renders the calculator form with token selectors', () => {
    render(<UniswapV3Calculator />);
    
    expect(screen.getByText('Uniswap V3 Out-of-Range Calculator')).toBeInTheDocument();
    expect(screen.getByText('Scenario:')).toBeInTheDocument();
    expect(screen.getByText('Price Below Range')).toBeInTheDocument();
    expect(screen.getByText('Price Above Range')).toBeInTheDocument();
    
    // Check for token selectors
    expect(screen.getByText('Token 0 (Quote):')).toBeInTheDocument();
    expect(screen.getByText('Token 1 (Base):')).toBeInTheDocument();
    
    // Check for input fields (using regex to match dynamic token names)
    expect(screen.getByLabelText(/Current USDC Amount:/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current WETH Amount:/)).toBeInTheDocument();
    expect(screen.getByLabelText(/MIN Price/)).toBeInTheDocument();
    expect(screen.getByLabelText(/MAX Price/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Price/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Uncollected USDC Fees:/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Uncollected WETH Fees:/)).toBeInTheDocument();
    
    // Check for results section
    expect(screen.getByText('Results:')).toBeInTheDocument();
  });

  it('updates inputs when values are entered', () => {
    render(<UniswapV3Calculator />);
    
    // Get input fields
    const token0Input = screen.getByLabelText(/Current USDC Amount:/);
    const token1Input = screen.getByLabelText(/Current WETH Amount:/);
    
    // Change input values
    fireEvent.change(token0Input, { target: { value: '1000' } });
    fireEvent.change(token1Input, { target: { value: '0.5' } });
    
    // Check if inputs were updated
    expect(token0Input).toHaveValue(1000);
    expect(token1Input).toHaveValue(0.5);
    
    // Check if the calculator function was called with updated values
    expect(calculatorModule.calculatePosition).toHaveBeenCalledWith(
      expect.objectContaining({
        token0Amount: 1000,
        token1Amount: 0.5,
        token0Symbol: 'USDC',
        token1Symbol: 'WETH',
      }),
      'below'
    );
  });

  it('changes the scenario when buttons are clicked', () => {
    render(<UniswapV3Calculator />);
    
    // Get buttons
    const aboveButton = screen.getByText('Price Above Range');
    
    // Initially it should be set to 'below'
    expect(calculatorModule.calculatePosition).toHaveBeenCalledWith(
      expect.anything(),
      'below'
    );
    
    // Click on the above button
    fireEvent.click(aboveButton);
    
    // It should call the calculate function with the 'above' scenario
    expect(calculatorModule.calculatePosition).toHaveBeenCalledWith(
      expect.anything(), 
      'above'
    );
    
    // Verify the button styling changed
    expect(aboveButton).toHaveClass('bg-blue-600');
    expect(screen.getByText('Price Below Range')).not.toHaveClass('bg-blue-600');
  });

  it('displays calculation results correctly', () => {
    // Custom mock return value for this test
    vi.mocked(calculatorModule.calculatePosition).mockReturnValue({
      totalToken1: 2.5,
      totalToken0: 3000,
      totalValueUSD: 8000,
      token0Symbol: 'USDC',
      token1Symbol: 'WETH'
    });
    
    // Need to set currentPrice to make the totalValueUSD element appear
    render(
      <UniswapV3Calculator />
    );
    
    // First set a current price to make the total value USD element appear
    const currentPriceInput = screen.getByLabelText(/Current Price/);
    fireEvent.change(currentPriceInput, { target: { value: '1000' } });
    
    // Check if the results are displayed correctly
    expect(screen.getByTestId('total-token1')).toHaveTextContent('2.50000000 WETH');
    expect(screen.getByTestId('total-token0')).toHaveTextContent('3000.00 USDC');
    expect(screen.getByTestId('total-value')).toHaveTextContent('$8000.00 USD');
  });
  
  it('allows changing token selection', () => {
    render(<UniswapV3Calculator />);
    
    // Find token selectors using IDs
    const token0Selector = screen.getByTestId('token0Selector') || screen.getByLabelText('Token 0 (Quote):');
    const token1Selector = screen.getByTestId('token1Selector') || screen.getByLabelText('Token 1 (Base):');
    
    // Change token selections
    fireEvent.change(token0Selector, { target: { value: 'DAI' } });
    fireEvent.change(token1Selector, { target: { value: 'WBTC' } });
    
    // Check if labels were updated
    expect(screen.getByLabelText(/Current DAI Amount:/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current WBTC Amount:/)).toBeInTheDocument();
    expect(screen.getByLabelText(/MIN Price \(DAI\/WBTC\):/)).toBeInTheDocument();
    
    // Check if the calculator function was called with updated token symbols
    expect(calculatorModule.calculatePosition).toHaveBeenCalledWith(
      expect.objectContaining({
        token0Symbol: 'DAI',
        token1Symbol: 'WBTC',
      }),
      'below'
    );
  });
});