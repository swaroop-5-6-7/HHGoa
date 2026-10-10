import { describe, it, expect, beforeEach } from 'vitest';
import { 
  initializeStorageIfEmpty, 
  getStoredAssessments, 
  saveStoredAssessment, 
  getStoredRegisterItems, 
  saveStoredRegisterItem, 
  updateRegisterItemStatus, 
  deleteStoredRegisterItem, 
  resetStorageToDemo 
} from '../storage/localStorage';
import type { RiskAssessment, RegisterItem } from '../types/risk';

describe('Local-First Storage Layer', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes local storage with starter demo data when empty', () => {
    initializeStorageIfEmpty();

    const assessments = getStoredAssessments();
    const register = getStoredRegisterItems();

    expect(assessments.length).toBeGreaterThanOrEqual(1);
    expect(register.length).toBeGreaterThanOrEqual(5);

    // Verify all 5 categories are represented in seed register
    const categories = new Set(register.map(r => r.category));
    expect(categories.has('delivery')).toBe(true);
    expect(categories.has('financial')).toBe(true);
    expect(categories.has('security')).toBe(true);
  });

  it('saves and prepends new assessments to local storage', () => {
    const mockAssessment: RiskAssessment = {
      id: 'test-assess-1',
      timestamp: Date.now(),
      rawInput: 'Test update with cash runway notice',
      inputMethod: 'text',
      overallScore: 82,
      overallLevel: 'critical',
      risks: [],
      categoryScores: { delivery: 0, financial: 35, security: 0, compliance: 0, customer: 0 },
      compoundingFactors: []
    };

    saveStoredAssessment(mockAssessment);

    const saved = getStoredAssessments();
    expect(saved.length).toBe(1);
    expect(saved[0].id).toBe('test-assess-1');
    expect(saved[0].overallScore).toBe(82);
  });

  it('saves, updates, and deletes register items cleanly', () => {
    const mockItem: RegisterItem = {
      id: 'reg-test-1',
      title: 'Database connection pool saturation',
      category: 'delivery',
      severity: 'high',
      status: 'open',
      detectedPhrase: 'connection pool saturation',
      whyItMatters: 'Can crash app servers under traffic peak.',
      recommendedAction: 'Scale pool size and set connection timeouts.',
      dateIdentified: Date.now(),
      lastUpdated: Date.now()
    };

    saveStoredRegisterItem(mockItem);
    expect(getStoredRegisterItems().length).toBe(1);

    // Update status to 'mitigating'
    updateRegisterItemStatus('reg-test-1', 'mitigating');
    let items = getStoredRegisterItems();
    expect(items[0].status).toBe('mitigating');

    // Update status to 'resolved'
    updateRegisterItemStatus('reg-test-1', 'resolved');
    items = getStoredRegisterItems();
    expect(items[0].status).toBe('resolved');

    // Delete item
    deleteStoredRegisterItem('reg-test-1');
    items = getStoredRegisterItems();
    expect(items.length).toBe(0);
  });

  it('resets local storage cleanly back to default demo state', () => {
    // Add bogus data
    saveStoredRegisterItem({
      id: 'bogus-1',
      title: 'Bogus item',
      category: 'compliance',
      severity: 'low',
      status: 'open',
      detectedPhrase: 'none',
      whyItMatters: 'none',
      recommendedAction: 'none',
      dateIdentified: 100,
      lastUpdated: 100
    });

    resetStorageToDemo();

    const items = getStoredRegisterItems();
    expect(items.some(i => i.id === 'bogus-1')).toBe(false);
    expect(items.some(i => i.title.includes('Runway'))).toBe(true);
  });

});
