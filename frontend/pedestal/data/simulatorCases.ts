// ============================================================
// Market Case Simulator – Historically Accurate Case Data
// Professional-grade simulations with real data & nuanced decisions
// ============================================================

export interface AssetPerformance {
    name: string;
    type: 'stock' | 'bond' | 'gold' | 'cash' | 'crypto' | 'index' | 'commodity' | 'currency' | 'realestate' | 'nft';
    weeklyReturns: number[]; // % change per week
    peakReturn: number;
    finalReturn: number;
}

export interface DecisionOption {
    id: string;
    label: string;
    description: string;
    icon: string; // lucide icon name
    impact: Record<string, number>; // asset type → allocation % shift
    riskScore: number; // 1-10
}

export interface TimelineEvent {
    id: string;
    text: string;
    type: 'news' | 'warning' | 'breaking' | 'positive' | 'neutral';
    marketImpact: number; // -5 to +5
}

export interface SimulationWeek {
    title: string;
    subtitle: string;
    events: TimelineEvent[];
    decision?: {
        prompt: string;
        options: DecisionOption[];
    };
}

export interface SimulationCase {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    year: number;
    duration: string;
    difficulty: number; // 1-5
    difficultyLabel: string;
    iconName: string;
    accentColor: string;
    startingCapital: string;
    startingCapitalNum: number;
    currency: string;
    context: string;
    assets: AssetPerformance[];
    timeline: SimulationWeek[];
    learningObjectives: string[];
    tags: string[];
}
// CASE 1: Harshad Mehta Scam (1992) — Historically Accurate
const harshadMehta: SimulationCase = {
    id: 'harshad-mehta-1992',
    title: 'The Big Bull Scam',
    subtitle: 'Harshad Mehta Securities Fraud (1992)',
    description: "Navigate India's first mega stock scam. ₹5,000 crore fraud through bank receipt manipulation. Sensex went from 1,000 to 4,500 and crashed back to 2,500.",
    year: 1992,
    duration: '6 weeks',
    difficulty: 3,
    difficultyLabel: 'Medium',
    iconName: 'TrendingDown',
    accentColor: '#F59E0B',
    startingCapital: '₹10,00,000',
    startingCapitalNum: 1000000,
    currency: '₹',
    context: 'It\'s January 1992. Harshad Mehta, a stockbroker from Mumbai, has been aggressively buying shares using fraudulent bank receipts (BRs) to siphon money from the banking system. The Sensex has risen from 1,000 to over 4,000 in months. ACC cement stock has gone from ₹200 to ₹9,000. Everyone from taxi drivers to homemakers is investing. Journalist Sucheta Dalal is quietly investigating irregularities at State Bank of India.',
    assets: [
        { name: 'ACC Cement', type: 'stock', weeklyReturns: [18, 22, 12, -8, -42, -35], peakReturn: 280, finalReturn: -55 },
        { name: 'SBI & Bank Stocks', type: 'stock', weeklyReturns: [10, 14, 8, -5, -28, -22], peakReturn: 120, finalReturn: -40 },
        { name: 'Sensex Blue Chips', type: 'index', weeklyReturns: [6, 8, 5, -3, -18, -15], peakReturn: 45, finalReturn: -25 },
        { name: 'FMCG (HUL, ITC)', type: 'stock', weeklyReturns: [3, 4, 2, 0, -8, -5], peakReturn: 12, finalReturn: -6 },
        { name: 'Govt Securities', type: 'bond', weeklyReturns: [0.3, 0.3, 0.3, 0.4, 0.5, 0.5], peakReturn: 2.3, finalReturn: 2.3 },
        { name: 'Gold (MCX)', type: 'gold', weeklyReturns: [0.5, 0.5, 0.8, 1.2, 2.5, 1.8], peakReturn: 7.3, finalReturn: 7.3 },
        { name: 'Fixed Deposits', type: 'cash', weeklyReturns: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25], peakReturn: 1.5, finalReturn: 1.5 },
    ],
    timeline: [
        {
            title: 'Week 1: The Midas Touch',
            subtitle: 'Jan 1992 — Mehta\'s buying spree intensifies',
            events: [
                { id: 'hm-1-1', text: 'Sensex crosses 3,500 for the first time. India celebrates liberalization under PM Rao.', type: 'positive', marketImpact: 4 },
                { id: 'hm-1-2', text: 'ACC Cement jumps 18% in one week. Harshad Mehta rumored to be the buyer.', type: 'positive', marketImpact: 4 },
                { id: 'hm-1-3', text: 'IPO market booming — 3 new issues oversubscribed 50x this week.', type: 'positive', marketImpact: 3 },
                { id: 'hm-1-4', text: 'RBI notes unusual inter-bank transactions but takes no action.', type: 'neutral', marketImpact: 0 },
            ],
            decision: {
                prompt: 'The market is euphoric. Mehta\'s Midas touch seems real. Your neighbor just made 3x on ACC. What\'s your strategy?',
                options: [
                    { id: 'hm-d1-a', label: 'Follow The Big Bull', description: 'Heavy into ACC & banking stocks (Mehta\'s favorites)', icon: 'Flame', impact: { stock: 75, index: 10, bond: 5, gold: 5, cash: 5 }, riskScore: 9 },
                    { id: 'hm-d1-b', label: 'Ride the Wave Safely', description: 'Blue chips + some Mehta stocks. Diversified approach.', icon: 'Waves', impact: { stock: 40, index: 25, bond: 15, gold: 10, cash: 10 }, riskScore: 5 },
                    { id: 'hm-d1-c', label: 'Something Smells Off', description: 'Stick to FMCG, govt bonds, gold. This rally is unnatural.', icon: 'Search', impact: { stock: 15, index: 10, bond: 30, gold: 30, cash: 15 }, riskScore: 2 },
                ],
            },
        },
        {
            title: 'Week 2: Euphoria Peaks',
            subtitle: 'Feb 1992 — Sensex enters uncharted territory',
            events: [
                { id: 'hm-2-1', text: 'Sensex rockets past 4,000. Financial newspapers call it "India\'s decade of growth".', type: 'positive', marketImpact: 4 },
                { id: 'hm-2-2', text: 'ACC stock hits ₹9,000 from ₹200. A 44x return that defies fundamentals.', type: 'warning', marketImpact: 3 },
                { id: 'hm-2-3', text: 'New demat accounts opening at 5x normal rate. First-time investors flooding in.', type: 'warning', marketImpact: 2 },
                { id: 'hm-2-4', text: 'Mehta shows up on Doordarshan, calls himself "India\'s Warren Buffett".', type: 'news', marketImpact: 1 },
            ],
            decision: {
                prompt: 'ACC has gone from ₹200 to ₹9,000. Your portfolio is up big. But a stock going 44x on no earnings change is... unusual.',
                options: [
                    { id: 'hm-d2-a', label: 'Book Profits Now', description: 'Take 60% off the table. Move to bonds, gold & FDs.', icon: 'Banknote', impact: { stock: 20, index: 10, bond: 30, gold: 25, cash: 15 }, riskScore: 2 },
                    { id: 'hm-d2-b', label: 'Stay But Hedge', description: 'Rotate from ACC to blue chips. Reduce concentration.', icon: 'RefreshCw', impact: { stock: 35, index: 30, bond: 15, gold: 10, cash: 10 }, riskScore: 5 },
                    { id: 'hm-d2-c', label: 'Double Down', description: 'It\'s a new India! Buy more on every dip.', icon: 'TrendingUp', impact: { stock: 80, index: 10, bond: 5, gold: 3, cash: 2 }, riskScore: 10 },
                ],
            },
        },
        {
            title: 'Week 3: Cracks in the Foundation',
            subtitle: 'Mar 1992 — Smart money starts exiting quietly',
            events: [
                { id: 'hm-3-1', text: 'Institutional investors (FIIs) quietly reducing positions. Block deals happening off-market.', type: 'warning', marketImpact: -1 },
                { id: 'hm-3-2', text: 'SBI auditors flag ₹500 crore discrepancy in bank receipt transactions.', type: 'warning', marketImpact: -2 },
                { id: 'hm-3-3', text: 'Markets still rising but on lower volumes. Breadth narrowing to just Mehta stocks.', type: 'warning', marketImpact: -1 },
                { id: 'hm-3-4', text: 'Gold prices tick up as some investors seek safety.', type: 'neutral', marketImpact: 0 },
            ],
            decision: {
                prompt: 'Volume is drying up. Institutional money is leaving. Only retail investors remain bullish. Your gut says something is wrong.',
                options: [
                    { id: 'hm-d3-a', label: 'Institutional Exodus = Danger', description: 'Follow smart money out. Go 80% defensive.', icon: 'ShieldAlert', impact: { stock: 10, index: 5, bond: 35, gold: 30, cash: 20 }, riskScore: 1 },
                    { id: 'hm-d3-b', label: 'Institutional Selling = Buying Opportunity', description: 'It\'s just profit booking. Buy what they sell.', icon: 'ShoppingCart', impact: { stock: 70, index: 15, bond: 5, gold: 5, cash: 5 }, riskScore: 9 },
                    { id: 'hm-d3-c', label: 'Gradual Exit', description: 'Sell 30% per week. Slow and steady derisking.', icon: 'Timer', impact: { stock: 40, index: 15, bond: 20, gold: 15, cash: 10 }, riskScore: 5 },
                ],
            },
        },
        {
            title: 'Week 4: The Exposé',
            subtitle: 'Apr 23, 1992 — Sucheta Dalal breaks the story',
            events: [
                { id: 'hm-4-1', text: 'BREAKING: Times of India publishes Sucheta Dalal\'s investigation. ₹5,000 crore securities scam exposed.', type: 'breaking', marketImpact: -4 },
                { id: 'hm-4-2', text: 'Mehta used forged BR (bank receipts) to divert funds from banks into stock market.', type: 'breaking', marketImpact: -4 },
                { id: 'hm-4-3', text: 'Sensex drops 570 points in single session — largest single-day fall in history.', type: 'breaking', marketImpact: -5 },
                { id: 'hm-4-4', text: 'CBI raids Harshad Mehta\'s Worli residence. Suitcases of cash found.', type: 'breaking', marketImpact: -3 },
            ],
            decision: {
                prompt: 'The scam is out. Sensex crashed 12% today. But is the worst over, or is this just the beginning?',
                options: [
                    { id: 'hm-d4-a', label: 'Sell Everything Now', description: 'This is systemic fraud. Total exit to safe assets.', icon: 'LogOut', impact: { stock: 0, index: 0, bond: 35, gold: 35, cash: 30 }, riskScore: 1 },
                    { id: 'hm-d4-b', label: 'Buy The Blood', description: 'Markets overreacted. Good companies are on sale.', icon: 'Target', impact: { stock: 50, index: 20, bond: 15, gold: 10, cash: 5 }, riskScore: 8 },
                    { id: 'hm-d4-c', label: 'Selective Sell', description: 'Dump Mehta stocks only. Keep quality blue chips.', icon: 'Filter', impact: { stock: 15, index: 30, bond: 25, gold: 20, cash: 10 }, riskScore: 4 },
                ],
            },
        },
        {
            title: 'Week 5: The Avalanche',
            subtitle: 'May 1992 — Systemic collapse',
            events: [
                { id: 'hm-5-1', text: 'Multiple banks found involved. National Housing Bank, ANZ Grindlays implicated.', type: 'breaking', marketImpact: -5 },
                { id: 'hm-5-2', text: 'ACC crashes from ₹9,000 to ₹1,200. Investors trapped with no buyers.', type: 'breaking', marketImpact: -5 },
                { id: 'hm-5-3', text: 'RBI Governor forced to resign. Parliament erupts in accusations.', type: 'breaking', marketImpact: -4 },
                { id: 'hm-5-4', text: 'SEBI gets statutory powers to regulate markets (silver lining).', type: 'positive', marketImpact: 1 },
            ],
        },
        {
            title: 'Week 6: Aftermath & Lessons',
            subtitle: 'Jun 1992 — The dust settles',
            events: [
                { id: 'hm-6-1', text: 'Sensex stabilizes around 2,500. Down 40% from peak.', type: 'news', marketImpact: -2 },
                { id: 'hm-6-2', text: 'Gold up 7% as investors flee to safety. FD rates rise.', type: 'positive', marketImpact: 1 },
                { id: 'hm-6-3', text: 'Harshad Mehta arrested. 72 criminal cases filed.', type: 'news', marketImpact: 0 },
                { id: 'hm-6-4', text: 'SEBI introduces circuit breakers and disclosure norms.', type: 'positive', marketImpact: 2 },
            ],
        },
    ],
    learningObjectives: [
        'When a stock goes 44x without earnings growth, it\'s manipulation — not genius',
        'Follow institutional money flows, not retail sentiment',
        'If your taxi driver is giving stock tips, it\'s time to sell',
        'Regulatory gaps create fraud opportunities — SEBI was born from this crisis',
        'Concentration risk: Never put 50%+ in one person\'s stock picks',
        'Gold and govt bonds are genuine safe havens in fraud-driven crashes',
    ],
    tags: ['India', 'Fraud', 'Banking', 'SEBI Origins'],
};
// CASE 2: 2008 Global Financial Crisis — From Indian Investor's Perspective
const gfc2008: SimulationCase = {
    id: 'gfc-2008',
    title: 'When Banks Broke The World',
    subtitle: 'Global Financial Crisis (2008)',
    description: 'Lehman Brothers falls. Credit markets freeze. Sensex crashes from 21,000 to 8,000. But those who bought the blood made 5x in 5 years.',
    year: 2008,
    duration: '6 weeks',
    difficulty: 5,
    difficultyLabel: 'Extreme',
    iconName: 'Building2',
    accentColor: '#DC2626',
    startingCapital: '₹25,00,000',
    startingCapitalNum: 2500000,
    currency: '₹',
    context: 'It\'s September 2008. US housing market has been collapsing since 2007. Bear Stearns was rescued in March. Indian markets have already fallen from their January 2008 high of 21,206. FIIs are pulling money out of India aggressively. The rupee is weakening. But India\'s banking system, unlike the West, has minimal subprime exposure. The question: Is India\'s crash collateral damage or contagion?',
    assets: [
        { name: 'Sensex / Nifty', type: 'index', weeklyReturns: [-6, -12, -18, -8, 5, 8], peakReturn: 0, finalReturn: -33 },
        { name: 'Indian Banks (SBI, ICICI)', type: 'stock', weeklyReturns: [-8, -15, -22, -10, 7, 10], peakReturn: 0, finalReturn: -40 },
        { name: 'IT Stocks (TCS, Infosys)', type: 'stock', weeklyReturns: [-5, -10, -12, -3, 4, 6], peakReturn: 0, finalReturn: -22 },
        { name: 'Infra (L&T, DLF)', type: 'stock', weeklyReturns: [-10, -18, -25, -12, 3, 5], peakReturn: 0, finalReturn: -55 },
        { name: 'Gold (MCX)', type: 'gold', weeklyReturns: [2, 3, 5, 4, 2, 1], peakReturn: 18, finalReturn: 18 },
        { name: 'Govt Bonds (10Y)', type: 'bond', weeklyReturns: [1, 1.5, 2, 1.5, 1, 0.8], peakReturn: 8, finalReturn: 8 },
        { name: 'USD (Rupee weakened)', type: 'currency', weeklyReturns: [2, 3, 4, 2, -1, -1], peakReturn: 12, finalReturn: 9 },
        { name: 'FD / Liquid Fund', type: 'cash', weeklyReturns: [0.18, 0.18, 0.18, 0.18, 0.18, 0.18], peakReturn: 1.1, finalReturn: 1.1 },
    ],
    timeline: [
        {
            title: 'Week 1: The Tremors',
            subtitle: 'Sep 1-7, 2008 — Markets sense danger',
            events: [
                { id: 'gf-1-1', text: 'Fannie Mae and Freddie Mac placed under US government conservatorship.', type: 'breaking', marketImpact: -3 },
                { id: 'gf-1-2', text: 'FIIs pull out ₹4,200 crore from Indian markets in single week.', type: 'warning', marketImpact: -3 },
                { id: 'gf-1-3', text: 'Sensex falls 6%. Real estate stocks hit hardest — DLF down 10%.', type: 'warning', marketImpact: -3 },
                { id: 'gf-1-4', text: 'RBI holds rates steady. Says India\'s fundamentals are strong.', type: 'neutral', marketImpact: 0 },
            ],
            decision: {
                prompt: 'US housing giants just fell. FIIs are selling India hard. RBI says we\'re fine. Who do you believe?',
                options: [
                    { id: 'gf-d1-a', label: 'India Is Decoupled', description: 'Indian banks have zero subprime. Buy the dip in quality stocks.', icon: 'Flag', impact: { stock: 55, index: 20, bond: 10, gold: 5, currency: 5, cash: 5 }, riskScore: 8 },
                    { id: 'gf-d1-b', label: 'Global Contagion Risk', description: 'FII selling will crush India. Go defensive in gold, bonds, USD.', icon: 'Globe', impact: { stock: 10, index: 5, bond: 25, gold: 30, currency: 20, cash: 10 }, riskScore: 2 },
                    { id: 'gf-d1-c', label: 'Wait & Watch', description: 'Hold current positions. Don\'t panic but don\'t add risk.', icon: 'Eye', impact: { stock: 30, index: 15, bond: 20, gold: 15, currency: 10, cash: 10 }, riskScore: 5 },
                ],
            },
        },
        {
            title: 'Week 2: Lehman Falls',
            subtitle: 'Sep 15, 2008 — The day finance died',
            events: [
                { id: 'gf-2-1', text: 'BREAKING: Lehman Brothers files Chapter 11 bankruptcy. $639 billion in assets — largest bankruptcy in history.', type: 'breaking', marketImpact: -5 },
                { id: 'gf-2-2', text: 'Merrill Lynch sold to Bank of America in emergency. AIG needs $85B bailout.', type: 'breaking', marketImpact: -5 },
                { id: 'gf-2-3', text: 'Sensex crashes 1,000 points. Auto-halted via circuit breakers.', type: 'breaking', marketImpact: -5 },
                { id: 'gf-2-4', text: 'Indian IT companies fear client bankruptcies. TCS, Infosys fall 10%+.', type: 'breaking', marketImpact: -4 },
            ],
            decision: {
                prompt: 'Lehman is dead. The global financial system is in cardiac arrest. Indian markets in free fall. What now?',
                options: [
                    { id: 'gf-d2-a', label: 'Full Panic Exit', description: 'Liquidate everything. Cash is king in a systemic crisis.', icon: 'AlertOctagon', impact: { stock: 0, index: 0, bond: 20, gold: 25, currency: 15, cash: 40 }, riskScore: 2 },
                    { id: 'gf-d2-b', label: 'Contrarian Buy', description: 'Great businesses at 50% off. Accumulate quality gradually.', icon: 'Brain', impact: { stock: 45, index: 25, bond: 15, gold: 10, currency: 0, cash: 5 }, riskScore: 8 },
                    { id: 'gf-d2-c', label: 'Gold + Dollar Hedge', description: 'Pure safe haven play. Rupee will weaken further.', icon: 'Shield', impact: { stock: 5, index: 5, bond: 15, gold: 40, currency: 25, cash: 10 }, riskScore: 2 },
                ],
            },
        },
        {
            title: 'Week 3: The Abyss',
            subtitle: 'Oct 2008 — Markets lose all hope',
            events: [
                { id: 'gf-3-1', text: 'Sensex breaches 10,000. Down 52% from January high.', type: 'breaking', marketImpact: -5 },
                { id: 'gf-3-2', text: 'India\'s ICICI Bank faces rumors of Lehman exposure. Stock crashes 40%.', type: 'breaking', marketImpact: -5 },
                { id: 'gf-3-3', text: 'Rupee falls to ₹49/$ from ₹40/$. Import bills soaring.', type: 'breaking', marketImpact: -4 },
                { id: 'gf-3-4', text: 'Warren Buffett writes NYT op-ed: "Buy American. I Am." Markets ignore him.', type: 'positive', marketImpact: 1 },
            ],
            decision: {
                prompt: 'Sensex is at 10,000. ICICI rumored to collapse. But Buffett says buy. Do you trust the Oracle?',
                options: [
                    { id: 'gf-d3-a', label: 'Buffett Is Right', description: 'Start SIP into quality. Fear creates opportunity.', icon: 'Star', impact: { stock: 40, index: 30, bond: 15, gold: 10, currency: 0, cash: 5 }, riskScore: 7 },
                    { id: 'gf-d3-b', label: 'More Pain Ahead', description: 'Lehman was just the start. Stay defensive.', icon: 'AlertTriangle', impact: { stock: 5, index: 0, bond: 25, gold: 35, currency: 20, cash: 15 }, riskScore: 1 },
                    { id: 'gf-d3-c', label: 'Barbell Strategy', description: '40% ultra-safe (gold/bonds) + 30% quality stocks + 30% cash for future deployment.', icon: 'Scale', impact: { stock: 20, index: 10, bond: 20, gold: 20, currency: 5, cash: 25 }, riskScore: 4 },
                ],
            },
        },
        {
            title: 'Week 4: Bottom Fishing',
            subtitle: 'Nov 2008 — Sensex hits 8,000',
            events: [
                { id: 'gf-4-1', text: 'Sensex crashes to 7,697. The absolute bottom. Total panic in markets.', type: 'breaking', marketImpact: -4 },
                { id: 'gf-4-2', text: '26/11 Mumbai terror attacks add to market turmoil.', type: 'breaking', marketImpact: -3 },
                { id: 'gf-4-3', text: 'RBI cuts repo rate by 100bps. Signals aggressive easing ahead.', type: 'positive', marketImpact: 2 },
                { id: 'gf-4-4', text: 'ICICI Bank clarifies: Lehman exposure only $80M. Stock bounces 12%.', type: 'positive', marketImpact: 3 },
            ],
            decision: {
                prompt: 'Sensex at 7,697. RBI cutting rates. Mumbai attacks happened. Is this the generational buying opportunity or the start of a depression?',
                options: [
                    { id: 'gf-d4-a', label: 'Back Up The Truck', description: 'Deploy all cash into quality equity. This is THE bottom.', icon: 'ArrowDown', impact: { stock: 60, index: 30, bond: 5, gold: 3, currency: 0, cash: 2 }, riskScore: 9 },
                    { id: 'gf-d4-b', label: 'SIP Mode', description: 'Start systematic buying. ₹1L/week into diversified equity.', icon: 'RefreshCw', impact: { stock: 35, index: 20, bond: 15, gold: 15, currency: 5, cash: 10 }, riskScore: 5 },
                    { id: 'gf-d4-c', label: 'Stay In Bunker', description: 'Terror attacks + financial crisis = stay in cash/gold.', icon: 'Shield', impact: { stock: 5, index: 5, bond: 25, gold: 35, currency: 15, cash: 15 }, riskScore: 1 },
                ],
            },
        },
        {
            title: 'Week 5: Green Shoots',
            subtitle: 'Dec 2008 — Policy response kicks in',
            events: [
                { id: 'gf-5-1', text: 'US Fed cuts rates to near zero. Quantitative easing announced.', type: 'positive', marketImpact: 3 },
                { id: 'gf-5-2', text: 'Indian government announces fiscal stimulus. Infrastructure spending boost.', type: 'positive', marketImpact: 3 },
                { id: 'gf-5-3', text: 'Sensex bounces 5% from bottom. Short covering rally.', type: 'positive', marketImpact: 2 },
            ],
        },
        {
            title: 'Week 6: The Long Road Back',
            subtitle: 'Jan 2009 — Recovery begins',
            events: [
                { id: 'gf-6-1', text: 'Satyam fraud exposed (India\'s Enron) but markets absorb the shock.', type: 'warning', marketImpact: -2 },
                { id: 'gf-6-2', text: 'Sensex climbs 8% in January. Recovery trade picking up steam.', type: 'positive', marketImpact: 3 },
                { id: 'gf-6-3', text: 'Those who bought at 8,000 are already up 25%. By 2014, they\'ll be up 300%.', type: 'positive', marketImpact: 3 },
            ],
        },
    ],
    learningObjectives: [
        'In global crises, ALL correlated assets fall together — "decoupling" is a myth',
        'Contrarian buying at maximum fear creates generational wealth (Sensex 8K→60K)',
        'Liquidity (cash) is the most valuable asset during a crash — it gives optionality',
        'Gold and USD are genuine hedges when equity markets collapse',
        'Systematic investing (SIP) through crashes beats timing the bottom',
        'Central bank policy response is the signal to start buying, not the crash itself',
    ],
    tags: ['Global', 'Banking Crisis', 'Contrarian', 'India'],
};
// CASE 3: COVID Crash & Recovery (2020) — The V-Shape That Broke All Rules
const covidCrash: SimulationCase = {
    id: 'covid-2020',
    title: 'The Pandemic Portfolio',
    subtitle: 'COVID-19 Crash & V-Recovery (2020)',
    description: 'The fastest crash AND the fastest recovery in market history. Nifty fell 38% in 33 days, then doubled in 18 months. Only those who acted on BOTH survived.',
    year: 2020,
    duration: '6 weeks',
    difficulty: 4,
    difficultyLabel: 'Hard',
    iconName: 'Activity',
    accentColor: '#059669',
    startingCapital: '₹20,00,000',
    startingCapitalNum: 2000000,
    currency: '₹',
    context: 'It\'s late February 2020. A virus called COVID-19 is spreading from China to Italy. India has only 3 confirmed cases. Markets are near all-time highs. Nobody expects a lockdown. PM Modi will announce a 21-day national lockdown on March 24. This will be the most unique market event: the crash was brutal but the recovery was equally stunning — powered by retail investors, RBI rate cuts, and massive global liquidity.',
    assets: [
        { name: 'Nifty 50', type: 'index', weeklyReturns: [-3, -10, -15, -12, 6, 9], peakReturn: 0, finalReturn: -27 },
        { name: 'Pharma (Sun, Dr Reddy)', type: 'stock', weeklyReturns: [-2, -5, -3, 5, 12, 8], peakReturn: 22, finalReturn: 15 },
        { name: 'IT (TCS, Wipro)', type: 'stock', weeklyReturns: [-3, -8, -12, 2, 8, 10], peakReturn: 0, finalReturn: -5 },
        { name: 'Aviation (IndiGo, SpiceJet)', type: 'stock', weeklyReturns: [-8, -20, -30, -15, 5, 3], peakReturn: 0, finalReturn: -60 },
        { name: 'FMCG (HUL, Nestlé)', type: 'stock', weeklyReturns: [-2, -5, -8, 0, 4, 6], peakReturn: 0, finalReturn: -6 },
        { name: 'Digital (Reliance Jio play)', type: 'stock', weeklyReturns: [-4, -8, -10, 5, 10, 15], peakReturn: 12, finalReturn: 7 },
        { name: 'Gold', type: 'gold', weeklyReturns: [1.5, 3, 4, 3, 1, 0.5], peakReturn: 14, finalReturn: 14 },
        { name: 'Liquid Funds', type: 'cash', weeklyReturns: [0.1, 0.1, -0.5, 0.1, 0.1, 0.1], peakReturn: 0.2, finalReturn: 0 },
    ],
    timeline: [
        {
            title: 'Week 1: Distant Thunder',
            subtitle: 'Late Feb 2020 — India has 3 cases. Markets shrug.',
            events: [
                { id: 'cv-1-1', text: 'India confirms 3 COVID cases. ICMR says "no community transmission."', type: 'news', marketImpact: -1 },
                { id: 'cv-1-2', text: 'Italy reports cluster of 150+ cases. Lombardy in lockdown.', type: 'warning', marketImpact: -2 },
                { id: 'cv-1-3', text: 'Sensex falls 3% but analysts call it "overreaction to a flu."', type: 'neutral', marketImpact: -1 },
                { id: 'cv-1-4', text: 'Budget 2020 just happened. Focus is on fiscal policy, not virus.', type: 'neutral', marketImpact: 0 },
            ],
            decision: {
                prompt: 'Italy is locked down. India has 3 cases. Your fund manager says "India won\'t be affected." Your epidemiologist friend says "prepare." Who do you listen to?',
                options: [
                    { id: 'cv-d1-a', label: 'Trust the Epidemiologist', description: 'Rotate to pharma, digital, gold. Sell aviation & hospitality.', icon: 'HeartPulse', impact: { stock: 35, index: 10, gold: 25, cash: 30 }, riskScore: 3 },
                    { id: 'cv-d1-b', label: 'Trust the Fund Manager', description: 'India is different. Stay invested. Maybe add on dip.', icon: 'Briefcase', impact: { stock: 60, index: 25, gold: 5, cash: 10 }, riskScore: 7 },
                    { id: 'cv-d1-c', label: 'Raise Cash Quietly', description: 'Sell 50% of equity. Keep powder dry for whatever comes.', icon: 'Wallet', impact: { stock: 20, index: 10, gold: 15, cash: 55 }, riskScore: 2 },
                ],
            },
        },
        {
            title: 'Week 2: Fear Arrives',
            subtitle: 'Early Mar 2020 — WHO declares pandemic',
            events: [
                { id: 'cv-2-1', text: 'WHO declares COVID-19 a global pandemic on March 11.', type: 'breaking', marketImpact: -5 },
                { id: 'cv-2-2', text: 'Sensex crashes 2,919 points (8.18%) in single day — March 12.', type: 'breaking', marketImpact: -5 },
                { id: 'cv-2-3', text: 'Oil crashes 30% as Saudi-Russia price war erupts simultaneously.', type: 'breaking', marketImpact: -4 },
                { id: 'cv-2-4', text: 'India bans all international flights. FIIs sell ₹12,000 crore in a week.', type: 'breaking', marketImpact: -4 },
            ],
            decision: {
                prompt: 'Sensex crashed 8% in ONE day. Oil is collapsing. Flights banned. This is clearly serious. But markets have fallen 20% — is the worst priced in?',
                options: [
                    { id: 'cv-d2-a', label: 'Lockdown Is Coming', description: 'If India locks down, earnings collapse. Full exit now.', icon: 'Lock', impact: { stock: 5, index: 0, gold: 35, cash: 60 }, riskScore: 2 },
                    { id: 'cv-d2-b', label: 'Start the SIP Engine', description: 'Deploy 15% of cash weekly. Best companies at 40% discount.', icon: 'RefreshCw', impact: { stock: 30, index: 20, gold: 20, cash: 30 }, riskScore: 5 },
                    { id: 'cv-d2-c', label: 'Sector Bet', description: 'Go heavy pharma, IT, digital. These WIN from lockdown.', icon: 'Crosshair', impact: { stock: 50, index: 10, gold: 15, cash: 25 }, riskScore: 6 },
                ],
            },
        },
        {
            title: 'Week 3: The National Lockdown',
            subtitle: 'Mar 24, 2020 — "Janta Curfew" to full lockdown',
            events: [
                { id: 'cv-3-1', text: 'BREAKING: PM Modi announces 21-day nationwide lockdown. 1.4 billion people stay home.', type: 'breaking', marketImpact: -5 },
                { id: 'cv-3-2', text: 'Nifty hits 7,511 — down 38% from February high. Lower circuit triggered.', type: 'breaking', marketImpact: -5 },
                { id: 'cv-3-3', text: 'Crude oil touches $20/barrel. Indian oil companies paradoxically benefit from cheap imports.', type: 'news', marketImpact: -1 },
                { id: 'cv-3-4', text: 'Zerodha and Groww report record new account openings. Retail investors smell opportunity.', type: 'positive', marketImpact: 1 },
            ],
            decision: {
                prompt: 'India is locked down. Nifty at 7,511 — a 38% crash in 33 days. Retail investors are opening Demat accounts. Is this madness or genius?',
                options: [
                    { id: 'cv-d3-a', label: 'Be Greedy When Others Are Fearful', description: 'Deploy 50% of remaining cash into blue-chip equity.', icon: 'Brain', impact: { stock: 45, index: 30, gold: 10, cash: 15 }, riskScore: 7 },
                    { id: 'cv-d3-b', label: 'Lockdown Could Extend', description: 'Stay in gold and cash. GDP will contract. Worst isn\'t over.', icon: 'Timer', impact: { stock: 5, index: 5, gold: 40, cash: 50 }, riskScore: 2 },
                    { id: 'cv-d3-c', label: 'Pharma + Digital Only', description: 'Only buy pandemic winners. Avoid everything else.', icon: 'Zap', impact: { stock: 40, index: 5, gold: 20, cash: 35 }, riskScore: 5 },
                ],
            },
        },
        {
            title: 'Week 4: The RBI Bazooka',
            subtitle: 'Apr 2020 — Central bank steps in big',
            events: [
                { id: 'cv-4-1', text: 'RBI cuts repo rate by 75bps to 4.4%. Announces ₹3.74 lakh crore liquidity.', type: 'positive', marketImpact: 4 },
                { id: 'cv-4-2', text: 'US Fed announces unlimited QE. "Whatever it takes" to save markets.', type: 'positive', marketImpact: 4 },
                { id: 'cv-4-3', text: 'Nifty bounces 15% from bottom. Bears caught off guard.', type: 'positive', marketImpact: 3 },
                { id: 'cv-4-4', text: 'Franklin Templeton shuts 6 debt mutual funds. Credit risk funds in trouble.', type: 'warning', marketImpact: -2 },
            ],
            decision: {
                prompt: 'Markets bouncing hard. RBI flooding the system with money. But the economy is shut. Is this a dead cat bounce or the real recovery?',
                options: [
                    { id: 'cv-d4-a', label: 'Central Banks Win', description: 'Unlimited money printing = stocks go up. Go all in.', icon: 'Landmark', impact: { stock: 55, index: 30, gold: 10, cash: 5 }, riskScore: 7 },
                    { id: 'cv-d4-b', label: 'Dead Cat Bounce', description: 'Economy is destroyed. This rally is fake. Stay defensive.', icon: 'AlertTriangle', impact: { stock: 10, index: 5, gold: 35, cash: 50 }, riskScore: 2 },
                    { id: 'cv-d4-c', label: 'Balanced Recovery Play', description: 'Add equity gradually. Keep gold as insurance.', icon: 'Scale', impact: { stock: 30, index: 20, gold: 25, cash: 25 }, riskScore: 4 },
                ],
            },
        },
        {
            title: 'Week 5: The Recovery Train',
            subtitle: 'May 2020 — Unlock begins',
            events: [
                { id: 'cv-5-1', text: 'Lockdown extended but with relaxations. "Unlock 1.0" announced.', type: 'positive', marketImpact: 2 },
                { id: 'cv-5-2', text: 'Pharma stocks rally 12%. Vaccine race begins globally.', type: 'positive', marketImpact: 3 },
                { id: 'cv-5-3', text: 'Reliance raises ₹1.15 lakh crore from Facebook, Google, etc. Stock surges.', type: 'positive', marketImpact: 4 },
            ],
        },
        {
            title: 'Week 6: New Normal, New Markets',
            subtitle: 'Jun 2020 — Markets decouple from economy',
            events: [
                { id: 'cv-6-1', text: 'Nifty recovers to 10,000+. Up 35% from bottom despite GDP contracting 24%.', type: 'positive', marketImpact: 3 },
                { id: 'cv-6-2', text: 'Retail investors have added ₹50,000 crore to markets via SIPs and direct equity.', type: 'positive', marketImpact: 3 },
                { id: 'cv-6-3', text: 'Gold hits all-time high of ₹53,000/10g as global uncertainty persists.', type: 'positive', marketImpact: 2 },
            ],
        },
    ],
    learningObjectives: [
        'The market is NOT the economy — stocks can recover while GDP contracts',
        'Central bank policy (rate cuts + liquidity) is the most powerful force in markets',
        'Sector rotation matters: COVID crushed aviation but boosted pharma & digital',
        'Retail investors who started SIPs during the crash became the recovery story',
        'Cash is not trash — having dry powder during crashes is essential',
        'The best buys of your life happen when the world feels like it\'s ending',
    ],
    tags: ['India', 'Pandemic', 'V-Recovery', 'RBI', 'Sector Rotation'],
};
// CASE 4: Crypto Winter & Luna Collapse (2022)
const cryptoWinter: SimulationCase = {
    id: 'crypto-luna-2022',
    title: 'The Luna Death Spiral',
    subtitle: 'Crypto Crash & Terra-Luna Collapse (2022)',
    description: 'A $60 billion crypto ecosystem evaporates in 72 hours. UST de-pegs, Luna goes from $80 to $0.0001. The domino effect takes down Celsius, 3AC, and FTX.',
    year: 2022,
    duration: '5 weeks',
    difficulty: 4,
    difficultyLabel: 'Hard',
    iconName: 'Link2',
    accentColor: '#8B5CF6',
    startingCapital: '$50,000',
    startingCapitalNum: 50000,
    currency: '$',
    context: 'It\'s April 2022. Crypto market cap is $1.8 trillion, down from $3T peak. Terra/Luna is the 3rd largest DeFi ecosystem. Their algorithmic stablecoin UST promises 20% APY through Anchor Protocol — sounds too good to be true because it IS. Bitcoin is at $40,000. Ethereum just had "The Merge" hype. Celsius and BlockFi are offering 8-12% yields on crypto deposits. The question nobody is asking: where does the yield come from?',
    assets: [
        { name: 'Bitcoin (BTC)', type: 'crypto', weeklyReturns: [-5, -15, -20, -8, 2], peakReturn: 0, finalReturn: -42 },
        { name: 'Ethereum (ETH)', type: 'crypto', weeklyReturns: [-6, -18, -25, -10, 3], peakReturn: 0, finalReturn: -50 },
        { name: 'Terra Luna', type: 'crypto', weeklyReturns: [-10, -85, -99, -99.9, 0], peakReturn: 0, finalReturn: -100 },
        { name: 'Solana (SOL)', type: 'crypto', weeklyReturns: [-8, -25, -30, -12, 4], peakReturn: 0, finalReturn: -62 },
        { name: 'S&P 500', type: 'index', weeklyReturns: [-2, -4, -3, 1, 2], peakReturn: 0, finalReturn: -6 },
        { name: 'US Treasury Bonds', type: 'bond', weeklyReturns: [0.3, 0.4, 0.5, 0.3, 0.3], peakReturn: 1.8, finalReturn: 1.8 },
        { name: 'USD Stablecoins (USDC)', type: 'cash', weeklyReturns: [0, 0, 0, 0, 0], peakReturn: 0, finalReturn: 0 },
        { name: 'Gold', type: 'gold', weeklyReturns: [0.5, 1, 1.5, 0.8, 0.5], peakReturn: 4.3, finalReturn: 4.3 },
    ],
    timeline: [
        {
            title: 'Week 1: The Cracks Show',
            subtitle: 'Late April 2022 — Whispers about UST',
            events: [
                { id: 'cr-1-1', text: 'Crypto Twitter debates: Is 20% APY on Anchor Protocol sustainable? Do Kwon mocks critics.', type: 'warning', marketImpact: -1 },
                { id: 'cr-1-2', text: 'Bitcoin drops below $40K on Fed rate hike fears. Risk-off environment builds.', type: 'warning', marketImpact: -2 },
                { id: 'cr-1-3', text: 'Terraform Labs moves $1.5B in Bitcoin reserves to "defend UST peg." Why does a stablecoin need defending?', type: 'warning', marketImpact: -2 },
                { id: 'cr-1-4', text: 'Celsius and BlockFi still advertising 8-12% yields. "Better than any bank!"', type: 'neutral', marketImpact: 0 },
            ],
            decision: {
                prompt: '"Where does the yield come from?" If you can\'t answer this, you ARE the yield. UST offers 20% APY. Banks offer 1%. What\'s your crypto strategy?',
                options: [
                    { id: 'cr-d1-a', label: 'If It\'s Too Good...', description: 'Exit UST/Luna completely. Move to BTC/ETH only or exit crypto.', icon: 'AlertCircle', impact: { crypto: 30, index: 25, bond: 20, gold: 15, cash: 10 }, riskScore: 3 },
                    { id: 'cr-d1-b', label: 'Algorithmic Genius', description: 'UST is math, not trust. Keep earning 20% yield. Diamond hands.', icon: 'Calculator', impact: { crypto: 80, index: 5, bond: 5, gold: 5, cash: 5 }, riskScore: 10 },
                    { id: 'cr-d1-c', label: 'Crypto Cautious', description: 'Small BTC position only. Rest in TradFi (stocks, bonds, gold).', icon: 'Shield', impact: { crypto: 15, index: 30, bond: 25, gold: 20, cash: 10 }, riskScore: 3 },
                ],
            },
        },
        {
            title: 'Week 2: The De-Peg',
            subtitle: 'May 7-9, 2022 — UST loses its $1 peg',
            events: [
                { id: 'cr-2-1', text: 'BREAKING: UST drops to $0.98. Algorithmic arbitrage mechanism struggling to maintain peg.', type: 'breaking', marketImpact: -4 },
                { id: 'cr-2-2', text: 'Large wallet dumps $285M UST on Curve Finance. Suspected coordinated attack.', type: 'breaking', marketImpact: -4 },
                { id: 'cr-2-3', text: 'Luna minting accelerates to defend peg — inflation spiral begins.', type: 'breaking', marketImpact: -5 },
                { id: 'cr-2-4', text: 'Do Kwon tweets "Deploying more capital — steady lads." Market unimpressed.', type: 'warning', marketImpact: -3 },
            ],
            decision: {
                prompt: 'UST de-pegged to $0.98. Do Kwon says he\'ll fix it. Luna is being printed to infinity to restore the peg. You have 24 hours before this gets worse.',
                options: [
                    { id: 'cr-d2-a', label: 'Death Spiral Alert', description: 'Sell ALL crypto. This is a bank run with no FDIC insurance.', icon: 'XCircle', impact: { crypto: 0, index: 25, bond: 30, gold: 25, cash: 20 }, riskScore: 1 },
                    { id: 'cr-d2-b', label: 'Buy Luna Cheap', description: 'Luna dropped 85%. If they fix the peg, this is 10x from here.', icon: 'Target', impact: { crypto: 70, index: 10, bond: 5, gold: 5, cash: 10 }, riskScore: 10 },
                    { id: 'cr-d2-c', label: 'Hedge to BTC Only', description: 'Exit all altcoins. Bitcoin survived every crash. It\'ll survive this.', icon: 'Coins', impact: { crypto: 40, index: 15, bond: 20, gold: 15, cash: 10 }, riskScore: 6 },
                ],
            },
        },
        {
            title: 'Week 3: Total Collapse',
            subtitle: 'May 10-13, 2022 — $60 billion vanishes',
            events: [
                { id: 'cr-3-1', text: 'BREAKING: Luna crashes from $80 to $0.0001. Supply inflated from 350M to 6.5 TRILLION tokens.', type: 'breaking', marketImpact: -5 },
                { id: 'cr-3-2', text: 'UST collapses to $0.10. Entire Terra ecosystem wiped out. $60B gone.', type: 'breaking', marketImpact: -5 },
                { id: 'cr-3-3', text: 'Bitcoin crashes to $26,000. Dragged down by contagion and forced liquidations.', type: 'breaking', marketImpact: -5 },
                { id: 'cr-3-4', text: 'Suicide prevention hotlines pinned on r/terraluna. Lives destroyed.', type: 'breaking', marketImpact: -3 },
            ],
            decision: {
                prompt: 'Luna is dead. $ billions gone. But Bitcoin is at $26K — its lowest in 18 months. Is this contagion spreading or contained?',
                options: [
                    { id: 'cr-d3-a', label: 'Contagion Will Spread', description: 'Luna is patient zero. Celsius, 3AC, FTX will fall next.', icon: 'Bug', impact: { crypto: 0, index: 20, bond: 30, gold: 30, cash: 20 }, riskScore: 1 },
                    { id: 'cr-d3-b', label: 'BTC Bottom Is Near', description: 'Bitcoin fundamentals unchanged. Accumulate at $26K.', icon: 'TrendingUp', impact: { crypto: 50, index: 15, bond: 15, gold: 10, cash: 10 }, riskScore: 7 },
                    { id: 'cr-d3-c', label: 'Wait For Bodies', description: 'Don\'t catch falling knives. Wait to see who else is exposed.', icon: 'Clock', impact: { crypto: 5, index: 20, bond: 25, gold: 25, cash: 25 }, riskScore: 2 },
                ],
            },
        },
        {
            title: 'Week 4: The Domino Effect',
            subtitle: 'Jun-Jul 2022 — Celsius, 3AC, Voyager collapse',
            events: [
                { id: 'cr-4-1', text: 'Celsius Network freezes withdrawals. $12B in customer funds trapped.', type: 'breaking', marketImpact: -4 },
                { id: 'cr-4-2', text: 'Three Arrows Capital (3AC) defaults on $3.5B in loans. Largest crypto hedge fund collapses.', type: 'breaking', marketImpact: -4 },
                { id: 'cr-4-3', text: 'Voyager Digital files bankruptcy. BlockFi on the brink.', type: 'breaking', marketImpact: -3 },
                { id: 'cr-4-4', text: 'Bitcoin drops to $17,600. Ethereum to $880. Crypto winter is here.', type: 'breaking', marketImpact: -5 },
            ],
        },
        {
            title: 'Week 5: The Reckoning',
            subtitle: 'Nov 2022 — FTX, the final domino',
            events: [
                { id: 'cr-5-1', text: 'BREAKING: FTX exchange collapses. Sam Bankman-Fried arrested for fraud.', type: 'breaking', marketImpact: -4 },
                { id: 'cr-5-2', text: 'Bitcoin hits $15,500. Total crypto market cap down to $800B from $3T.', type: 'breaking', marketImpact: -4 },
                { id: 'cr-5-3', text: 'Regulators worldwide announce crypto crackdowns. "We told you so."', type: 'warning', marketImpact: -2 },
                { id: 'cr-5-4', text: 'Those who held through will see BTC recover to $70K+ by 2024.', type: 'positive', marketImpact: 2 },
            ],
        },
    ],
    learningObjectives: [
        '"Where does the yield come from?" — if you can\'t answer, you ARE the yield',
        'Algorithmic stablecoins have a mathematical death spiral vulnerability',
        'Counterparty risk: never keep funds on centralized platforms you don\'t control',
        'Contagion in interconnected systems: one failure triggers a chain reaction',
        'Position sizing: never put more than 5-10% in any single crypto project',
        'Not your keys, not your coins — self-custody is the only guarantee',
    ],
    tags: ['Crypto', 'DeFi', 'Stablecoin', 'Contagion', 'Fraud'],
};
// CASE 5: Adani-Hindenburg Crisis (2023) — India's Biggest Short Attack
const adaniCrisis: SimulationCase = {
    id: 'adani-hindenburg-2023',
    title: 'The Short Seller\'s Attack',
    subtitle: 'Adani-Hindenburg Crisis (2023)',
    description: 'Hindenburg Research publishes a devastating report calling Adani Group "the largest con in corporate history." ₹12 lakh crore wiped out. But was it truth or market manipulation?',
    year: 2023,
    duration: '5 weeks',
    difficulty: 4,
    difficultyLabel: 'Hard',
    iconName: 'AlertTriangle',
    accentColor: '#0EA5E9',
    startingCapital: '₹15,00,000',
    startingCapitalNum: 1500000,
    currency: '₹',
    context: 'It\'s January 24, 2023. Adani Group is India\'s most valuable conglomerate. Gautam Adani is Asia\'s richest person (net worth $120B). Adani Enterprises is about to launch India\'s largest-ever FPO (₹20,000 crore). Then, US short-seller Hindenburg Research drops a 106-page bombshell alleging stock manipulation, accounting fraud, and shell companies across 7 Adani listed entities. The battle lines are drawn: free market accountability vs. foreign attack on India Inc.',
    assets: [
        { name: 'Adani Group Stocks', type: 'stock', weeklyReturns: [-25, -35, -20, -5, 8], peakReturn: 0, finalReturn: -65 },
        { name: 'Nifty 50', type: 'index', weeklyReturns: [-3, -4, -2, 1, 2], peakReturn: 0, finalReturn: -6 },
        { name: 'PSU Banks (SBI, BOB)', type: 'stock', weeklyReturns: [-5, -8, -3, 2, 4], peakReturn: 0, finalReturn: -10 },
        { name: 'Private Banks (HDFC, Kotak)', type: 'stock', weeklyReturns: [-2, -3, 0, 2, 3], peakReturn: 3, finalReturn: 0 },
        { name: 'IT (TCS, Infosys)', type: 'stock', weeklyReturns: [-1, -2, 0, 1, 2], peakReturn: 2, finalReturn: 0 },
        { name: 'Govt Bonds (10Y)', type: 'bond', weeklyReturns: [0.3, 0.4, 0.3, 0.3, 0.3], peakReturn: 1.6, finalReturn: 1.6 },
        { name: 'Gold', type: 'gold', weeklyReturns: [0.5, 1, 0.8, 0.5, 0.3], peakReturn: 3.1, finalReturn: 3.1 },
        { name: 'Liquid Funds/Cash', type: 'cash', weeklyReturns: [0.12, 0.12, 0.12, 0.12, 0.12], peakReturn: 0.6, finalReturn: 0.6 },
    ],
    timeline: [
        {
            title: 'Week 1: The Bombshell',
            subtitle: 'Jan 24, 2023 — Hindenburg publishes the report',
            events: [
                { id: 'ad-1-1', text: 'BREAKING: Hindenburg Research publishes "Adani Group: How The World\'s 3rd Richest Man Is Pulling The Largest Con In Corporate History"', type: 'breaking', marketImpact: -5 },
                { id: 'ad-1-2', text: 'Report alleges stock manipulation via offshore shell companies in Mauritius and Caribbean islands.', type: 'breaking', marketImpact: -4 },
                { id: 'ad-1-3', text: 'Adani stocks crash 20-25% across all 7 listed entities. ₹4 lakh crore wiped in a day.', type: 'breaking', marketImpact: -5 },
                { id: 'ad-1-4', text: 'Adani Group calls report "malicious" and "an attack on India." Nationalistic sentiment rises.', type: 'news', marketImpact: 1 },
            ],
            decision: {
                prompt: 'A US short-seller just accused India\'s biggest conglomerate of fraud. Adani stocks crashed 25%. Is it legitimate whistleblowing or a coordinated short attack to profit from panic?',
                options: [
                    { id: 'ad-d1-a', label: 'Where There\'s Smoke...', description: 'Sell all Adani exposure. Hindenburg has a track record. Reduce broader India risk.', icon: 'Flame', impact: { stock: 15, index: 15, bond: 30, gold: 25, cash: 15 }, riskScore: 2 },
                    { id: 'ad-d1-b', label: 'Adani = India\'s Backbone', description: 'This is a foreign attack. Adani builds ports, airports, power. Buy the dip.', icon: 'Flag', impact: { stock: 65, index: 20, bond: 5, gold: 5, cash: 5 }, riskScore: 9 },
                    { id: 'ad-d1-c', label: 'Avoid Adani, Stay in India', description: 'Adani-specific risk. Rest of India is fine. Rotate to HDFC, TCS, IT.', icon: 'ArrowRightLeft', impact: { stock: 30, index: 30, bond: 15, gold: 15, cash: 10 }, riskScore: 4 },
                ],
            },
        },
        {
            title: 'Week 2: The FPO Debacle',
            subtitle: 'Jan 27 - Feb 1 — Adani cancels ₹20,000 crore FPO',
            events: [
                { id: 'ad-2-1', text: 'Adani Enterprises FPO fully subscribed but Adani cancels it "to protect investors." Markets interpret this as weakness.', type: 'breaking', marketImpact: -4 },
                { id: 'ad-2-2', text: 'Adani stocks crash another 35%. Total Group market cap loss exceeds ₹10 lakh crore.', type: 'breaking', marketImpact: -5 },
                { id: 'ad-2-3', text: 'Credit Suisse, Citibank stop accepting Adani bonds as collateral. Liquidity crisis brewing.', type: 'warning', marketImpact: -4 },
                { id: 'ad-2-4', text: 'LIC and SBI have massive Adani exposure. Systemic risk fears emerge.', type: 'warning', marketImpact: -3 },
            ],
            decision: {
                prompt: 'Adani cancelled the FPO. Banks refusing Adani bonds. LIC has ₹36,000 crore exposure. Is this becoming systemic for India?',
                options: [
                    { id: 'ad-d2-a', label: 'Systemic Risk Is Real', description: 'If Adani defaults, LIC and SBI have problems. Exit Indian equity.', icon: 'AlertOctagon', impact: { stock: 5, index: 5, bond: 25, gold: 35, cash: 30 }, riskScore: 2 },
                    { id: 'ad-d2-b', label: 'Adani ≠ India', description: 'Indian economy is diverse. This is one group\'s problem. Stay invested in non-Adani India.', icon: 'Banknote', impact: { stock: 30, index: 35, bond: 15, gold: 10, cash: 10 }, riskScore: 5 },
                    { id: 'ad-d2-c', label: 'Bottom Fish Adani', description: 'Down 60%+. Infrastructure assets are real. Deep value contrarian play.', icon: 'Anchor', impact: { stock: 60, index: 15, bond: 10, gold: 10, cash: 5 }, riskScore: 9 },
                ],
            },
        },
        {
            title: 'Week 3: The Debate Rages',
            subtitle: 'Feb 2023 — Parliament disrupted, courts involved',
            events: [
                { id: 'ad-3-1', text: 'Opposition demands JPC probe. Parliament sessions disrupted for 2 weeks.', type: 'news', marketImpact: -1 },
                { id: 'ad-3-2', text: 'Supreme Court takes suo motu cognizance. Expert committee to investigate.', type: 'news', marketImpact: 0 },
                { id: 'ad-3-3', text: 'GQG Partners (US investment firm) invests $1.87 billion in Adani stocks. Smart money buying?', type: 'positive', marketImpact: 2 },
                { id: 'ad-3-4', text: 'Adani Group pre-pays $1.1 billion in loans to restore confidence. Deleveraging begins.', type: 'positive', marketImpact: 2 },
            ],
            decision: {
                prompt: 'GQG Partners just invested $1.87 billion in Adani. Either they know something or they\'re catching a falling knife. Adani is deleveraging. Is the worst over?',
                options: [
                    { id: 'ad-d3-a', label: 'Follow GQG', description: 'Institutional smart money is buying. The bottom is in. Add risk.', icon: 'TrendingUp', impact: { stock: 50, index: 25, bond: 10, gold: 10, cash: 5 }, riskScore: 7 },
                    { id: 'ad-d3-b', label: 'Wait For Court Verdict', description: 'SC investigation pending. Don\'t front-run the outcome.', icon: 'Scale', impact: { stock: 20, index: 20, bond: 25, gold: 20, cash: 15 }, riskScore: 3 },
                    { id: 'ad-d3-c', label: 'Non-Adani India Rally', description: 'Broader market will disconnect from Adani. Own banks, IT, pharma.', icon: 'Layers', impact: { stock: 25, index: 35, bond: 15, gold: 15, cash: 10 }, riskScore: 4 },
                ],
            },
        },
        {
            title: 'Week 4: Stability Returns',
            subtitle: 'Mar 2023 — Markets stabilize',
            events: [
                { id: 'ad-4-1', text: 'Adani stocks stabilize. Some recovering 5-10% from lows. Panic subsiding.', type: 'positive', marketImpact: 2 },
                { id: 'ad-4-2', text: 'Nifty reclaims 17,500. Broader market decouples from Adani saga.', type: 'positive', marketImpact: 2 },
                { id: 'ad-4-3', text: 'SEBI investigating but no fraud charges filed yet. Benefit of doubt emerging.', type: 'neutral', marketImpact: 1 },
            ],
        },
        {
            title: 'Week 5: The Aftermath',
            subtitle: 'Apr-May 2023 — The scorecard',
            events: [
                { id: 'ad-5-1', text: 'Adani stocks still down 50-65% from pre-Hindenburg levels. Recovery will take years.', type: 'news', marketImpact: -1 },
                { id: 'ad-5-2', text: 'Nifty fully recovers and hits new highs by mid-2023. India story intact.', type: 'positive', marketImpact: 3 },
                { id: 'ad-5-3', text: 'Those who rotated from Adani to broader India made 15-20% in 4 months.', type: 'positive', marketImpact: 2 },
                { id: 'ad-5-4', text: 'GQG\'s Adani bet is up 40% by year end. Contrarian conviction rewarded.', type: 'positive', marketImpact: 2 },
            ],
        },
    ],
    learningObjectives: [
        'Concentration risk: Never let one group/company dominate your portfolio',
        'Short-seller reports contain valuable research — evaluate on merit, not nationality',
        'Systemic vs idiosyncratic risk: One company\'s crisis doesn\'t mean country crisis',
        'Sector rotation during company-specific crises preserves capital',
        'Institutional buying (like GQG) is a stronger signal than retail sentiment',
        'Emotional investing ("attack on India") leads to poor financial decisions',
    ],
    tags: ['India', 'Short Selling', 'Corporate Governance', 'Conglomerate'],
};

// ────────────────────────────────────────────────────────────
// EXPORT ALL CASES
// ────────────────────────────────────────────────────────────
export const SIMULATION_CASES: SimulationCase[] = [
    harshadMehta,
    gfc2008,
    covidCrash,
    cryptoWinter,
    adaniCrisis,
];

export const getCaseById = (id: string): SimulationCase | undefined =>
    SIMULATION_CASES.find((c) => c.id === id);
