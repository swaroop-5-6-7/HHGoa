import { describe, it, expect } from 'vitest';
import { assessProjectUpdate, HEURISTIC_RULES, COMPOUNDING_RULES, getSeverityFromScore } from '../engine/heuristics';
import { DEFAULT_DEMO_TEXT } from '../engine/presets';

describe('Deterministic Heuristics Engine', () => {

  describe('Core Rule Catalog', () => {
    it('should have active heuristic rules across all 5 venture pillars', () => {
      const categories = new Set(HEURISTIC_RULES.map(r => r.category));
      expect(categories.has('delivery')).toBe(true);
      expect(categories.has('financial')).toBe(true);
      expect(categories.has('security')).toBe(true);
      expect(categories.has('compliance')).toBe(true);
      expect(categories.has('customer')).toBe(true);
    });

    it('should have compounding cross-category correlation rules', () => {
      expect(COMPOUNDING_RULES.length).toBeGreaterThanOrEqual(4);
      const deliveryDeadlock = COMPOUNDING_RULES.find(r => r.id === 'comp-delivery-deadlock');
      expect(deliveryDeadlock).toBeDefined();
      expect(deliveryDeadlock?.triggerRuleIds).toContain('del-blocked-integration');
      expect(deliveryDeadlock?.triggerRuleIds).toContain('del-fixed-deadline');
    });
  });

  describe('Default Demo Update Evaluation', () => {
    it('should accurately detect all 4 core signals and compounding hazards in the default demo text', () => {
      const assessment = assessProjectUpdate(DEFAULT_DEMO_TEXT, 'text');

      expect(assessment.overallScore).toBeGreaterThanOrEqual(75);
      expect(assessment.overallLevel).toBe('critical');

      const ruleIds = assessment.risks.map(r => r.ruleId);
      expect(ruleIds).toContain('fin-runway-critical');
      expect(ruleIds).toContain('del-blocked-integration');
      expect(ruleIds).toContain('del-fixed-deadline');
      expect(ruleIds).toContain('sec-incomplete-review');

      // Verify compounding factors triggered
      expect(assessment.compoundingFactors.length).toBeGreaterThanOrEqual(2);
      expect(assessment.compoundingFactors.some(f => f.includes('Deadline & Dependency Collision'))).toBe(true);
      expect(assessment.compoundingFactors.some(f => f.includes('Blind Release Hazard'))).toBe(true);

      // Verify each detected risk contains explanation, why it matters, and recommended action
      assessment.risks.forEach(risk => {
        expect(risk.detectedPhrase).toBeTruthy();
        expect(risk.whyItMatters).toBeTruthy();
        expect(risk.recommendedAction).toBeTruthy();
        expect(risk.severity).toBeTruthy();
      });
    });
  });

  describe('Financial Heuristics', () => {
    it('flags <= 8 weeks runway as critical severity', () => {
      const result = assessProjectUpdate('We only have 4 weeks of cash runway left.');
      const runwayRisk = result.risks.find(r => r.ruleId === 'fin-runway-critical');
      expect(runwayRisk).toBeDefined();
      expect(runwayRisk?.severity).toBe('critical');
    });

    it('flags 12 weeks runway as high severity', () => {
      const result = assessProjectUpdate('We have 12 weeks of runway remaining.');
      const runwayRisk = result.risks.find(r => r.ruleId === 'fin-runway-critical');
      expect(runwayRisk).toBeDefined();
      expect(runwayRisk?.severity).toBe('high');
    });

    it('detects emergency liquidity crisis indicators', () => {
      const result = assessProjectUpdate('Payroll is at risk and burn rate too high.');
      const runwayRisk = result.risks.find(r => r.ruleId === 'fin-runway-critical');
      expect(runwayRisk).toBeDefined();
      expect(runwayRisk?.severity).toBe('critical');
    });

    it('detects unpaid invoices / revenue bottlenecks', () => {
      const result = assessProjectUpdate('We have unpaid invoices causing delayed billing.');
      const invoiceRisk = result.risks.find(r => r.ruleId === 'fin-revenue-leak');
      expect(invoiceRisk).toBeDefined();
      expect(invoiceRisk?.category).toBe('financial');
    });
  });

  describe('Delivery & Deadline Heuristics', () => {
    it('detects blocked payment/auth integrations', () => {
      const result = assessProjectUpdate('The Stripe payment integration is still blocked.');
      const blocker = result.risks.find(r => r.ruleId === 'del-blocked-integration');
      expect(blocker).toBeDefined();
      expect(blocker?.category).toBe('delivery');
    });

    it('detects inflexible hard deadlines', () => {
      const result = assessProjectUpdate('The release date is fixed for Friday.');
      const deadline = result.risks.find(r => r.ruleId === 'del-fixed-deadline');
      expect(deadline).toBeDefined();
      expect(deadline?.category).toBe('delivery');
    });

    it('detects unchecked scope expansion', () => {
      const result = assessProjectUpdate('Sprint scope creep is expanding scope without deadline change.');
      const creep = result.risks.find(r => r.ruleId === 'del-scope-creep');
      expect(creep).toBeDefined();
      expect(creep?.severity).toBe('medium');
    });
  });

  describe('Security & Governance Heuristics', () => {
    it('detects pending or skipped security reviews before release', () => {
      const result = assessProjectUpdate('We have not completed the security review before launch.');
      const secRisk = result.risks.find(r => r.ruleId === 'sec-incomplete-review');
      expect(secRisk).toBeDefined();
      expect(secRisk?.category).toBe('security');
      expect(secRisk?.severity).toBe('critical');
    });

    it('detects exposed credentials or leaked secrets', () => {
      const result = assessProjectUpdate('Found an exposed api key and leaked credentials in the repo.');
      const credRisk = result.risks.find(r => r.ruleId === 'sec-credentials-exposed');
      expect(credRisk).toBeDefined();
      expect(credRisk?.severity).toBe('critical');
    });
  });

  describe('Compliance & Regulatory Heuristics', () => {
    it('detects missing GDPR / DPA agreements', () => {
      const result = assessProjectUpdate('Missing our GDPR privacy policy and DPA agreements.');
      const compRisk = result.risks.find(r => r.ruleId === 'comp-gdpr-dpa-gap');
      expect(compRisk).toBeDefined();
      expect(compRisk?.category).toBe('compliance');
    });

    it('detects license violation risks', () => {
      const result = assessProjectUpdate('Discovered license violation in our unlicensed dependencies.');
      const licRisk = result.risks.find(r => r.ruleId === 'comp-licensing-audit');
      expect(licRisk).toBeDefined();
    });
  });

  describe('Customer & Churn Heuristics', () => {
    it('detects enterprise churn threats', () => {
      const result = assessProjectUpdate('Our largest enterprise customer threatens to churn.');
      const churnRisk = result.risks.find(r => r.ruleId === 'cust-enterprise-churn');
      expect(churnRisk).toBeDefined();
      expect(churnRisk?.category).toBe('customer');
      expect(churnRisk?.severity).toBe('critical');
    });

    it('detects SLA latency degradation', () => {
      const result = assessProjectUpdate('Server response times spiked to 4 seconds and SLA breached.');
      const slaRisk = result.risks.find(r => r.ruleId === 'cust-sla-latency');
      expect(slaRisk).toBeDefined();
      expect(slaRisk?.category).toBe('customer');
    });
  });

  describe('Severity Tier Score Mapping', () => {
    it('maps scores accurately across severity tiers', () => {
      expect(getSeverityFromScore(85)).toBe('critical');
      expect(getSeverityFromScore(75)).toBe('critical');
      expect(getSeverityFromScore(60)).toBe('high');
      expect(getSeverityFromScore(50)).toBe('high');
      expect(getSeverityFromScore(35)).toBe('medium');
      expect(getSeverityFromScore(25)).toBe('medium');
      expect(getSeverityFromScore(15)).toBe('low');
      expect(getSeverityFromScore(0)).toBe('low');
    });

    it('produces low risk score for clean/healthy updates', () => {
      const result = assessProjectUpdate('Sprint completed smoothly behind feature flags. 18 months of operating cash runway.');
      expect(result.overallLevel).toBe('low');
      expect(result.risks.length).toBe(0);
      expect(result.overallScore).toBe(0);
    });
  });

});
