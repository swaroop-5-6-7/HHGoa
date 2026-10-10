export interface DemoPreset {
  id: string;
  title: string;
  tag: string;
  description: string;
  text: string;
}

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'default-crunch',
    title: 'Runway & Delivery Crunch (Default Demo)',
    tag: 'Critical Multi-Signal',
    description: 'A classic startup high-stress update highlighting acute runway, dependency blockers, and uncompleted security reviews before a fixed date.',
    text: 'We have 6 weeks of cash runway. The payment integration is still blocked. The release date is fixed for Friday. We have not completed the security review.'
  },
  {
    id: 'enterprise-sla',
    title: 'Enterprise Retention & Latency Spike',
    tag: 'Customer & Performance',
    description: 'An enterprise account threatening churn paired with severe server latency spikes and support backlog.',
    text: 'Our largest enterprise customer threatens to churn if the custom SLA is not met by tomorrow. Server response times spiked to 4 seconds during peak hours and unpaid invoices are delayed.'
  },
  {
    id: 'gdpr-compliance',
    title: 'Global Expansion & Regulatory Deficit',
    tag: 'Compliance & Legal',
    description: 'Scaling to new territories without completing mandatory statutory compliance and data protection agreements.',
    text: 'We are expanding to the EU next month but haven\'t updated our GDPR privacy policy and DPA agreements with our third-party vendors. The release date is fixed for next week.'
  },
  {
    id: 'healthy-sprint',
    title: 'De-risked Milestone Update',
    tag: 'Healthy / Low Risk',
    description: 'A disciplined sprint with healthy cash reserves, completed reviews, and decoupled deployments.',
    text: 'We completed the staged rollout behind feature flags. Security review passed with zero high CVEs. We have 18 months of operating cash runway and all enterprise accounts renewed.'
  }
];

export const DEFAULT_DEMO_TEXT = DEMO_PRESETS[0].text;
