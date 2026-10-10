import type { 
  RiskCategory, 
  RiskSeverity, 
  RuleSignalMatch, 
  DetectedRisk, 
  RiskAssessment 
} from '../types/risk';

interface HeuristicRule {
  id: string;
  name: string;
  category: RiskCategory;
  baseSeverity: RiskSeverity;
  baseWeight: number; // contribution to score
  matcher: (text: string) => { matched: boolean; phrase: string; dynamicSeverity?: RiskSeverity; dynamicReason?: string } | null;
  reasoning: string;
  whyItMatters: string;
  recommendedAction: string;
}

// Deterministic rule bank
export const HEURISTIC_RULES: HeuristicRule[] = [
  // 1. FINANCIAL: Runway Analysis
  {
    id: 'fin-runway-critical',
    name: 'Critical Runway Depletion',
    category: 'financial',
    baseSeverity: 'critical',
    baseWeight: 35,
    matcher: (text: string) => {
      // Matches "6 weeks of cash runway", "4 weeks runway", "2 months cash", etc.
      const runwayRegex = /(\b\d+)\s*(weeks?|months?|days?)\s*(?:of\s*)?(?:cash|runway|operating cash|cash runway)/i;
      const match = text.match(runwayRegex);
      if (match) {
        const val = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        
        let inWeeks = val;
        if (unit.startsWith('month')) inWeeks = val * 4.3;
        if (unit.startsWith('day')) inWeeks = val / 7;

        if (inWeeks <= 8) {
          return {
            matched: true,
            phrase: match[0],
            dynamicSeverity: 'critical',
            dynamicReason: `Detected operating cash runway of approximately ${match[1]} ${match[2]}. Cash reserves below 8 weeks trigger emergency burn containment.`
          };
        } else if (inWeeks <= 16) {
          return {
            matched: true,
            phrase: match[0],
            dynamicSeverity: 'high',
            dynamicReason: `Detected operating cash runway of ${match[1]} ${match[2]}. Less than 4 months leaves zero buffer for fundraising cycles.`
          };
        } else if (inWeeks <= 26) {
          return {
            matched: true,
            phrase: match[0],
            dynamicSeverity: 'medium',
            dynamicReason: `Detected runway mention: "${match[0]}". Runway is approaching 6-month threshold; monitor burn velocity.`
          };
        }
        // Healthy cash runway (> 26 weeks / 6 months) is NOT a risk
        return null;
      }

      // Check general low cash indicators
      const generalLowCash = text.match(/(out of cash|running out of money|burn rate too high|payroll (?:is )?(?:at risk|delayed)|zero runway)/i);
      if (generalLowCash) {
        return {
          matched: true,
          phrase: generalLowCash[0],
          dynamicSeverity: 'critical',
          dynamicReason: `Immediate liquidity distress signal: "${generalLowCash[0]}"`
        };
      }

      return null;
    },
    reasoning: 'Calculates remaining operational horizon based on extracted numeric time units against venture survival thresholds.',
    whyItMatters: 'Founders typically need 3 to 6 months to close financing or reach cashflow break-even. Having less than 8 weeks means engineering decisions are completely secondary to solvency.',
    recommendedAction: 'Freeze all non-revenue expenditures immediately. Initiate daily cash balance reconciliation and prepare an emergency bridge round or austerity budget.'
  },

  {
    id: 'fin-revenue-leak',
    name: 'Unpaid Invoices / Revenue Bottleneck',
    category: 'financial',
    baseSeverity: 'high',
    baseWeight: 22,
    matcher: (text: string) => {
      const match = text.match(/(unpaid invoices?|delayed billing|payment collection failed|accounts receivable overdue|client withholding payment)/i);
      if (match) {
        return { matched: true, phrase: match[0] };
      }
      return null;
    },
    reasoning: 'Recognizes friction in cash conversion cycles that starve working capital before revenue recognition.',
    whyItMatters: 'Paper ARR is useless if cash collections lag. Startups fail when accounts receivable balloon during crucial burn months.',
    recommendedAction: 'Place delayed enterprise accounts on automated dunning or hold non-essential feature delivery until receivables clear.'
  },

  // 2. DELIVERY: Blockers & Deadlines
  {
    id: 'del-blocked-integration',
    name: 'Critical Path Integration Blocker',
    category: 'delivery',
    baseSeverity: 'critical',
    baseWeight: 30,
    matcher: (text: string) => {
      // Avoid false positive on "unblocked"
      if (/\bunblocked\b/i.test(text) && !/\b(?:still\s+)?blocked\b/i.test(text)) {
        return null;
      }

      // Matches "payment integration is still blocked", "api is blocked", "stripe blocker", etc.
      const match = text.match(/(?:payment|auth|stripe|database|api|backend|third[- ]party|vendor)?\s*(?:integration|service|pipeline|build|pr|release)?\s*(?:is\s*)?(?:still\s*)?\b(?:blocked|failing|stuck|broken|down|unresponsive)\b/i);
      if (match && match[0].trim().length > 6) {
        return { matched: true, phrase: match[0] };
      }
      const genericBlocked = text.match(/(blocked integration|integration is blocked|payment integration is still blocked|blocking our launch)/i);
      if (genericBlocked) {
        return { matched: true, phrase: genericBlocked[0] };
      }
      return null;
    },
    reasoning: 'Detects explicit blocker statements tied to foundational dependencies or transaction pipelines.',
    whyItMatters: 'If critical systems (like payment processing or authentication) are blocked, shipping peripheral product features yields zero customer value.',
    recommendedAction: 'Swarm senior engineering resources onto the dependency interface. Define an asynchronous mock fallback or bypass path to prevent whole-team blockage.'
  },

  {
    id: 'del-fixed-deadline',
    name: 'Inflexible Release Deadline',
    category: 'delivery',
    baseSeverity: 'high',
    baseWeight: 25,
    matcher: (text: string) => {
      // Matches "release date is fixed for Friday", "hard deadline this friday", "locked release date", etc.
      const match = text.match(/(?:release date|launch date|deadline|ship date|go-live|delivery date)\s*(?:is\s*)?(?:fixed|locked|set|scheduled|hard)\s*(?:for\s*)?([a-zA-Z0-9\s]+)?/i);
      if (match) {
        return { matched: true, phrase: match[0] };
      }
      const imminentDeadline = text.match(/(must ship by (?:friday|tomorrow|end of week)|fixed for friday|release date is fixed)/i);
      if (imminentDeadline) {
        return { matched: true, phrase: imminentDeadline[0] };
      }
      return null;
    },
    reasoning: 'Identifies rigid temporal commitments that eliminate flexibility when unexpected defects emerge.',
    whyItMatters: 'Rigid calendar deadlines paired with active development force disastrous quality compromises and technical debt accumulation.',
    recommendedAction: 'Decouple release announcements from deployment. Release behind internal feature flags first, or renegotiate date vs scope commitments immediately.'
  },

  {
    id: 'del-scope-creep',
    name: 'Unchecked Scope Expansion',
    category: 'delivery',
    baseSeverity: 'medium',
    baseWeight: 15,
    matcher: (text: string) => {
      const match = text.match(/(scope creep|added more requirements|expanding scope|feature bloat|moved the goalposts|extra deliverables)/i);
      if (match) {
        return { matched: true, phrase: match[0] };
      }
      return null;
    },
    reasoning: 'Flags additions to active milestone requirements without corresponding timeline extensions.',
    whyItMatters: 'Expanding scope during sprint execution dilutes QA thoroughness and drains momentum.',
    recommendedAction: 'Enforce a strict "Scope Freeze". Log all incoming requests into Post-Launch backlog (V1.1).'
  },

  // 3. SECURITY: Reviews, Secrets, Gaps
  {
    id: 'sec-incomplete-review',
    name: 'Uncompleted Security Review Prior to Release',
    category: 'security',
    baseSeverity: 'critical',
    baseWeight: 35,
    matcher: (text: string) => {
      // If review is passed/completed without negative negation, do not flag
      if (/security review (?:passed|completed|approved|successful)/i.test(text) && !/(?:not|haven't|have not)/i.test(text)) {
        return null;
      }

      // Matches "have not completed the security review", "security audit pending", etc.
      const match = text.match(/(?:not|haven't|have not|pending|skipped|no|missing|uncompleted)\s*(?:completed|done|finished)?\s*(?:the\s*)?(?:security review|security audit|penetration test|pentest|security check|infosec clearance)/i);
      if (match) {
        return { matched: true, phrase: match[0] };
      }
      const altMatch = text.match(/(security review (?:is )?(?:not done|pending|skipped|incomplete)|haven't done security)/i);
      if (altMatch) {
        return { matched: true, phrase: altMatch[0] };
      }
      return null;
    },
    reasoning: 'Flags pending or bypassed security verification procedures before external availability.',
    whyItMatters: 'Deploying transaction or user data systems without security clearance exposes the company to catastrophic data breach liabilities and reputational ruin.',
    recommendedAction: 'Institute a release gate veto. Perform an automated static analysis (SAST) run and minimum-viable threat triage before granting production access.'
  },

  {
    id: 'sec-credentials-exposed',
    name: 'Credential or Vulnerability Exposure',
    category: 'security',
    baseSeverity: 'critical',
    baseWeight: 40,
    matcher: (text: string) => {
      const match = text.match(/(exposed api key|leaked credentials?|hardcoded secret|critical cve|zero-day|unencrypted passwords?|open s3 bucket)/i);
      if (match) {
        return { matched: true, phrase: match[0] };
      }
      return null;
    },
    reasoning: 'High-probability detector for direct credential mishandling or critical software vulnerabilities.',
    whyItMatters: 'Exposed credentials can be scraped within minutes by automated bots, causing unauthorized infrastructure consumption or data extraction.',
    recommendedAction: 'Rotate keys immediately, invalidate active session tokens, and verify secret rotation across environment managers.'
  },

  // 4. COMPLIANCE: Legal & Privacy
  {
    id: 'comp-gdpr-dpa-gap',
    name: 'Regulatory / Privacy Policy Deficit',
    category: 'compliance',
    baseSeverity: 'high',
    baseWeight: 25,
    matcher: (text: string) => {
      // Must require a negative/deficit qualifier
      const match = text.match(/(?:haven't updated|have not updated|missing|no|lacking|outdated|failed|breached|non-compliant|gap in|issue with|audit failure)\s*(?:our\s*)?(?:gdpr|hipaa|soc2|privacy policy|dpa agreements?|terms of service|data processing)/i);
      if (match) {
        return { matched: true, phrase: match[0] };
      }
      const altMatch = text.match(/(?:gdpr|hipaa|soc2|privacy policy|dpa agreements?)\s*(?:is|are)?\s*(?:missing|outdated|incomplete|non-compliant|not updated|pending|delayed)/i);
      if (altMatch) {
        return { matched: true, phrase: altMatch[0] };
      }
      return null;
    },
    reasoning: 'Flags unaddressed compliance obligations, particularly for cross-border data protection (GDPR/HIPAA/SOC2).',
    whyItMatters: 'Enterprise clients and European regulators levy severe penalties or halt contracts if statutory privacy agreements are deficient.',
    recommendedAction: 'Draft and execute standardized Data Processing Addendums (DPAs) with all sub-processors prior to onboarding regulated customer cohorts.'
  },

  {
    id: 'comp-licensing-audit',
    name: 'Intellectual Property or Licensing Exposure',
    category: 'compliance',
    baseSeverity: 'medium',
    baseWeight: 18,
    matcher: (text: string) => {
      const match = text.match(/(license violation|gpl copyleft risk|copyright notice|patent threat|unlicensed dependencies)/i);
      if (match) {
        return { matched: true, phrase: match[0] };
      }
      return null;
    },
    reasoning: 'Identifies legal vulnerabilities in dependency licenses or commercial terms.',
    whyItMatters: 'Licensing contamination can block investor due diligence and jeopardize IP ownership.',
    recommendedAction: 'Audit project manifest with license scanners (e.g., FOSSA/license-checker) to eliminate viral licenses.'
  },

  // 5. CUSTOMER: Churn, SLA, Outage
  {
    id: 'cust-enterprise-churn',
    name: 'High-Impact Enterprise Churn Threat',
    category: 'customer',
    baseSeverity: 'critical',
    baseWeight: 35,
    matcher: (text: string) => {
      // Ignore positive retention notes
      if (/(?:zero|no|prevented|avoided)\s*(?:customer\s*)?churn/i.test(text) || /all\s*(?:enterprise\s*)?accounts\s*renewed/i.test(text)) {
        return null;
      }

      const match = text.match(/(?:largest|enterprise|key|biggest|flagship)?\s*(?:customer|client|account)\s*(?:is\s*)?(?:threaten(?:ing|s)|leaving|churning|cancelling|terminat(?:ing|e)|discontent)/i);
      if (match) {
        return { matched: true, phrase: match[0] };
      }
      const altMatch = text.match(/(threatens to churn|cancel the contract|threatening to leave|retention risk)/i);
      if (altMatch) {
        return { matched: true, phrase: altMatch[0] };
      }
      return null;
    },
    reasoning: 'Recognizes urgent revenue flight threats from vital client relationships.',
    whyItMatters: 'In early-stage companies, customer concentration is high. Losing a marquee account wrecks both NRR and investor narrative.',
    recommendedAction: 'Schedule an executive sponsor check-in with the client within 12 hours. Offer dedicated engineering office hours and clear SLA commitments.'
  },

  {
    id: 'cust-sla-latency',
    name: 'SLA Breach or Performance Degradation',
    category: 'customer',
    baseSeverity: 'high',
    baseWeight: 24,
    matcher: (text: string) => {
      const match = text.match(/(?:sla (?:is )?(?:breached|violated|threat)|latency spiked|response times? spiked|server outage|downtime complaint|4 seconds|p1 bug|support backlog)/i);
      if (match) {
        return { matched: true, phrase: match[0] };
      }
      return null;
    },
    reasoning: 'Detects system quality degradation leading to contractual service level penalties.',
    whyItMatters: 'Repeated SLA breaches trigger contractual penalties, negative word of mouth, and contract termination rights.',
    recommendedAction: 'Halt non-critical batch jobs. Scale database read-replicas and inspect slow query APM logs for the degrading endpoints.'
  }
];

// Compounding cross-category correlation rules
interface CompoundingRule {
  id: string;
  name: string;
  triggerRuleIds: string[];
  bonusScore: number;
  explanation: string;
}

export const COMPOUNDING_RULES: CompoundingRule[] = [
  {
    id: 'comp-delivery-deadlock',
    name: 'Deadline & Dependency Collision',
    triggerRuleIds: ['del-blocked-integration', 'del-fixed-deadline'],
    bonusScore: 18,
    explanation: 'A fixed hard release deadline while the core integration is actively blocked creates an inevitable ship failure or broken deployment.'
  },
  {
    id: 'comp-blind-deployment',
    name: 'Blind Release Hazard',
    triggerRuleIds: ['del-fixed-deadline', 'sec-incomplete-review'],
    bonusScore: 16,
    explanation: 'Shipping to production on a fixed deadline with an unverified security perimeter risks deploying exposed vulnerabilities.'
  },
  {
    id: 'comp-solvency-squeeze',
    name: 'Runway & Delivery Solvency Squeeze',
    triggerRuleIds: ['fin-runway-critical', 'del-blocked-integration'],
    bonusScore: 20,
    explanation: 'With cash runway below 8 weeks and revenue-critical integrations blocked, the team faces financial exhaustion before monetization.'
  },
  {
    id: 'comp-enterprise-sla-churn',
    name: 'Enterprise Escalation Cascade',
    triggerRuleIds: ['cust-enterprise-churn', 'cust-sla-latency'],
    bonusScore: 15,
    explanation: 'Performance degradation combined with active churn threats directly triggers contract cancellation clauses.'
  }
];

// Helper to determine severity level from numeric score
export function getSeverityFromScore(score: number): RiskSeverity {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

// Deterministic assessment function
export function assessProjectUpdate(
  rawText: string, 
  inputMethod: 'voice' | 'text' = 'text'
): RiskAssessment {
  const normalizedText = rawText.trim();
  const matchedRules: RuleSignalMatch[] = [];
  const detectedRisks: DetectedRisk[] = [];
  
  const categoryScores: Record<RiskCategory, number> = {
    delivery: 0,
    financial: 0,
    security: 0,
    compliance: 0,
    customer: 0
  };

  // Run all heuristic rules against input
  for (const rule of HEURISTIC_RULES) {
    const result = rule.matcher(normalizedText);
    if (result && result.matched) {
      const severity = result.dynamicSeverity || rule.baseSeverity;
      const weight = rule.baseWeight;
      const reasoning = result.dynamicReason || rule.reasoning;

      matchedRules.push({
        ruleId: rule.id,
        ruleName: rule.name,
        matchedText: result.phrase,
        category: rule.category,
        severity,
        weight,
        reasoning,
        whyItMatters: rule.whyItMatters,
        recommendedAction: rule.recommendedAction,
        confidence: 0.95
      });

      detectedRisks.push({
        id: `risk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: rule.name,
        category: rule.category,
        severity,
        detectedPhrase: result.phrase,
        reasoning,
        whyItMatters: rule.whyItMatters,
        recommendedAction: rule.recommendedAction,
        ruleId: rule.id,
        sourceTextSnippet: result.phrase
      });

      categoryScores[rule.category] += weight;
    }
  }

  // Check compounding rules
  const compoundingFactors: string[] = [];
  let compoundBonus = 0;
  const activeRuleIds = new Set(matchedRules.map(r => r.ruleId));

  for (const cRule of COMPOUNDING_RULES) {
    const isTriggered = cRule.triggerRuleIds.every(id => activeRuleIds.has(id));
    if (isTriggered) {
      compoundingFactors.push(`${cRule.name}: ${cRule.explanation}`);
      compoundBonus += cRule.bonusScore;
    }
  }

  // Compute composite score (capped at 100)
  const baseTotal = matchedRules.reduce((sum, r) => sum + r.weight, 0);
  const rawScore = baseTotal + compoundBonus;
  // Normalized curve
  const overallScore = Math.min(100, Math.round(rawScore));
  const overallLevel = getSeverityFromScore(overallScore);

  return {
    id: `assess-${Date.now()}`,
    timestamp: Date.now(),
    rawInput: normalizedText,
    inputMethod,
    overallScore,
    overallLevel,
    risks: detectedRisks,
    categoryScores,
    compoundingFactors
  };
}
