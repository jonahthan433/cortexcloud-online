import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { PlanProvider, usePlan } from '../PlanContext';

const TestComponent = () => {
  const { 
    currentPlan, 
    upgradePrompt, 
    hasFeature, 
    upgradePlan, 
    checkFeatureAccess 
  } = usePlan();
  
  return (
    <div>
      <div data-testid="current-plan">{currentPlan}</div>
      <div data-testid="has-ai-automation">{hasFeature('ai-automation') ? 'true' : 'false'}</div>
      <div data-testid="has-whatsapp">{hasFeature('whatsapp') ? 'true' : 'false'}</div>
      <div data-testid="has-advanced-analytics">{hasFeature('advanced-analytics') ? 'true' : 'false'}</div>
      <button onClick={() => upgradePlan('elevate')}>
        Upgrade to Elevate
      </button>
      <button onClick={() => upgradePlan('custom')}>
        Upgrade to Custom
      </button>
      <button onClick={() => checkFeatureAccess('ai-automation')}>
        Check AI Automation Access
      </button>
    </div>
  );
};

describe('PlanContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should provide initial state with initiate plan', () => {
    render(
      <PlanProvider>
        <TestComponent />
      </PlanProvider>
    );

    expect(screen.getByTestId('current-plan')).toHaveTextContent('initiate');
    expect(screen.getByTestId('has-ai-automation')).toHaveTextContent('false');
    expect(screen.getByTestId('has-whatsapp')).toHaveTextContent('false');
    expect(screen.getByTestId('has-advanced-analytics')).toHaveTextContent('false');
  });

  it('should load plan from localStorage', () => {
    localStorage.setItem('user-plan', 'elevate');
    
    render(
      <PlanProvider>
        <TestComponent />
      </PlanProvider>
    );

    expect(screen.getByTestId('current-plan')).toHaveTextContent('elevate');
    expect(screen.getByTestId('has-ai-automation')).toHaveTextContent('true');
    expect(screen.getByTestId('has-whatsapp')).toHaveTextContent('true');
    expect(screen.getByTestId('has-advanced-analytics')).toHaveTextContent('false');
  });

  it('should upgrade plan and persist to localStorage', async () => {
    render(
      <PlanProvider>
        <TestComponent />
      </PlanProvider>
    );

    const upgradeButton = screen.getByText('Upgrade to Elevate');
    upgradeButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('current-plan')).toHaveTextContent('elevate');
      expect(localStorage.getItem('user-plan')).toBe('elevate');
    });
  });

  it('should upgrade to custom plan', async () => {
    render(
      <PlanProvider>
        <TestComponent />
      </PlanProvider>
    );

    const upgradeButton = screen.getByText('Upgrade to Custom');
    upgradeButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('current-plan')).toHaveTextContent('custom');
      expect(screen.getByTestId('has-ai-automation')).toHaveTextContent('true');
      expect(screen.getByTestId('has-whatsapp')).toHaveTextContent('true');
      expect(screen.getByTestId('has-advanced-analytics')).toHaveTextContent('true');
    });
  });

  it('should check feature access correctly', () => {
    render(
      <PlanProvider>
        <TestComponent />
      </PlanProvider>
    );

    const checkButton = screen.getByText('Check AI Automation Access');
    checkButton.click();

    // Should show upgrade prompt for initiate plan
    expect(screen.getByTestId('has-ai-automation')).toHaveTextContent('false');
  });

  it('should handle invalid plan gracefully', () => {
    localStorage.setItem('user-plan', 'invalid-plan');
    
    render(
      <PlanProvider>
        <TestComponent />
      </PlanProvider>
    );

    // Should default to initiate plan
    expect(screen.getByTestId('current-plan')).toHaveTextContent('initiate');
  });

  it('should throw error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('usePlan must be used within a PlanProvider');
    
    consoleSpy.mockRestore();
  });

  it('should provide correct feature access for each plan', () => {
    // Test initiate plan features
    localStorage.setItem('user-plan', 'initiate');
    
    const { rerender } = render(
      <PlanProvider>
        <TestComponent />
      </PlanProvider>
    );

    expect(screen.getByTestId('has-ai-automation')).toHaveTextContent('false');
    expect(screen.getByTestId('has-whatsapp')).toHaveTextContent('false');
    expect(screen.getByTestId('has-advanced-analytics')).toHaveTextContent('false');

    // Test elevate plan features
    localStorage.setItem('user-plan', 'elevate');
    rerender(
      <PlanProvider>
        <TestComponent />
      </PlanProvider>
    );

    expect(screen.getByTestId('has-ai-automation')).toHaveTextContent('true');
    expect(screen.getByTestId('has-whatsapp')).toHaveTextContent('true');
    expect(screen.getByTestId('has-advanced-analytics')).toHaveTextContent('false');

    // Test custom plan features
    localStorage.setItem('user-plan', 'custom');
    rerender(
      <PlanProvider>
        <TestComponent />
      </PlanProvider>
    );

    expect(screen.getByTestId('has-ai-automation')).toHaveTextContent('true');
    expect(screen.getByTestId('has-whatsapp')).toHaveTextContent('true');
    expect(screen.getByTestId('has-advanced-analytics')).toHaveTextContent('true');
  });
});
