# RiskLens — Startup Risk Intelligence Engine

> A private, local-first risk intelligence tool for startup founders and engineering teams. Dictate or paste project updates to surface hidden delivery blockers, cash crunches, security omissions, and customer churn threats before they escalate into company-killing emergencies.

[![Watch RiskLens Product Demo](https://img.shields.io/badge/YouTube-Watch%20Live%20Demo%20Video-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=h7O8IaUTSQA)

---

## 📺 Live Video Walkthrough & Demo

Watch the complete product demonstration showcasing voice update capture, deterministic heuristic assessment, and the startup risk register in action:

👉 **[Watch the RiskLens Demo on YouTube](https://www.youtube.com/watch?v=h7O8IaUTSQA)**

[![RiskLens Video Demo Preview](https://img.youtube.com/vi/h7O8IaUTSQA/hqdefault.jpg)](https://www.youtube.com/watch?v=h7O8IaUTSQA)

---

## 🧭 Overview & Mission

Early-stage startups move fast and communicate informally across Slack, standups, and email. Critical hazards frequently hide in plain sight: an offhand comment about a 6-week runway, a dependency blocked on a vendor, an uncompleted security audit before a hard Friday release date, or an enterprise customer unhappy with API latency.

**RiskLens** translates founders' typed or spoken updates into structured, actionable risk intelligence. It does **not** rely on probabilistic LLM APIs, external cloud servers, or paid subscriptions. Instead, it operates entirely client-side using a **deterministic, transparent heuristic engine**.

---

## ⚡ The Three Core Pillars

### 1. Executive Risk Radar Dashboard
- **Venture Risk Index (0–100):** Visual radial gauge representing composite risk exposure with trend comparisons against previous assessments.
- **Most Urgent Open Risk:** Surfaces the highest-severity unmitigated risk across the entire startup, detailing the trigger signal, why it matters, and the immediate mitigation step.
- **5-Pillar Breakdown:** Real-time risk distribution across:
  - 🚚 **Delivery** (fixed deadlines, blocked integrations, scope creep)
  - 💵 **Financial** (cash runway depletion, burn rate, unpaid invoices)
  - 🛡️ **Security** (uncompleted security reviews, exposed credentials, CVEs)
  - ⚖️ **Compliance** (GDPR gaps, unsigned DPAs, licensing exposure)
  - 👥 **Customer** (enterprise churn threats, SLA breaches, latency spikes)
- **Recent Assessments Feed:** Quick-access history of evaluated sprint updates with timestamps, input modalities (voice vs text), and score badges.

### 2. Spoken & Typed Assessment Screen
- **Voice Dictation:** Hands-free project update capture via the browser's native **Web Speech API** (`webkitSpeechRecognition` / `SpeechRecognition`), featuring a live soundwave/pulse indicator.
- **Universal Text Fallback:** Resilient keyboard textarea with word/character counts, allowing founders to paste updates from Slack, Notion, or email.
- **1-Click Startup Demo Scenarios:** Includes the signature demo update:
  > *"We have 6 weeks of cash runway. The payment integration is still blocked. The release date is fixed for Friday. We have not completed the security review."*
- **Comprehensive Risk Analysis Card:**
  - **Overall Score & Severity Level** (Critical, High, Medium, Low)
  - **Compounding Hazard Multipliers** (detects dangerous intersections like *Blocked Dependency* + *Fixed Friday Release*)
  - **Individual Risk Breakdown Cards**, each detailing:
    1. **What was detected** (exact trigger quote highlighted)
    2. **How serious it is** (severity badge + venture pillar)
    3. **Why it matters** (unflinching context on how startups fail here)
    4. **What the team should do next** (tactical, prioritized mitigation playbook)
    5. **1-Click Sync** to the Risk Register.

### 3. Startup Risk Register
- **Central Risk Ledger:** Tracks all identified risks from updates or manual logs across three workflow states:
  - `Open Threat` (unaddressed hazard requiring an owner)
  - `In Mitigation` (active countermeasures underway)
  - `Resolved` (de-risked milestone, accompanied by celebratory confetti)
- **Multi-Dimensional Filters:** Filter by Pillar, Severity, or Status, plus instant keyword search.
- **Founder Mitigation Notes:** Inline notes editor to assign owners, deadlines, or board commitments.
- **Manual Risk Registration:** Modal to record off-update risks (e.g. key personnel departures, vendor pricing changes).

---

## 🔒 Local-First Architecture

RiskLens is built strictly on local-first principles:

| Attribute | RiskLens Implementation |
| :--- | :--- |
| **Authentication** | **None.** No signups, email walls, or passwords. |
| **Cloud Services** | **Zero.** No AWS, Supabase, Firebase, or external servers. |
| **AI / LLM APIs** | **Zero.** No OpenAI, Anthropic, or external API keys needed. |
| **Data Storage** | **`localStorage` (Browser Native).** State persists across reloads and offline sessions. |
| **Data Portability** | **1-Click JSON Export.** Founders can export full register data and audit histories anytime. |
| **Privacy Guarantee** | Sensitive runway numbers, contracts, and security audits **never leave your device**. |

---

## 🧮 How Scoring Works: Transparent Heuristics

RiskLens does not present itself as an AI model because it isn't one. The engine is **deterministic, visible, and inevitable**:

### 1. Numeric Runway Parsing
Extracts time units and cash reserves:
```regex
/(\b\d+)\s*(weeks?|months?|days?)\s*(?:of\s*)?(?:cash|runway|operating cash)/i
```
- $\le 8\text{ weeks}$ $\rightarrow$ **Critical Severity** (35 pts). Cash reserves below 2 months trigger emergency burn containment.
- $\le 16\text{ weeks}$ $\rightarrow$ **High Severity** (25 pts). Insufficient buffer for conventional fundraising cycles.
- $> 16\text{ weeks}$ $\rightarrow$ **Medium / Monitored** (10 pts).

### 2. Dependency & Hard Deadline Signals
- **Integration Blockers:** Matches critical path dependency failures (`payment`, `api`, `auth`, `stripe` $\times$ `blocked`, `failing`, `broken`).
- **Inflexible Deadlines:** Matches calendar-locked releases (`release date is fixed for Friday`, `hard launch deadline`).

### 3. Security & Governance Audits
- Matches bypassed or pending verification before release (`not completed the security review`, `pending pentest`, `skipped audit`).

### 4. Compounding Hazard Multipliers
Startup risks are non-linear. When multiple threats co-occur within the same update, compounding correlation rules inject bonus risk points:
- **Deadline & Dependency Collision:** Blocked Integration + Fixed Friday Date $\rightarrow$ $+18\text{ pts}$ compound.
- **Blind Release Hazard:** Fixed Friday Date + Incomplete Security Review $\rightarrow$ $+16\text{ pts}$ compound.
- **Solvency Squeeze:** Runway $< 8\text{ weeks}$ + Blocked Payment Gateway $\rightarrow$ $+20\text{ pts}$ compound.

Total score is normalized on a curve of $0\text{ to }100$:
- **0 – 24:** Low Risk (Controlled velocity)
- **25 – 49:** Medium Risk (Operational friction)
- **50 – 74:** High Risk (Milestones or accounts threatened)
- **75 – 100:** Critical Risk (Existential threats requiring immediate intervention)

---

## 🎙️ Input / Output Fallback Architecture

### Speech Recognition & Graceful Degradation
1. **Feature Detection:** The app checks for `window.SpeechRecognition` or `window.webkitSpeechRecognition`.
2. **Permission Handling:** If the user denies microphone permission or accesses the app in an unsupported browser, the app suppresses fatal crashes and displays a clear notice:
   > *"Speech recognition is unavailable in this browser environment. Keyboard input is ready."*
3. **Live Transcription:** When active, continuous interim speech transcripts are appended directly into the text area in real-time, allowing founders to speak first and edit manually with the keyboard.
4. **Keyboard Always Active:** The text box remains primary and editable at all times.

---

## 💻 Tech Stack & Design

- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS with custom obsidian/slate dark theme (`#080c14`, `#0f172a`, `#1e293b`)
- **Accent Philosophy:** Calm soft blue (`#38bdf8`) as primary brand accent; amber (`#f59e0b`) and crimson red (`#f43f5e`) strictly reserved for attention-worthy risk alerts
- **Icons:** Lucide React
- **Micro-Interactions:** Canvas Confetti for risk resolution milestones, SVG radial gauge for index tracking

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or newer)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/swaroop-5-6-7/HHGoa.git
cd HHGoa

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the local development server
npm run dev
```

Open your browser at `http://localhost:5173/` to launch RiskLens.

### Production Build

```bash
# Type check and build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

MIT License. Built for startup founders, engineering leads, and fast-moving teams.
