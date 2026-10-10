import type { RiskAssessment, RegisterItem, RiskStatus } from '../types/risk';
import { assessProjectUpdate } from '../engine/heuristics';
import { DEFAULT_DEMO_TEXT } from '../engine/presets';

const STORAGE_KEYS = {
  ASSESSMENTS: 'risklens_assessments_v1',
  REGISTER: 'risklens_register_v1',
  INITIALIZED: 'risklens_init_flag_v1',
};

// Generates high quality seed data for first visit
export function createInitialSeedData(): { assessments: RiskAssessment[]; register: RegisterItem[] } {
  // Assessment 1: The user requested default update
  const defaultAssessment = assessProjectUpdate(DEFAULT_DEMO_TEXT, 'text');
  
  // Assessment 2: Past sprint update (3 days ago)
  const pastAssessment = assessProjectUpdate(
    'Sprint 14 update: Database migration completed successfully. Unpaid invoices from last quarter were partially collected. 7 weeks of cash runway remain.',
    'text'
  );
  pastAssessment.timestamp = Date.now() - 3 * 24 * 60 * 60 * 1000;

  // Build realistic register items
  const now = Date.now();
  const registerItems: RegisterItem[] = [
    {
      id: 'reg-seed-1',
      title: 'Critical Runway Depletion (6 Weeks Remaining)',
      category: 'financial',
      severity: 'critical',
      status: 'open',
      detectedPhrase: '6 weeks of cash runway',
      whyItMatters: 'Founders typically need 3 to 6 months to close financing or reach cashflow break-even. Having less than 8 weeks means engineering decisions are completely secondary to solvency.',
      recommendedAction: 'Freeze all non-revenue expenditures immediately. Initiate daily cash balance reconciliation and prepare an emergency bridge round or austerity budget.',
      dateIdentified: now,
      lastUpdated: now,
      assessmentId: defaultAssessment.id,
      notes: 'Finance team modeling 30% contractor reduction scenario.'
    },
    {
      id: 'reg-seed-2',
      title: 'Critical Path Integration Blocker (Payment Gateway)',
      category: 'delivery',
      severity: 'critical',
      status: 'open',
      detectedPhrase: 'payment integration is still blocked',
      whyItMatters: 'If critical systems (like payment processing or authentication) are blocked, shipping peripheral product features yields zero customer value.',
      recommendedAction: 'Swarm senior engineering resources onto the dependency interface. Define an asynchronous mock fallback or bypass path to prevent whole-team blockage.',
      dateIdentified: now,
      lastUpdated: now,
      assessmentId: defaultAssessment.id,
      notes: 'Stripe webhook listener signature verification issue.'
    },
    {
      id: 'reg-seed-3',
      title: 'Uncompleted Security Review Prior to Release',
      category: 'security',
      severity: 'critical',
      status: 'mitigating',
      detectedPhrase: 'have not completed the security review',
      whyItMatters: 'Deploying transaction or user data systems without security clearance exposes the company to catastrophic data breach liabilities and reputational ruin.',
      recommendedAction: 'Institute a release gate veto. Perform an automated static analysis (SAST) run and minimum-viable threat triage before granting production access.',
      dateIdentified: now,
      lastUpdated: now,
      assessmentId: defaultAssessment.id,
      notes: 'SecOps consulting firm contracted for fast-track 24h audit.'
    },
    {
      id: 'reg-seed-4',
      title: 'Inflexible Release Deadline (Friday Go-Live)',
      category: 'delivery',
      severity: 'high',
      status: 'mitigating',
      detectedPhrase: 'release date is fixed for Friday',
      whyItMatters: 'Rigid calendar deadlines paired with active development force disastrous quality compromises and technical debt accumulation.',
      recommendedAction: 'Decouple release announcements from deployment. Release behind internal feature flags first, or renegotiate date vs scope commitments immediately.',
      dateIdentified: now,
      lastUpdated: now,
      assessmentId: defaultAssessment.id,
      notes: 'Founder notified stakeholders of potential 72h feature flag rollout.'
    },
    {
      id: 'reg-seed-5',
      title: 'Enterprise Client SLA Response Time Spike',
      category: 'customer',
      severity: 'high',
      status: 'mitigating',
      detectedPhrase: 'Server response times spiked to 4 seconds',
      whyItMatters: 'Repeated SLA breaches trigger contractual penalties, negative word of mouth, and contract termination rights.',
      recommendedAction: 'Halt non-critical batch jobs. Scale database read-replicas and inspect slow query APM logs for the degrading endpoints.',
      dateIdentified: now - 48 * 3600 * 1000,
      lastUpdated: now - 12 * 3600 * 1000,
      notes: 'Redis caching layer implemented on search endpoints.'
    },
    {
      id: 'reg-seed-6',
      title: 'Missing Subprocessor Data Protection Agreements (DPA)',
      category: 'compliance',
      severity: 'medium',
      status: 'resolved',
      detectedPhrase: 'DPA agreements with third-party vendors',
      whyItMatters: 'Enterprise clients and European regulators levy severe penalties or halt contracts if statutory privacy agreements are deficient.',
      recommendedAction: 'Draft and execute standardized Data Processing Addendums (DPAs) with all sub-processors prior to onboarding regulated customer cohorts.',
      dateIdentified: now - 7 * 24 * 3600 * 1000,
      lastUpdated: now - 24 * 3600 * 1000,
      notes: 'Executed standard EU model clauses with analytics vendor.'
    }
  ];

  return {
    assessments: [defaultAssessment, pastAssessment],
    register: registerItems
  };
}

export function initializeStorageIfEmpty(): void {
  try {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInit) {
      const seed = createInitialSeedData();
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(seed.assessments));
      localStorage.setItem(STORAGE_KEYS.REGISTER, JSON.stringify(seed.register));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  } catch (e) {
    console.error('Failed to initialize local storage:', e);
  }
}

export function getStoredAssessments(): RiskAssessment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load assessments:', e);
    return [];
  }
}

export function saveStoredAssessment(assessment: RiskAssessment): void {
  try {
    const existing = getStoredAssessments();
    const updated = [assessment, ...existing.filter(a => a.id !== assessment.id)];
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save assessment:', e);
  }
}

export function getStoredRegisterItems(): RegisterItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTER);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load register items:', e);
    return [];
  }
}

export function saveStoredRegisterItem(item: RegisterItem): void {
  try {
    const existing = getStoredRegisterItems();
    const idx = existing.findIndex(i => i.id === item.id);
    let updated: RegisterItem[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = { ...item, lastUpdated: Date.now() };
    } else {
      updated = [item, ...existing];
    }
    localStorage.setItem(STORAGE_KEYS.REGISTER, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save register item:', e);
  }
}

export function updateRegisterItemStatus(id: string, status: RiskStatus): void {
  try {
    const existing = getStoredRegisterItems();
    const updated = existing.map(item => {
      if (item.id === id) {
        return { ...item, status, lastUpdated: Date.now() };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEYS.REGISTER, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update status:', e);
  }
}

export function deleteStoredRegisterItem(id: string): void {
  try {
    const existing = getStoredRegisterItems();
    const updated = existing.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.REGISTER, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete register item:', e);
  }
}

export function resetStorageToDemo(): void {
  try {
    const seed = createInitialSeedData();
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(seed.assessments));
    localStorage.setItem(STORAGE_KEYS.REGISTER, JSON.stringify(seed.register));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  } catch (e) {
    console.error('Failed to reset storage:', e);
  }
}
