# Market Arena (Case Simulator) — Architecture & Process Flow

The **Market Arena** is a gamified financial simulator that allows users to experience historical market crises, make asset allocation decisions, and see the consequences of their choices.

This document outlines the architecture, data flow, and calculation logic of the simulator.

---

## 1. System Architecture

The simulator is built using React Native / Expo and consists of four main distinct parts:

1. **Data Layer:** `data/simulatorCases.ts` (Static data repository)
2. **Selection Screen:** `app/(tabs)/simulator/index.tsx` (Market Arena Landing)
3. **Gameplay Engine:** `app/(tabs)/simulator/play.tsx` (Core simulation loop)
4. **Scoring & Results:** `app/(tabs)/simulator/results.tsx` (Final evaluation and takeaways)

---

## 2. The Data Model (`simulatorCases.ts`)

Each simulation case follows a strict interface structure:

- **Case Metadata:** Title, historical context, starting capital, duration, difficulty.
- **Assets Array:** The available financial instruments (e.g., Stocks, Bonds, Gold, Crypto). Each asset has an array of `weeklyReturns` that strictly maps to the timeline weeks.
- **Timeline (Weeks):** An array of weeks. Each week contains:
  - **Events:** News items (positive, negative, warning, breaking) that provide context before the user makes a decision.
  - **Decision:** A prompt with 3 nuanced choices. Each choice contains an `impact` object defining how the user's capital is distributed across the available asset classes (allocation percentages adding up to 100%).
- **Learning Objectives:** Post-simulation takeaways.

---

## 3. The Gameplay Loop (`play.tsx`)

### **Initial State**
- User starts with a `portfolio` value equal to the `startingCapitalNum`.
- `currentWeek` is initialized to 0.
- `allocations` starts empty (or defaults to cash).

### **The Engine Cycle (Per Week)**
1. **Context Phase:** User is presented with the events and news for the current week.
2. **Decision Phase:** User selects one of the 3 options.
3. **Execution Phase:** 
   - The selected option updates the user's `allocations` state (e.g., 60% Stock, 30% Gold, 10% Cash).
   - The engine calculates the **Weekly Return**:
     ```javascript
     let weekReturn = 0;
     assets.forEach(asset => {
         const allocPercent = option.impact[asset.type] || 0;
         const trueReturn = asset.weeklyReturns[currentWeek] || 0;
         weekReturn += (allocPercent / 100) * trueReturn;
     });
     ```
   - The overall Portfolio is updated: `newPortfolio = oldPortfolio * (1 + weekReturn / 100)`.
4. **Transition:** The week increments, new events are shown, and the updated portfolio value is displayed with animations.

### **The Crisis / Final Phase**
- In the final week, there is typically no decision—just the final market event (the crash or recovery).
- A specialized crisis animation plays, applying the final week's returns based on the user's *last made decision*.
- The user is seamlessly routed to the Results screen with their final stats passed via URL parameters.

---

## 4. Scoring Logic (`results.tsx`)

The results screen takes raw outputs (Final Portfolio, Decisions Made, Diversification Score) and translates them into a cohesive Grade and visual breakdown.

### **Key Metrics**
1. **Gain/Loss Percentage:** `((Final Portfolio - Starting Capital) / Starting Capital) * 100`
2. **Diversification Score:** Calculated during gameplay using a simplified Herfindahl-Hirschman Index (HHI). The more spread out the allocations, the higher the score (max 100).

### **Score Breakdown (Out of 100)**
- **Portfolio Value (40% weight):** Based purely on financial return.
  - `Math.max(0, Math.min(100, 50 + (gainLoss / startingCapital) * 200))`
- **Risk Management (25% weight):** Heavily influenced by the Diversification score, with bonuses/penalties based on whether the portfolio ended in profit.
- **Decision Quality (20% weight):** Evaluates if the user made active, deliberate choices rather than skipping.
- **Diversification (15% weight):** Purely the raw diversification score.

**Final Grade Mapping:**
- **S Grade:** 85+
- **A Grade:** 70–84
- **B Grade:** 55–69
- **C Grade:** 40–54
- **D Grade:** < 40

---

## 5. Achievements & Takeaways

Based on the final metrics, boolean flags unlock specific achievements:
- **Crash Survivor:** Final loss < 10%
- **Risk Manager:** Diversification score > 70
- **Market Strategist:** Final portfolio is in profit
- **Master Diversifier:** Successfully utilized 5+ distinct asset classes

Finally, the engine matches the `gainLossPercent` against thresholds to dynamically generate a customized educational message summarizing the user’s performance before presenting the historical learning objectives from the data layer.
