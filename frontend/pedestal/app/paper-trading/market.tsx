import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, TextInput, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography } from '@/constants/theme';
import { ArrowLeft, Search, TrendingUp, TrendingDown } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { MOCK_STOCKS, StockData } from '@/data/mockStocks';
import { simulatePrice } from '@/data/tradeEngine';

const { width: SW } = Dimensions.get('window');

export default function MarketScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [search, setSearch] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const initial: Record<string, number> = {};
        MOCK_STOCKS.forEach(s => { initial[s.symbol] = s.price; });
        setPrices(initial);
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPrices(prev => {
                const next = { ...prev };
                MOCK_STOCKS.forEach(s => {
                    next[s.symbol] = simulatePrice({ ...s, price: prev[s.symbol] || s.price });
                });
                return next;
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const filtered = MOCK_STOCKS.filter(s =>
        s.symbol.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    const miniChart = (stock: StockData) => {
        const data = stock.history1D.slice(-10);
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        const h = 28;
        const w = 56;
        const step = w / (data.length - 1);
        const up = data[data.length - 1] >= data[0];
        return (
            <View style={{ width: w, height: h }}>
                {data.map((v, i) => {
                    if (i === 0) return null;
                    const x1 = (i - 1) * step;
                    const y1 = h - ((data[i - 1] - min) / range) * h;
                    const x2 = i * step;
                    const y2 = h - ((v - min) / range) * h;
                    const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
                    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
                    return (
                        <View key={i} style={{
                            position: 'absolute', left: x1, top: y1,
                            width: len, height: 2, borderRadius: 1,
                            backgroundColor: up ? '#22C55E' : '#EF4444',
                            transform: [{ rotate: `${angle}deg` }],
                            transformOrigin: 'left center',
                        }} />
                    );
                })}
            </View>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={20} color={Colors.secondary} strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.headerTitle}>Market</Text>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
                <Search size={18} color={Colors.textMuted} strokeWidth={2.5} />
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search stocks..."
                    placeholderTextColor={Colors.textMuted}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Text style={styles.sectionLabel}>{filtered.length} STOCKS AVAILABLE</Text>

                {filtered.map((stock, idx) => {
                    const cp = prices[stock.symbol] || stock.price;
                    const change = cp - stock.prevClose;
                    const changePct = ((change / stock.prevClose) * 100).toFixed(2);
                    const up = change >= 0;

                    return (
                        <Animated.View key={stock.symbol} style={{ opacity: fadeAnim }}>
                            <Pressable
                                style={({ pressed }) => [styles.stockRow, pressed && styles.stockRowPressed]}
                                onPress={() => {
                                    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch { }
                                    router.push({ pathname: '/paper-trading/stock-detail', params: { symbol: stock.symbol } } as any);
                                }}
                            >
                                <View style={[styles.logo, { backgroundColor: stock.color }]}>
                                    <Text style={styles.logoText}>{stock.symbol.substring(0, 2)}</Text>
                                </View>
                                <View style={styles.stockInfo}>
                                    <Text style={styles.stockSymbol}>{stock.symbol}</Text>
                                    <Text style={styles.stockName} numberOfLines={1}>{stock.name}</Text>
                                </View>
                                {miniChart(stock)}
                                <View style={styles.priceCol}>
                                    <Text style={styles.priceText}>{'\u20B9'}{cp.toLocaleString('en-IN')}</Text>
                                    <View style={[styles.changeBadge, { backgroundColor: up ? '#DCFCE7' : '#FEE2E2' }]}>
                                        {up ? <TrendingUp size={10} color="#22C55E" strokeWidth={3} /> : <TrendingDown size={10} color="#EF4444" strokeWidth={3} />}
                                        <Text style={[styles.changeText, { color: up ? '#22C55E' : '#EF4444' }]}>
                                            {up ? '+' : ''}{changePct}%
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        </Animated.View>
                    );
                })}
                <View style={{ height: 40 }} />
            </ScrollView>
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
    headerTitle: { flex: 1, fontFamily: Typography.fontFamily.black, fontSize: 22, color: Colors.secondary, marginLeft: 14, letterSpacing: -0.5 },
    searchWrap: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
        marginHorizontal: 20, marginTop: 16, borderRadius: 16, paddingHorizontal: 16,
        borderWidth: 3, borderColor: Colors.secondary, gap: 10, height: 50,
    },
    searchInput: {
        flex: 1, fontFamily: Typography.fontFamily.bold, fontSize: 16, color: Colors.secondary, height: '100%',
    },
    scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
    sectionLabel: { fontFamily: Typography.fontFamily.black, fontSize: 12, color: Colors.textMuted, letterSpacing: 1.5, marginBottom: 14 },
    stockRow: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
        borderRadius: 18, padding: 14, marginBottom: 10,
        borderWidth: 3, borderColor: Colors.secondary, gap: 10,
        shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 0,
    },
    stockRowPressed: { shadowOffset: { width: 0, height: 0 }, marginTop: 3, marginBottom: 7 },
    logo: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.secondary },
    logoText: { fontFamily: Typography.fontFamily.black, fontSize: 13, color: '#FFF' },
    stockInfo: { flex: 1 },
    stockSymbol: { fontFamily: Typography.fontFamily.black, fontSize: 15, color: Colors.secondary },
    stockName: { fontFamily: Typography.fontFamily.bold, fontSize: 11, color: Colors.textMuted, marginTop: 1 },
    priceCol: { alignItems: 'flex-end', gap: 3 },
    priceText: { fontFamily: Typography.fontFamily.black, fontSize: 15, color: Colors.secondary },
    changeBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    changeText: { fontFamily: Typography.fontFamily.black, fontSize: 11 },
});
