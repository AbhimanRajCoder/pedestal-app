// ═══════════════════════════════════════════════════════════════════════════════
// Mock Stock Data — Hardcoded Indian Stocks
// ═══════════════════════════════════════════════════════════════════════════════

export interface StockData {
    symbol: string;
    name: string;
    sector: string;
    color: string;
    price: number;
    prevClose: number;
    dayHigh: number;
    dayLow: number;
    volume: number;
    history1D: number[];
    history1W: number[];
    history1M: number[];
    history6M: number[];
    volatility: number; // 0–1 range for simulation
}

const gen = (base: number, count: number, vol: number): number[] => {
    const arr: number[] = [base];
    for (let i = 1; i < count; i++) {
        const delta = (Math.random() - 0.48) * vol * base;
        arr.push(+(arr[i - 1] + delta).toFixed(2));
    }
    return arr;
};

export const MOCK_STOCKS: StockData[] = [
    {
        symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Oil & Gas', color: '#0057B8',
        price: 2640, prevClose: 2618, dayHigh: 2665, dayLow: 2610, volume: 8542310,
        history1D: gen(2618, 24, 0.004), history1W: gen(2580, 7, 0.008),
        history1M: gen(2500, 30, 0.012), history6M: gen(2350, 180, 0.008), volatility: 0.45,
    },
    {
        symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', color: '#1D4ED8',
        price: 3850, prevClose: 3820, dayHigh: 3880, dayLow: 3800, volume: 3214500,
        history1D: gen(3820, 24, 0.003), history1W: gen(3780, 7, 0.006),
        history1M: gen(3700, 30, 0.01), history6M: gen(3500, 180, 0.007), volatility: 0.35,
    },
    {
        symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', color: '#004C8F',
        price: 1680, prevClose: 1665, dayHigh: 1695, dayLow: 1658, volume: 12456700,
        history1D: gen(1665, 24, 0.004), history1W: gen(1640, 7, 0.007),
        history1M: gen(1600, 30, 0.011), history6M: gen(1480, 180, 0.008), volatility: 0.40,
    },
    {
        symbol: 'INFY', name: 'Infosys', sector: 'IT', color: '#007CC3',
        price: 1520, prevClose: 1508, dayHigh: 1540, dayLow: 1498, volume: 6754200,
        history1D: gen(1508, 24, 0.004), history1W: gen(1480, 7, 0.008),
        history1M: gen(1420, 30, 0.012), history6M: gen(1320, 180, 0.009), volatility: 0.42,
    },
    {
        symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG', color: '#1B3D6F',
        price: 440, prevClose: 436, dayHigh: 445, dayLow: 433, volume: 18945300,
        history1D: gen(436, 24, 0.005), history1W: gen(428, 7, 0.008),
        history1M: gen(410, 30, 0.013), history6M: gen(380, 180, 0.01), volatility: 0.50,
    },
    {
        symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', color: '#F37021',
        price: 1120, prevClose: 1108, dayHigh: 1135, dayLow: 1100, volume: 9876500,
        history1D: gen(1108, 24, 0.004), history1W: gen(1090, 7, 0.007),
        history1M: gen(1050, 30, 0.011), history6M: gen(960, 180, 0.008), volatility: 0.40,
    },
    {
        symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', color: '#ED1C24',
        price: 1340, prevClose: 1325, dayHigh: 1355, dayLow: 1318, volume: 5432100,
        history1D: gen(1325, 24, 0.004), history1W: gen(1300, 7, 0.008),
        history1M: gen(1250, 30, 0.012), history6M: gen(1100, 180, 0.009), volatility: 0.44,
    },
    {
        symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', color: '#003B6F',
        price: 3420, prevClose: 3395, dayHigh: 3450, dayLow: 3380, volume: 2876400,
        history1D: gen(3395, 24, 0.003), history1W: gen(3350, 7, 0.006),
        history1M: gen(3250, 30, 0.01), history6M: gen(3000, 180, 0.008), volatility: 0.38,
    },
    {
        symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', color: '#2B3990',
        price: 780, prevClose: 772, dayHigh: 790, dayLow: 768, volume: 15678900,
        history1D: gen(772, 24, 0.005), history1W: gen(755, 7, 0.009),
        history1M: gen(730, 30, 0.013), history6M: gen(650, 180, 0.01), volatility: 0.48,
    },
    {
        symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Consumer', color: '#E31836',
        price: 2850, prevClose: 2828, dayHigh: 2875, dayLow: 2815, volume: 1876500,
        history1D: gen(2828, 24, 0.003), history1W: gen(2800, 7, 0.006),
        history1M: gen(2720, 30, 0.01), history6M: gen(2550, 180, 0.007), volatility: 0.35,
    },
    {
        symbol: 'WIPRO', name: 'Wipro', sector: 'IT', color: '#44135A',
        price: 485, prevClose: 480, dayHigh: 492, dayLow: 476, volume: 7654300,
        history1D: gen(480, 24, 0.005), history1W: gen(470, 7, 0.009),
        history1M: gen(450, 30, 0.013), history6M: gen(400, 180, 0.01), volatility: 0.50,
    },
    {
        symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Auto', color: '#004987',
        price: 920, prevClose: 908, dayHigh: 935, dayLow: 902, volume: 11234500,
        history1D: gen(908, 24, 0.005), history1W: gen(890, 7, 0.009),
        history1M: gen(850, 30, 0.014), history6M: gen(750, 180, 0.011), volatility: 0.55,
    },
    {
        symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Auto', color: '#003E7E',
        price: 11200, prevClose: 11100, dayHigh: 11350, dayLow: 11050, volume: 1234500,
        history1D: gen(11100, 24, 0.003), history1W: gen(10900, 7, 0.006),
        history1M: gen(10600, 30, 0.01), history6M: gen(9800, 180, 0.008), volatility: 0.38,
    },
    {
        symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Pharma', color: '#F58220',
        price: 1180, prevClose: 1170, dayHigh: 1195, dayLow: 1162, volume: 4567800,
        history1D: gen(1170, 24, 0.004), history1W: gen(1150, 7, 0.007),
        history1M: gen(1100, 30, 0.011), history6M: gen(1000, 180, 0.009), volatility: 0.42,
    },
    {
        symbol: 'ADANIPORTS', name: 'Adani Ports', sector: 'Infrastructure', color: '#002B5C',
        price: 1240, prevClose: 1225, dayHigh: 1260, dayLow: 1218, volume: 6789000,
        history1D: gen(1225, 24, 0.005), history1W: gen(1200, 7, 0.009),
        history1M: gen(1150, 30, 0.014), history6M: gen(980, 180, 0.012), volatility: 0.58,
    },
];

// Learning tips shown after trades
export const TRADE_TIPS: string[] = [
    'Diversification reduces risk. Avoid putting all money in one stock.',
    'Long-term investors ignore short-term volatility.',
    'Buy businesses, not stock tickers.',
    'Compounding needs time — patience is the real strategy.',
    'Never invest money you cannot afford to lose.',
    'Paper trading is the safest way to learn market dynamics.',
    'A 10% dip is a normal event. Panicking is not.',
    'Dollar-cost averaging beats timing the market.',
    'Volume confirms price movements. Low volume = weak signal.',
    'High P/E does not always mean overvalued.',
    'Check fundamentals before checking technicals.',
    'A stop-loss protects you from catastrophic losses.',
];
