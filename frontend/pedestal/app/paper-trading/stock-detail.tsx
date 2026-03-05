import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions, TextInput, Modal, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography } from '@/constants/theme';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Plus, X, Check, BarChart3, Activity } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { playSound } from '@/utils/sounds';
import { MOCK_STOCKS, TRADE_TIPS, StockData } from '@/data/mockStocks';
import { loadPortfolio, buyStock, sellStock, simulatePrice, Holding, PortfolioState } from '@/data/tradeEngine';

const { width: SW } = Dimensions.get('window');
type TimeFilter = '1D' | '1W' | '1M' | '6M';

export default function StockDetailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { symbol } = useLocalSearchParams<{ symbol: string }>();

    const stock = MOCK_STOCKS.find(s => s.symbol === symbol) || MOCK_STOCKS[0];

    const [currentPrice, setCurrentPrice] = useState(stock.price);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('1D');
    const [portfolio, setPortfolio] = useState<PortfolioState | null>(null);

    // Trade panel
    const [tradeMode, setTradeMode] = useState<'BUY' | 'SELL' | null>(null);
    const [qty, setQty] = useState(1);
    const [tradeResult, setTradeResult] = useState<{ success: boolean; message: string; tip?: string } | null>(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const chartFade = useRef(new Animated.Value(1)).current;
    const panelAnim = useRef(new Animated.Value(0)).current;
    const resultAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, []);

    useFocusEffect(useCallback(() => { loadPortfolio().then(setPortfolio); }, []));

    // Simulate price
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPrice(prev => simulatePrice({ ...stock, price: prev }));
        }, 3000);
        return () => clearInterval(interval);
    }, [stock]);

    const getChartData = (): number[] => {
        switch (timeFilter) {
            case '1D': return stock.history1D;
            case '1W': return stock.history1W;
            case '1M': return stock.history1M;
            case '6M': return stock.history6M;
        }
    };

    const chartData = getChartData();
    const chartMin = Math.min(...chartData);
    const chartMax = Math.max(...chartData);
    const chartRange = chartMax - chartMin || 1;
    const chartUp = chartData[chartData.length - 1] >= chartData[0];

    const change = currentPrice - stock.prevClose;
    const changePct = ((change / stock.prevClose) * 100).toFixed(2);
    const isUp = change >= 0;

    const holding = portfolio?.holdings.find(h => h.symbol === stock.symbol);

    // ─── Chart Rendering ───
    const CHART_H = 200;
    const CHART_W = SW - 60;

    const renderChart = () => {
        const step = CHART_W / (chartData.length - 1);
        const color = chartUp ? '#22C55E' : '#EF4444';

        return (
            <Animated.View style={[styles.chartArea, { opacity: chartFade }]}>
                <View style={{ width: CHART_W, height: CHART_H, position: 'relative' }}>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map(pct => (
                        <View key={pct} style={{
                            position: 'absolute', left: 0, right: 0,
                            top: CHART_H * pct, height: 1,
                            backgroundColor: Colors.inputBorder, opacity: 0.5,
                        }} />
                    ))}
                    {/* Line segments */}
                    {chartData.map((v, i) => {
                        if (i === 0) return null;
                        const x1 = (i - 1) * step;
                        const y1 = CHART_H - ((chartData[i - 1] - chartMin) / chartRange) * CHART_H;
                        const x2 = i * step;
                        const y2 = CHART_H - ((v - chartMin) / chartRange) * CHART_H;
                        const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
                        return (
                            <View key={i} style={{
                                position: 'absolute', left: x1, top: y1,
                                width: len, height: 3, borderRadius: 1.5,
                                backgroundColor: color,
                                transform: [{ rotate: `${angle}deg` }],
                                transformOrigin: 'left center',
                            }} />
                        );
                    })}
                    {/* Current price dot */}
                    <View style={{
                        position: 'absolute',
                        left: CHART_W - 6,
                        top: CHART_H - ((chartData[chartData.length - 1] - chartMin) / chartRange) * CHART_H - 6,
                        width: 12, height: 12, borderRadius: 6,
                        backgroundColor: color, borderWidth: 3, borderColor: Colors.white,
                    }} />
                </View>
            </Animated.View>
        );
    };

    const switchTimeFilter = (tf: TimeFilter) => {
        Animated.timing(chartFade, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
            setTimeFilter(tf);
            Animated.timing(chartFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
        });
    };

    // ─── Trade Functions ───
    const openTradePanel = (mode: 'BUY' | 'SELL') => {
        setTradeMode(mode);
        setQty(1);
        setTradeResult(null);
        Animated.spring(panelAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start();
    };

    const closeTradePanel = () => {
        Animated.timing(panelAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
            setTradeMode(null);
        });
    };

    const executeTrade = async () => {
        if (!tradeMode) return;
        try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch { }

        const result = tradeMode === 'BUY'
            ? await buyStock(stock.symbol, qty, currentPrice)
            : await sellStock(stock.symbol, qty, currentPrice);

        if (result.success) {
            playSound('correct');
            setPortfolio(result.state);
            const tip = TRADE_TIPS[Math.floor(Math.random() * TRADE_TIPS.length)];
            setTradeResult({ success: true, message: result.message, tip });
            Animated.spring(resultAnim, { toValue: 1, friction: 6, useNativeDriver: true }).start();
        } else {
            playSound('wrong');
            setTradeResult({ success: false, message: result.message });
        }
    };

    const cost = +(qty * currentPrice).toFixed(2);
    const maxBuyQty = Math.floor((portfolio?.cash || 0) / currentPrice);
    const maxSellQty = holding?.qty || 0;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={Colors.secondary} strokeWidth={2.5} />
                </Pressable>
                <View style={{ flex: 1, marginLeft: 14 }}>
                    <Text style={styles.headerSymbol}>{stock.symbol}</Text>
                    <Text style={styles.headerName} numberOfLines={1}>{stock.name}</Text>
                </View>
                <View style={[styles.sectorBadge, { backgroundColor: stock.color + '20' }]}>
                    <Text style={[styles.sectorText, { color: stock.color }]}>{stock.sector}</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Price Section */}
                <Animated.View style={[styles.priceSection, { opacity: fadeAnim }]}>
                    <Text style={styles.bigPrice}>{'\u20B9'}{currentPrice.toLocaleString('en-IN')}</Text>
                    <View style={[styles.changeBadge, { backgroundColor: isUp ? '#DCFCE7' : '#FEE2E2' }]}>
                        {isUp ? <TrendingUp size={14} color="#22C55E" strokeWidth={3} /> : <TrendingDown size={14} color="#EF4444" strokeWidth={3} />}
                        <Text style={[styles.changeText, { color: isUp ? '#22C55E' : '#EF4444' }]}>
                            {isUp ? '+' : ''}{'\u20B9'}{change.toFixed(2)} ({changePct}%)
                        </Text>
                    </View>
                </Animated.View>

                {/* Chart */}
                <View style={styles.chartContainer}>
                    {renderChart()}
                    {/* Time filters */}
                    <View style={styles.timeFilters}>
                        {(['1D', '1W', '1M', '6M'] as TimeFilter[]).map(tf => (
                            <Pressable
                                key={tf}
                                style={[styles.timeBtn, timeFilter === tf && styles.timeBtnActive]}
                                onPress={() => switchTimeFilter(tf)}
                            >
                                <Text style={[styles.timeBtnText, timeFilter === tf && styles.timeBtnTextActive]}>{tf}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Day High</Text>
                        <Text style={styles.statVal}>{'\u20B9'}{stock.dayHigh.toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Day Low</Text>
                        <Text style={styles.statVal}>{'\u20B9'}{stock.dayLow.toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Prev Close</Text>
                        <Text style={styles.statVal}>{'\u20B9'}{stock.prevClose.toLocaleString('en-IN')}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Volume</Text>
                        <Text style={styles.statVal}>{(stock.volume / 1000000).toFixed(1)}M</Text>
                    </View>
                </View>

                {/* Current Holding */}
                {holding && (
                    <View style={styles.holdingBanner}>
                        <Text style={styles.holdingTitle}>Your Position</Text>
                        <View style={styles.holdingRow}>
                            <View>
                                <Text style={styles.holdingLabel}>Qty</Text>
                                <Text style={styles.holdingVal}>{holding.qty}</Text>
                            </View>
                            <View>
                                <Text style={styles.holdingLabel}>Avg Price</Text>
                                <Text style={styles.holdingVal}>{'\u20B9'}{holding.avgPrice.toLocaleString('en-IN')}</Text>
                            </View>
                            <View>
                                <Text style={styles.holdingLabel}>P&L</Text>
                                <Text style={[styles.holdingVal, {
                                    color: (currentPrice - holding.avgPrice) >= 0 ? '#22C55E' : '#EF4444'
                                }]}>
                                    {(currentPrice - holding.avgPrice) >= 0 ? '+' : ''}
                                    {'\u20B9'}{((currentPrice - holding.avgPrice) * holding.qty).toFixed(0)}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Buy / Sell Buttons */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
                <Pressable
                    style={({ pressed }) => [styles.tradeBtn, styles.buyBtn, pressed && styles.tradeBtnPressed]}
                    onPress={() => openTradePanel('BUY')}
                >
                    <Text style={styles.buyBtnText}>BUY</Text>
                </Pressable>
                <Pressable
                    style={({ pressed }) => [styles.tradeBtn, styles.sellBtn, pressed && styles.tradeBtnPressed]}
                    onPress={() => openTradePanel('SELL')}
                >
                    <Text style={styles.sellBtnText}>SELL</Text>
                </Pressable>
            </View>

            {/* Trade Panel Modal */}
            <Modal visible={tradeMode !== null} transparent animationType="none">
                <Pressable style={styles.overlay} onPress={closeTradePanel} />
                <Animated.View style={[
                    styles.panel,
                    { paddingBottom: insets.bottom + 20 },
                    { transform: [{ translateY: panelAnim.interpolate({ inputRange: [0, 1], outputRange: [400, 0] }) }] },
                ]}>
                    {tradeResult ? (
                        <Animated.View style={[styles.resultContent, { transform: [{ scale: resultAnim }] }]}>
                            <View style={[styles.resultIcon, { backgroundColor: tradeResult.success ? '#DCFCE7' : '#FEE2E2' }]}>
                                {tradeResult.success ? <Check size={32} color="#22C55E" strokeWidth={3} /> : <X size={32} color="#EF4444" strokeWidth={3} />}
                            </View>
                            <Text style={styles.resultTitle}>{tradeResult.success ? 'Trade Successful' : 'Trade Failed'}</Text>
                            <Text style={styles.resultMsg}>{tradeResult.message}</Text>
                            {tradeResult.tip && (
                                <View style={styles.tipCard}>
                                    <Text style={styles.tipLabel}>PRO TIP</Text>
                                    <Text style={styles.tipText}>{tradeResult.tip}</Text>
                                </View>
                            )}
                            <Pressable style={styles.doneBtn} onPress={closeTradePanel}>
                                <Text style={styles.doneBtnText}>Done</Text>
                            </Pressable>
                        </Animated.View>
                    ) : (
                        <View>
                            <View style={styles.panelHeader}>
                                <Text style={styles.panelTitle}>{tradeMode} {stock.symbol}</Text>
                                <Pressable onPress={closeTradePanel}>
                                    <X size={22} color={Colors.secondary} strokeWidth={2.5} />
                                </Pressable>
                            </View>
                            <Text style={styles.panelPrice}>Current: {'\u20B9'}{currentPrice.toLocaleString('en-IN')}</Text>

                            {/* Qty Selector */}
                            <View style={styles.qtyRow}>
                                <Pressable style={styles.qtyBtn} onPress={() => qty > 1 && setQty(qty - 1)}>
                                    <Minus size={20} color={Colors.secondary} strokeWidth={3} />
                                </Pressable>
                                <View style={styles.qtyDisplay}>
                                    <Text style={styles.qtyText}>{qty}</Text>
                                    <Text style={styles.qtyLabel}>shares</Text>
                                </View>
                                <Pressable
                                    style={styles.qtyBtn}
                                    onPress={() => {
                                        const max = tradeMode === 'BUY' ? maxBuyQty : maxSellQty;
                                        if (qty < max) setQty(qty + 1);
                                    }}
                                >
                                    <Plus size={20} color={Colors.secondary} strokeWidth={3} />
                                </Pressable>
                            </View>

                            {/* Quick qty buttons */}
                            <View style={styles.quickQty}>
                                {[1, 5, 10].map(n => {
                                    const max = tradeMode === 'BUY' ? maxBuyQty : maxSellQty;
                                    if (n > max) return null;
                                    return (
                                        <Pressable key={n} style={styles.quickQtyBtn} onPress={() => setQty(n)}>
                                            <Text style={styles.quickQtyText}>{n}</Text>
                                        </Pressable>
                                    );
                                })}
                                {tradeMode === 'SELL' && maxSellQty > 0 && (
                                    <Pressable style={styles.quickQtyBtn} onPress={() => setQty(maxSellQty)}>
                                        <Text style={styles.quickQtyText}>ALL</Text>
                                    </Pressable>
                                )}
                            </View>

                            <View style={styles.panelInfo}>
                                <View style={styles.panelInfoRow}>
                                    <Text style={styles.panelInfoLabel}>Estimated {tradeMode === 'BUY' ? 'Cost' : 'Value'}</Text>
                                    <Text style={styles.panelInfoVal}>{'\u20B9'}{cost.toLocaleString('en-IN')}</Text>
                                </View>
                                <View style={styles.panelInfoRow}>
                                    <Text style={styles.panelInfoLabel}>Available Cash</Text>
                                    <Text style={styles.panelInfoVal}>{'\u20B9'}{(portfolio?.cash || 0).toLocaleString('en-IN')}</Text>
                                </View>
                                {tradeMode === 'SELL' && (
                                    <View style={styles.panelInfoRow}>
                                        <Text style={styles.panelInfoLabel}>Shares Owned</Text>
                                        <Text style={styles.panelInfoVal}>{maxSellQty}</Text>
                                    </View>
                                )}
                            </View>

                            <Pressable
                                style={({ pressed }) => [
                                    styles.executeBtn,
                                    tradeMode === 'BUY' ? styles.executeBuy : styles.executeSell,
                                    pressed && styles.executeBtnPressed,
                                ]}
                                onPress={executeTrade}
                            >
                                <Text style={styles.executeBtnText}>
                                    {tradeMode === 'BUY' ? 'CONFIRM BUY' : 'CONFIRM SELL'}
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </Animated.View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14,
        borderBottomWidth: 3, borderBottomColor: Colors.secondary, backgroundColor: Colors.white,
    },
    backBtn: {
        width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white,
        borderWidth: 2, borderColor: Colors.secondary, alignItems: 'center', justifyContent: 'center',
    },
    headerSymbol: { fontFamily: Typography.fontFamily.black, fontSize: 20, color: Colors.secondary, letterSpacing: -0.5 },
    headerName: { fontFamily: Typography.fontFamily.bold, fontSize: 13, color: Colors.textMuted },
    sectorBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    sectorText: { fontFamily: Typography.fontFamily.black, fontSize: 11, letterSpacing: 0.5 },
    scroll: { paddingHorizontal: 20, paddingTop: 20 },
    // Price
    priceSection: { marginBottom: 20 },
    bigPrice: { fontFamily: Typography.fontFamily.black, fontSize: 40, color: Colors.secondary, letterSpacing: -1 },
    changeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginTop: 8 },
    changeText: { fontFamily: Typography.fontFamily.black, fontSize: 14 },
    // Chart
    chartContainer: {
        backgroundColor: Colors.white, borderRadius: 24, padding: 20,
        borderWidth: 3, borderColor: Colors.secondary,
        shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 0,
        marginBottom: 20,
    },
    chartArea: { alignItems: 'center', paddingVertical: 10 },
    timeFilters: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16 },
    timeBtn: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 12, backgroundColor: Colors.background },
    timeBtnActive: { backgroundColor: Colors.secondary },
    timeBtnText: { fontFamily: Typography.fontFamily.black, fontSize: 13, color: Colors.textMuted },
    timeBtnTextActive: { color: Colors.neonGreen },
    // Stats
    statsRow: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20,
    },
    stat: {
        flex: 1, minWidth: 70, backgroundColor: Colors.white, borderRadius: 16, padding: 14,
        borderWidth: 2, borderColor: Colors.inputBorder, alignItems: 'center',
    },
    statLabel: { fontFamily: Typography.fontFamily.bold, fontSize: 11, color: Colors.textMuted, marginBottom: 4 },
    statVal: { fontFamily: Typography.fontFamily.black, fontSize: 14, color: Colors.secondary },
    // Holding
    holdingBanner: {
        backgroundColor: Colors.pastelPurple, borderRadius: 20, padding: 18,
        borderWidth: 3, borderColor: Colors.secondary, marginBottom: 20,
    },
    holdingTitle: { fontFamily: Typography.fontFamily.black, fontSize: 14, color: Colors.secondary, marginBottom: 12 },
    holdingRow: { flexDirection: 'row', justifyContent: 'space-between' },
    holdingLabel: { fontFamily: Typography.fontFamily.bold, fontSize: 11, color: Colors.textSecondary },
    holdingVal: { fontFamily: Typography.fontFamily.black, fontSize: 16, color: Colors.secondary, marginTop: 2 },
    // Bottom bar
    bottomBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12,
        backgroundColor: Colors.white, paddingHorizontal: 20, paddingTop: 14,
        borderTopWidth: 3, borderTopColor: Colors.secondary,
    },
    tradeBtn: {
        flex: 1, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
        borderWidth: 3, borderColor: Colors.secondary,
        shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    },
    tradeBtnPressed: { shadowOffset: { width: 0, height: 0 }, marginTop: 4, marginBottom: -4 },
    buyBtn: { backgroundColor: '#22C55E' },
    sellBtn: { backgroundColor: '#EF4444' },
    buyBtnText: { fontFamily: Typography.fontFamily.black, fontSize: 18, color: '#FFF', letterSpacing: 1 },
    sellBtnText: { fontFamily: Typography.fontFamily.black, fontSize: 18, color: '#FFF', letterSpacing: 1 },
    // Modal
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    panel: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: 24, borderTopWidth: 4, borderColor: Colors.secondary,
    },
    panelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    panelTitle: { fontFamily: Typography.fontFamily.black, fontSize: 22, color: Colors.secondary, letterSpacing: -0.5 },
    panelPrice: { fontFamily: Typography.fontFamily.bold, fontSize: 15, color: Colors.textMuted, marginBottom: 20 },
    qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 16 },
    qtyBtn: {
        width: 48, height: 48, borderRadius: 14, backgroundColor: Colors.background,
        borderWidth: 3, borderColor: Colors.secondary, alignItems: 'center', justifyContent: 'center',
    },
    qtyDisplay: { alignItems: 'center' },
    qtyText: { fontFamily: Typography.fontFamily.black, fontSize: 36, color: Colors.secondary },
    qtyLabel: { fontFamily: Typography.fontFamily.bold, fontSize: 13, color: Colors.textMuted },
    quickQty: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
    quickQtyBtn: {
        paddingHorizontal: 18, paddingVertical: 8, borderRadius: 12,
        backgroundColor: Colors.background, borderWidth: 2, borderColor: Colors.inputBorder,
    },
    quickQtyText: { fontFamily: Typography.fontFamily.black, fontSize: 13, color: Colors.secondary },
    panelInfo: { gap: 10, marginBottom: 20 },
    panelInfoRow: { flexDirection: 'row', justifyContent: 'space-between' },
    panelInfoLabel: { fontFamily: Typography.fontFamily.bold, fontSize: 14, color: Colors.textMuted },
    panelInfoVal: { fontFamily: Typography.fontFamily.black, fontSize: 14, color: Colors.secondary },
    executeBtn: {
        height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
        borderWidth: 3, borderColor: Colors.secondary,
        shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0,
    },
    executeBtnPressed: { shadowOffset: { width: 0, height: 0 }, marginTop: 4, marginBottom: -4 },
    executeBuy: { backgroundColor: '#22C55E' },
    executeSell: { backgroundColor: '#EF4444' },
    executeBtnText: { fontFamily: Typography.fontFamily.black, fontSize: 17, color: '#FFF', letterSpacing: 1 },
    // Result
    resultContent: { alignItems: 'center', paddingVertical: 20 },
    resultIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    resultTitle: { fontFamily: Typography.fontFamily.black, fontSize: 24, color: Colors.secondary, marginBottom: 8 },
    resultMsg: { fontFamily: Typography.fontFamily.bold, fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 20 },
    tipCard: {
        backgroundColor: Colors.pastelYellow, borderRadius: 16, padding: 16,
        borderWidth: 2, borderColor: Colors.secondary, width: '100%', marginBottom: 20,
    },
    tipLabel: { fontFamily: Typography.fontFamily.black, fontSize: 11, color: Colors.secondary, letterSpacing: 1, marginBottom: 6 },
    tipText: { fontFamily: Typography.fontFamily.bold, fontSize: 14, color: Colors.secondary, lineHeight: 20 },
    doneBtn: {
        backgroundColor: Colors.secondary, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', width: '100%',
    },
    doneBtnText: { fontFamily: Typography.fontFamily.black, fontSize: 17, color: Colors.white, letterSpacing: 0.5 },
});
