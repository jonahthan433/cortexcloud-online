import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PricingSection } from '../PricingSection';
import { BrowserRouter } from 'react-router-dom';

describe('PricingSection', () => {
  it('renders pricing plans correctly', () => {
    render(
      <BrowserRouter>
        <PricingSection />
      </BrowserRouter>
    );

    // Check if plan names are displayed
    expect(screen.getByText('Initiate')).toBeInTheDocument();
    expect(screen.getByText('Elevate')).toBeInTheDocument();
    expect(screen.getByText('Innovate')).toBeInTheDocument();

    // Check if pricing toggle exists
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Yearly')).toBeInTheDocument();
  });

  it('shows correct pricing when toggling between monthly and yearly', () => {
    render(
      <BrowserRouter>
        <PricingSection />
      </BrowserRouter>
    );

    // Initial state (yearly)
    expect(screen.getByText('$191.99')).toBeInTheDocument();
    expect(screen.getByText('$479.99')).toBeInTheDocument();

    // Click toggle to switch to monthly
    const yearlyText = screen.getByText('Yearly');
    fireEvent.click(yearlyText);

    // Check monthly prices
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
  });

  it('displays correct features for each plan', () => {
    render(
      <BrowserRouter>
        <PricingSection />
      </BrowserRouter>
    );

    // Check Initiate features
    expect(screen.getByText('Business Setup & Integration')).toBeInTheDocument();
    expect(screen.getByText('Website Builder')).toBeInTheDocument();

    // Check Elevate features
    expect(screen.getByText('AI-Automation Integration')).toBeInTheDocument();
    expect(screen.getByText('WhatsApp & Slack Integration')).toBeInTheDocument();

    // Check Innovate features
    expect(screen.getByText('Agency Automations')).toBeInTheDocument();
    expect(screen.getByText('Dedicated Account Manager')).toBeInTheDocument();
  });
});