// ═══════════════════════════════════════════════════════════════════════════════
// Trade Engine — All local state for Paper Trading
// ═══════════════════════════════════════════════════════════════════════════════

import AsyncStorage from '@react-native-async-storage/async-storage';
import { MOCK_STOCKS, StockData } from './mockStocks';

const PORTFOLIO_KEY = 'paper_portfolio';
const CASH_KEY = 'paper_cash';
const TRADES_KEY = 'paper_trades';

export const INITIAL_CASH = 100000;

export interface Holding {
    symbol: string;
    qty: number;
    avgPrice: number;
}

export interface Trade {
    id: string;
    symbol: string;
    type: 'BUY' | 'SELL';
    qty: number;
    price: number;
    total: number;
    timestamp: number;
}

export interface PortfolioState {
    cash: number;
    holdings: Holding[];
    trades: Trade[];
}

// ─── Load ──────────────────────────────────────────────────────────────────────

export async function loadPortfolio(): Promise<PortfolioState> {
    try {
        const [cashStr, holdingsStr, tradesStr] = await Promise.all([
            AsyncStorage.getItem(CASH_KEY),
            AsyncStorage.getItem(PORTFOLIO_KEY),
            AsyncStorage.getItem(TRADES_KEY),
        ]);
        return {
            cash: cashStr ? parseFloat(cashStr) : INITIAL_CASH,
            holdings: holdingsStr ? JSON.parse(holdingsStr) : [],
            trades: tradesStr ? JSON.parse(tradesStr) : [],
        };
    } catch {
        return { cash: INITIAL_CASH, holdings: [], trades: [] };
    }
}

// ─── Save ──────────────────────────────────────────────────────────────────────

async function savePortfolio(state: PortfolioState) {
    await Promise.all([
        AsyncStorage.setItem(CASH_KEY, String(state.cash)),
        AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(state.holdings)),
        AsyncStorage.setItem(TRADES_KEY, JSON.stringify(state.trades)),
    ]);
}

// ─── Buy ───────────────────────────────────────────────────────────────────────

export async function buyStock(
    symbol: string,
    qty: number,
    price: number
): Promise<{ success: boolean; message: string; state: PortfolioState }> {
    const state = await loadPortfolio();
    const totalCost = +(qty * price).toFixed(2);

    if (totalCost > state.cash) {
        return { success: false, message: 'Insufficient funds.', state };
    }
    if (qty <= 0) {
        return { success: false, message: 'Invalid quantity.', state };
    }

    // Update cash
    state.cash = +(state.cash - totalCost).toFixed(2);

    // Update holdings
    const existing = state.holdings.find(h => h.symbol === symbol);
    if (existing) {
        const newTotal = existing.qty * existing.avgPrice + totalCost;
        existing.qty += qty;
        existing.avgPrice = +(newTotal / existing.qty).toFixed(2);
    } else {
        state.holdings.push({ symbol, qty, avgPrice: price });
    }

    // Record trade
    state.trades.unshift({
        id: `t-${Date.now()}`,
        symbol, type: 'BUY', qty, price, total: totalCost, timestamp: Date.now(),
    });

    await savePortfolio(state);
    return { success: true, message: `Bought ${qty} shares of ${symbol}`, state };
}

// ─── Sell ──────────────────────────────────────────────────────────────────────

export async function sellStock(
    symbol: string,
    qty: number,
    price: number
): Promise<{ success: boolean; message: string; state: PortfolioState }> {
    const state = await loadPortfolio();
    const existing = state.holdings.find(h => h.symbol === symbol);

    if (!existing || existing.qty < qty) {
        return { success: false, message: 'Not enough shares to sell.', state };
    }
    if (qty <= 0) {
        return { success: false, message: 'Invalid quantity.', state };
    }

    const totalValue = +(qty * price).toFixed(2);
    state.cash = +(state.cash + totalValue).toFixed(2);

    existing.qty -= qty;
    if (existing.qty === 0) {
        state.holdings = state.holdings.filter(h => h.symbol !== symbol);
    }

    state.trades.unshift({
        id: `t-${Date.now()}`,
        symbol, type: 'SELL', qty, price, total: totalValue, timestamp: Date.now(),
    });

    await savePortfolio(state);
    return { success: true, message: `Sold ${qty} shares of ${symbol}`, state };
}

// ─── Portfolio Value ───────────────────────────────────────────────────────────

export function calculatePortfolioValue(
    holdings: Holding[],
    currentPrices: Record<string, number>
): { totalValue: number; totalInvested: number; totalPL: number } {
    let totalValue = 0;
    let totalInvested = 0;
    for (const h of holdings) {
        const cp = currentPrices[h.symbol] || h.avgPrice;
        totalValue += h.qty * cp;
        totalInvested += h.qty * h.avgPrice;
    }
    return {
        totalValue: +totalValue.toFixed(2),
        totalInvested: +totalInvested.toFixed(2),
        totalPL: +(totalValue - totalInvested).toFixed(2),
    };
}

// ─── Reset ─────────────────────────────────────────────────────────────────────

export async function resetPortfolio(): Promise<PortfolioState> {
    const state: PortfolioState = { cash: INITIAL_CASH, holdings: [], trades: [] };
    await savePortfolio(state);
    return state;
}

// ─── Price Simulation ──────────────────────────────────────────────────────────

export function simulatePrice(stock: StockData): number {
    const change = (Math.random() - 0.48) * stock.volatility * 0.01 * stock.price;
    return +(stock.price + change).toFixed(2);
}
