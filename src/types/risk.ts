export type RiskCategory = 
  | 'delivery'
  | 'financial'
  | 'security'
  | 'compliance'
  | 'customer';

export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export type RiskStatus = 'open' | 'mitigating' | 'resolved';

export interface RuleSignalMatch {
  ruleId: string;
  ruleName: string;
  matchedText: string;
  category: RiskCategory;
  severity: RiskSeverity;
  weight: number;
  reasoning: string;
  whyItMatters: string;
  recommendedAction: string;
  confidence: number; // 0.0 - 1.0 based on heuristic certainty
}

export interface DetectedRisk {
  id: string;
  title: string;
  category: RiskCategory;
  severity: RiskSeverity;
  detectedPhrase: string;
  reasoning: string;
  whyItMatters: string;
  recommendedAction: string;
  ruleId: string;
  sourceTextSnippet: string;
}

export interface RiskAssessment {
  id: string;
  timestamp: number;
  rawInput: string;
  inputMethod: 'voice' | 'text';
  overallScore: number; // 0 - 100
  overallLevel: RiskSeverity;
  risks: DetectedRisk[];
  categoryScores: Record<RiskCategory, number>;
  compoundingFactors: string[];
}

export interface RegisterItem {
  id: string;
  title: string;
  category: RiskCategory;
  severity: RiskSeverity;
  status: RiskStatus;
  detectedPhrase: string;
  whyItMatters: string;
  recommendedAction: string;
  dateIdentified: number;
  lastUpdated: number;
  assessmentId?: string;
  notes?: string;
}
