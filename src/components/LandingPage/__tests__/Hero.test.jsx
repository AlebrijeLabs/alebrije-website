import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../Hero';

describe('Hero Component', () => {
  test('renders main title', () => {
    render(<Hero />);
    const titleElement = screen.getByText(/ALBJ Token/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders subtitle', () => {
    render(<Hero />);
    const subtitleElement = screen.getByText(/Guiding Spirit Creatures and Meme coins into the Multiverse/i);
    expect(subtitleElement).toBeInTheDocument();
  });

  test('renders launch date', () => {
    render(<Hero />);
    const launchDateElement = screen.getByText(/Launching June 12, 2025/i);
    expect(launchDateElement).toBeInTheDocument();
  });

  test('renders CTA buttons', () => {
    render(<Hero />);
    const selectWalletButton = screen.getByText(/Select Wallet/i);
    const learnMoreButton = screen.getByText(/Learn More/i);
    expect(selectWalletButton).toBeInTheDocument();
    expect(learnMoreButton).toBeInTheDocument();
  });
}); 