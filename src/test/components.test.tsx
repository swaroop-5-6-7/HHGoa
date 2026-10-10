import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RiskMeter } from '../components/Dashboard/RiskMeter';
import { UrgentRiskCard } from '../components/Dashboard/UrgentRiskCard';
import { CategoryBreakdown } from '../components/Dashboard/CategoryBreakdown';
import { Navbar } from '../components/Navbar';
import { VoiceInput } from '../components/Assessment/VoiceInput';
import type { RegisterItem } from '../types/risk';

describe('UI Component Tests', () => {

  describe('RiskMeter Component', () => {
    it('renders risk score, level indicator, and assessment trigger', () => {
      const onNewAssessment = vi.fn();
      render(
        <RiskMeter
          score={85}
          level="critical"
          previousScore={70}
          onNewAssessment={onNewAssessment}
        />
      );

      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('Critical Risk')).toBeInTheDocument();
      expect(screen.getByText('+15 pts')).toBeInTheDocument();
      expect(screen.getByText('Assess New Update')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Assess New Update'));
      expect(onNewAssessment).toHaveBeenCalledTimes(1);
    });
  });

  describe('UrgentRiskCard Component', () => {
    it('renders highest severity open risk with action details', () => {
      const mockRisk: RegisterItem = {
        id: 'urgent-1',
        title: 'Critical Runway Depletion (6 Weeks Remaining)',
        category: 'financial',
        severity: 'critical',
        status: 'open',
        detectedPhrase: '6 weeks of cash runway',
        whyItMatters: 'Founders need 3 to 6 months to close fundraising.',
        recommendedAction: 'Freeze all non-revenue expenses immediately.',
        dateIdentified: Date.now(),
        lastUpdated: Date.now()
      };

      const onViewRegister = vi.fn();
      const onUpdateStatus = vi.fn();

      render(
        <UrgentRiskCard
          urgentRisk={mockRisk}
          onViewRegister={onViewRegister}
          onUpdateStatus={onUpdateStatus}
        />
      );

      expect(screen.getByText('Most Urgent Open Risk')).toBeInTheDocument();
      expect(screen.getByText('Critical Runway Depletion (6 Weeks Remaining)')).toBeInTheDocument();
      expect(screen.getByText('"6 weeks of cash runway"')).toBeInTheDocument();
      expect(screen.getByText('Founders need 3 to 6 months to close fundraising.')).toBeInTheDocument();
      expect(screen.getByText('Freeze all non-revenue expenses immediately.')).toBeInTheDocument();
      expect(screen.getByText('Mark as Mitigating')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Mark as Mitigating'));
      expect(onUpdateStatus).toHaveBeenCalledWith('urgent-1', 'mitigating');
    });

    it('renders clean state when no critical risks are open', () => {
      render(
        <UrgentRiskCard
          urgentRisk={null}
          onViewRegister={vi.fn()}
        />
      );
      expect(screen.getByText('No Critical Open Risks')).toBeInTheDocument();
    });
  });

  describe('CategoryBreakdown Component', () => {
    it('renders all 5 required venture pillars', () => {
      const onSelectCategory = vi.fn();
      render(
        <CategoryBreakdown
          registerItems={[]}
          onSelectCategory={onSelectCategory}
        />
      );

      expect(screen.getByText('Delivery')).toBeInTheDocument();
      expect(screen.getByText('Financial')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('Compliance')).toBeInTheDocument();
      expect(screen.getByText('Customer')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Delivery'));
      expect(onSelectCategory).toHaveBeenCalledWith('delivery');
    });
  });

  describe('Navbar Component', () => {
    it('renders logo, tabs, and offline ready badge', () => {
      const setActiveTab = vi.fn();
      render(
        <Navbar
          activeTab="dashboard"
          setActiveTab={setActiveTab}
          openRiskCount={3}
          onResetDemo={vi.fn()}
          onExportData={vi.fn()}
        />
      );

      expect(screen.getByText('RiskLens')).toBeInTheDocument();
      expect(screen.getByText('Offline Ready')).toBeInTheDocument();
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Assess Update')).toBeInTheDocument();
      expect(screen.getByText('Risk Register')).toBeInTheDocument();
      expect(screen.getByText('Scoring Heuristics')).toBeInTheDocument();
    });
  });

  describe('VoiceInput Component Fallback', () => {
    it('displays fallback state when browser speech recognition is unsupported', () => {
      const mockSpeech = {
        isSupported: false,
        isListening: false,
        transcript: '',
        error: null,
        startListening: vi.fn(),
        stopListening: vi.fn(),
        resetTranscript: vi.fn()
      };

      render(<VoiceInput speech={mockSpeech} />);

      expect(screen.getByText('Fallback: Standard Text Input Active')).toBeInTheDocument();
    });
  });

});
