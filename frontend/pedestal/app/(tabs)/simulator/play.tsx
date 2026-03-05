import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Pressable,
    Animated, Dimensions, Modal, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ArrowLeft, Zap, TrendingDown, TrendingUp, AlertTriangle,
    ChevronRight, Shield, Timer, DollarSign, BarChart3, Target,
    Newspaper, CheckCircle2,
} from 'lucide-react-native';
import * as LucideIcons from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { getCaseById, SimulationCase, SimulationWeek, DecisionOption } from '@/data/simulatorCases';
import * as Haptics from 'expo-haptics';

const { width: SW } = Dimensions.get('window');

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function formatNum(n: number, currency: string): string {
    if (currency === '₹') {
        if (n >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
        return `₹${n.toLocaleString('en-IN')}`;
    }
    return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

function calcDiversificationScore(allocations: Record<string, number>): number {
    const values = Object.values(allocations).filter((v) => v > 0);
    if (values.length <= 1) return 10;
    const total = values.reduce((a, b) => a + b, 0);
    if (total === 0) return 50;
    const fractions = values.map((v) => v / total);
    const herfindahl = fractions.reduce((a, f) => a + f * f, 0);
    return Math.round(Math.max(10, Math.min(100, (1 - herfindahl) * 130)));
}

// ────────────────────────────────────────────────────────────
// Main Play Screen
// ────────────────────────────────────────────────────────────

export default function SimulationPlayScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ caseId: string }>();
    const simCase = getCaseById(params.caseId || '');

    // State
    const [phase, setPhase] = useState<'intro' | 'playing' | 'crisis'>('intro');
    const [currentWeek, setCurrentWeek] = useState(0);
    const [currentEvent, setCurrentEvent] = useState(0);
    const [showDecision, setShowDecision] = useState(false);
    const [decisions, setDecisions] = useState<string[]>([]);
    const [portfolio, setPortfolio] = useState(simCase?.startingCapitalNum || 1000000);
    const [allocations, setAllocations] = useState<Record<string, number>>({});
    const [weeklyReturns, setWeeklyReturns] = useState<number[]>([]);
    const [decisionsMade, setDecisionsMade] = useState(0);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const crashAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 9, useNativeDriver: true }),
        ]).start();
    }, [phase, currentWeek]);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    if (!simCase) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.errorText}>Case not found</Text>
                <Pressable onPress={() => router.back()} style={styles.backBtnSmall}>
                    <Text style={styles.backBtnSmallText}>Go Back</Text>
                </Pressable>
            </View>
        );
    }

    const week: SimulationWeek | undefined = simCase.timeline[currentWeek];
    const isLastWeek = currentWeek >= simCase.timeline.length - 1;
    const isCrisisWeek = isLastWeek;
    const totalWeeks = simCase.timeline.length;
    const progressPercent = ((currentWeek + 1) / totalWeeks) * 100;

    const gainLoss = portfolio - simCase.startingCapitalNum;
    const gainLossPercent = ((gainLoss / simCase.startingCapitalNum) * 100).toFixed(1);
    const divScore = calcDiversificationScore(allocations);

    // ── Decision handler ─────────────────────────────────────
    const handleDecision = (option: DecisionOption) => {
        try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch { }

        // Apply allocation
        setAllocations(option.impact);
        setDecisions((prev) => [...prev, option.id]);
        setDecisionsMade((prev) => prev + 1);

        // Calculate portfolio change based on current week returns
        let weekReturn = 0;
        simCase.assets.forEach((asset) => {
            const alloc = option.impact[asset.type] || 0;
            const ret = asset.weeklyReturns[currentWeek] || 0;
            weekReturn += (alloc / 100) * ret;
        });
        const newPortfolio = Math.round(portfolio * (1 + weekReturn / 100));
        setPortfolio(newPortfolio);
        setWeeklyReturns((prev) => [...prev, weekReturn]);
        setShowDecision(false);

        // Move to next week after a brief pause
        setTimeout(() => {
            if (isLastWeek) {
                // Play crisis animation
                setCrisisAndFinish();
            } else {
                fadeAnim.setValue(0);
                slideAnim.setValue(30);
                setCurrentWeek((prev) => prev + 1);
                setCurrentEvent(0);
            }
        }, 600);
    };

    const setCrisisAndFinish = () => {
        // Crisis animation
        setPhase('crisis');
        Animated.sequence([
            Animated.timing(crashAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
            Animated.timing(crashAnim, { toValue: 0.5, duration: 300, useNativeDriver: true }),
            Animated.timing(crashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();

        // Apply final week's hit
        let finalHit = 0;
        simCase.assets.forEach((asset) => {
            const alloc = allocations[asset.type] || 0;
            const ret = asset.weeklyReturns[simCase.timeline.length - 1] || 0;
            finalHit += (alloc / 100) * ret;
        });
        const finalPortfolio = Math.round(portfolio * (1 + finalHit / 100));
        setPortfolio(finalPortfolio);

        setTimeout(() => {
            router.replace({
                pathname: '/simulator/results',
                params: {
                    caseId: simCase.id,
                    finalPortfolio: String(finalPortfolio),
                    startingCapital: String(simCase.startingCapitalNum),
                    divScore: String(divScore),
                    decisionsMade: String(decisionsMade),
                    currency: simCase.currency,
                },
            });
        }, 2500);
    };

    const advanceToDecision = () => {
        if (week?.decision) {
            setShowDecision(true);
        } else {
            // No decision this week (crisis week) — go straight to crisis
            setCrisisAndFinish();
        }
    };

    const startSimulation = () => {
        try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch { }
        setPhase('playing');
        fadeAnim.setValue(0);
        slideAnim.setValue(30);
    };

    // ── INTRO PHASE ──────────────────────────────────────────
    if (phase === 'intro') {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, {
                        paddingTop: Math.max(insets.top, 20),
                        paddingBottom: insets.bottom + 30,
                    }]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back */}
                    <Pressable onPress={() => router.back()} style={styles.backBtn}>
                        <ArrowLeft size={22} color={Colors.secondary} strokeWidth={3} />
                    </Pressable>

                    {/* Case intro */}
                    <Animated.View style={[styles.introCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                        {(() => {
                            const IntroIcon = (LucideIcons as any)[simCase.iconName] || LucideIcons.Activity;
                            return (
                                <View style={[styles.introIconWrapper, { backgroundColor: simCase.accentColor + '15', borderColor: simCase.accentColor + '30' }]}>
                                    <IntroIcon size={40} color={simCase.accentColor} strokeWidth={2.5} />
                                </View>
                            );
                        })()}
                        <Text style={styles.introTitle}>{simCase.title}</Text>
                        <Text style={styles.introSubtitle}>{simCase.subtitle}</Text>

                        <View style={styles.introDivider} />

                        <Text style={styles.contextTitle}>Historical Context</Text>
                        <Text style={styles.contextText}>{simCase.context}</Text>

                        <View style={styles.introDivider} />

                        {/* Capital */}
                        <View style={styles.capitalRow}>
                            <View style={styles.capitalIcon}>
                                <DollarSign size={20} color={Colors.neonGreen} strokeWidth={2.5} />
                            </View>
                            <View>
                                <Text style={styles.capitalLabel}>Starting Capital</Text>
                                <Text style={styles.capitalValue}>{simCase.startingCapital}</Text>
                            </View>
                        </View>

                        {/* Assets */}
                        <Text style={styles.assetsTitle}>Available Assets</Text>
                        <View style={styles.assetsGrid}>
                            {simCase.assets.map((asset) => (
                                <View key={asset.name} style={styles.assetChip}>
                                    <Text style={styles.assetChipText}>{asset.name}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Duration & Difficulty */}
                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Timer size={16} color={Colors.textMuted} strokeWidth={2} />
                                <Text style={styles.metaText}>{simCase.duration}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Target size={16} color={Colors.textMuted} strokeWidth={2} />
                                <Text style={styles.metaText}>{simCase.difficultyLabel}</Text>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Begin Button */}
                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <Pressable
                            style={[styles.beginBtn, { backgroundColor: simCase.accentColor }]}
                            onPress={startSimulation}
                        >
                            <Text style={styles.beginBtnText}>Begin Simulation</Text>
                            <ChevronRight size={22} color="#FFF" strokeWidth={3} />
                        </Pressable>
                    </Animated.View>
                </ScrollView>
            </View>
        );
    }

    // ── CRISIS PHASE ─────────────────────────────────────────
    if (phase === 'crisis') {
        const crisisWeek = simCase.timeline[simCase.timeline.length - 1];
        return (
            <View style={[styles.container, styles.crisisContainer]}>
                <Animated.View style={[styles.crisisOverlay, { opacity: crashAnim }]}>
                    <View style={styles.crisisIconWrapper}>
                        <LucideIcons.AlertOctagon size={64} color="#FF3366" strokeWidth={2} />
                    </View>
                    <Text style={styles.crisisTitle}>BREAKING NEWS</Text>
                    <Text style={styles.crisisSubtitle}>{crisisWeek?.events[0]?.text || 'Market Crash!'}</Text>

                    <View style={styles.crisisImpact}>
                        <TrendingDown size={32} color="#FF3366" strokeWidth={2.5} />
                        <Text style={styles.crisisLoss}>
                            {gainLoss < 0 ? '-' : '+'}{Math.abs(Number(gainLossPercent))}%
                        </Text>
                    </View>

                    <Text style={styles.crisisPortfolio}>
                        Portfolio: {formatNum(portfolio, simCase.currency)}
                    </Text>

                    {crisisWeek?.events.slice(1).map((ev) => (
                        <Text key={ev.id} style={styles.crisisEvent}>• {ev.text}</Text>
                    ))}
                </Animated.View>
            </View>
        );
    }

    // ── PLAYING PHASE ────────────────────────────────────────
    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, {
                    paddingTop: Math.max(insets.top, 20),
                    paddingBottom: insets.bottom + 30,
                }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Top bar */}
                <View style={styles.topBar}>
                    <Pressable onPress={() => {
                        Alert.alert('Exit Simulation?', 'Your progress will be lost.', [
                            { text: 'Stay', style: 'cancel' },
                            { text: 'Exit', style: 'destructive', onPress: () => router.back() },
                        ]);
                    }} style={styles.backBtnSmall}>
                        <ArrowLeft size={18} color={Colors.secondary} strokeWidth={3} />
                    </Pressable>
                    <View style={styles.weekBadge}>
                        <Text style={styles.weekBadgeText}>
                            Week {currentWeek + 1}/{totalWeeks}
                        </Text>
                    </View>
                    <View style={[styles.xpBadgeSm, { backgroundColor: simCase.accentColor }]}>
                        <Zap size={12} color="#FFF" strokeWidth={3} />
                        <Text style={styles.xpBadgeSmText}>
                            {formatNum(portfolio, simCase.currency)}
                        </Text>
                    </View>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarBg}>
                    <Animated.View style={[styles.progressBarFill, {
                        width: `${progressPercent}%`,
                        backgroundColor: simCase.accentColor,
                    }]} />
                </View>

                {/* Portfolio Panel */}
                <Animated.View style={[styles.portfolioPanel, {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                }]}>
                    <Text style={styles.panelLabel}>Portfolio Value</Text>
                    <Text style={styles.portfolioValue}>
                        {formatNum(portfolio, simCase.currency)}
                    </Text>
                    <View style={styles.portfolioMeta}>
                        <View style={[styles.changePill, gainLoss < 0 && styles.changePillNeg]}>
                            {gainLoss >= 0 ? (
                                <TrendingUp size={12} color={Colors.neonGreen} strokeWidth={2.5} />
                            ) : (
                                <TrendingDown size={12} color={Colors.error} strokeWidth={2.5} />
                            )}
                            <Text style={[styles.changeText, gainLoss < 0 && styles.changeTextNeg]}>
                                {gainLoss >= 0 ? '+' : ''}{gainLossPercent}%
                            </Text>
                        </View>
                        <View style={styles.scorePill}>
                            <Shield size={12} color={Colors.primary} strokeWidth={2.5} />
                            <Text style={styles.scoreText}>Div: {divScore}%</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Week Title */}
                {week && (
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                        <Text style={styles.weekTitle}>{week.title}</Text>
                        <Text style={styles.weekSubtitle}>{week.subtitle}</Text>

                        {/* News Timeline */}
                        <View style={styles.newsTimeline}>
                            <Text style={styles.newsHeader}>
                                <Newspaper size={14} color={Colors.textMuted} strokeWidth={2} /> Market News
                            </Text>
                            {week.events.map((ev, idx) => (
                                <View key={ev.id} style={styles.newsItem}>
                                    <View style={[
                                        styles.newsDot,
                                        ev.type === 'breaking' && { backgroundColor: '#FF3366' },
                                        ev.type === 'warning' && { backgroundColor: '#F59E0B' },
                                        ev.type === 'positive' && { backgroundColor: '#22C55E' },
                                        ev.type === 'neutral' && { backgroundColor: Colors.textMuted },
                                        ev.type === 'news' && { backgroundColor: Colors.primary },
                                    ]} />
                                    {idx < week.events.length - 1 && <View style={styles.newsLine} />}
                                    <Text style={[
                                        styles.newsText,
                                        ev.type === 'breaking' && { color: '#FF3366', fontFamily: Typography.fontFamily.extraBold },
                                    ]}>{ev.text}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Make Decision Button or Continue */}
                        {week.decision && !showDecision ? (
                            <Pressable
                                style={[styles.decisionCta, { backgroundColor: simCase.accentColor }]}
                                onPress={advanceToDecision}
                            >
                                <Text style={styles.decisionCtaText}>Make Your Decision</Text>
                                <ChevronRight size={20} color="#FFF" strokeWidth={3} />
                            </Pressable>
                        ) : !week.decision ? (
                            <Pressable
                                style={[styles.decisionCta, { backgroundColor: '#FF3366' }]}
                                onPress={advanceToDecision}
                            >
                                <Text style={styles.decisionCtaText}>Continue to Impact</Text>
                                <AlertTriangle size={18} color="#FFF" strokeWidth={2.5} />
                            </Pressable>
                        ) : null}
                    </Animated.View>
                )}

                {/* Decision Modal */}
                {showDecision && week?.decision && (
                    <Animated.View style={[styles.decisionPanel, { opacity: fadeAnim }]}>
                        <Text style={styles.decisionPrompt}>{week.decision.prompt}</Text>
                        {week.decision.options.map((opt) => (
                            <Pressable
                                key={opt.id}
                                style={({ pressed }) => [
                                    styles.decisionCard,
                                    pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
                                ]}
                                onPress={() => handleDecision(opt)}
                            >
                                <View style={styles.decisionCardTop}>
                                    {(() => {
                                        const OptIcon = (LucideIcons as any)[opt.icon] || LucideIcons.CheckCircle2;
                                        return (
                                            <View style={styles.decisionIconWrapper}>
                                                <OptIcon size={24} color={Colors.secondary} strokeWidth={2.5} />
                                            </View>
                                        );
                                    })()}
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.decisionLabel}>{opt.label}</Text>
                                        <Text style={styles.decisionDesc}>{opt.description}</Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scrollContent: { paddingHorizontal: Spacing.xl },
    errorText: {
        fontFamily: Typography.fontFamily.bold, fontSize: 18, color: Colors.textMuted,
    },
    // Top bar
    topBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
    },
    backBtn: {
        width: 44, height: 44, borderRadius: 22,
        borderWidth: 2.5, borderColor: Colors.secondary,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.white, marginBottom: Spacing.xl,
    },
    backBtnSmall: {
        width: 36, height: 36, borderRadius: 18,
        borderWidth: 2, borderColor: Colors.secondary,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.white,
    },
    backBtnSmallText: {
        fontFamily: Typography.fontFamily.bold, fontSize: 14, color: Colors.secondary,
    },
    weekBadge: {
        backgroundColor: Colors.secondary, paddingHorizontal: 14,
        paddingVertical: 5, borderRadius: 14,
    },
    weekBadgeText: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 12, color: '#FFF',
    },
    xpBadgeSm: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14,
    },
    xpBadgeSmText: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 11, color: '#FFF',
    },
    // Progress
    progressBarBg: {
        height: 6, backgroundColor: Colors.progressBg,
        borderRadius: 3, marginBottom: Spacing.lg, overflow: 'hidden',
    },
    progressBarFill: { height: '100%', borderRadius: 3 },
    // Portfolio Panel
    portfolioPanel: {
        backgroundColor: Colors.secondary, borderRadius: BorderRadius.xl,
        padding: Spacing.xl, marginBottom: Spacing.xl,
    },
    panelLabel: {
        fontFamily: Typography.fontFamily.semiBold, fontSize: 12,
        color: '#64748B', textTransform: 'uppercase', letterSpacing: 1,
    },
    portfolioValue: {
        fontFamily: Typography.fontFamily.black, fontSize: 32,
        color: '#FFF', letterSpacing: -1, marginVertical: 4,
    },
    portfolioMeta: { flexDirection: 'row', gap: 10, marginTop: 6 },
    changePill: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(34,197,94,0.15)',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    },
    changePillNeg: { backgroundColor: 'rgba(239,68,68,0.15)' },
    changeText: {
        fontFamily: Typography.fontFamily.bold, fontSize: 12, color: Colors.neonGreen,
    },
    changeTextNeg: { color: Colors.error },
    scorePill: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: 'rgba(37,99,235,0.15)',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
    },
    scoreText: {
        fontFamily: Typography.fontFamily.bold, fontSize: 12, color: Colors.primary,
    },
    // Week
    weekTitle: {
        fontFamily: Typography.fontFamily.black, fontSize: 22,
        color: Colors.secondary, letterSpacing: -0.5, marginBottom: 2,
    },
    weekSubtitle: {
        fontFamily: Typography.fontFamily.medium, fontSize: 13,
        color: Colors.textMuted, marginBottom: Spacing.lg,
    },
    // News
    newsTimeline: {
        backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
        padding: Spacing.lg, borderWidth: 2, borderColor: Colors.inputBorder,
        marginBottom: Spacing.xl,
    },
    newsHeader: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 14,
        color: Colors.secondary, marginBottom: 14,
    },
    newsItem: {
        flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14,
        paddingLeft: 4,
    },
    newsDot: {
        width: 10, height: 10, borderRadius: 5,
        backgroundColor: Colors.primary, marginRight: 12, marginTop: 4,
    },
    newsLine: {
        position: 'absolute', left: 8, top: 16, width: 2, height: 20,
        backgroundColor: Colors.inputBorder,
    },
    newsText: {
        fontFamily: Typography.fontFamily.semiBold, fontSize: 13,
        color: Colors.secondary, lineHeight: 19, flex: 1,
    },
    // Decision
    decisionCta: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        height: 52, borderRadius: 26, gap: 8, marginBottom: 10,
    },
    decisionCtaText: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 16, color: '#FFF',
    },
    decisionPanel: { marginBottom: 20 },
    decisionPrompt: {
        fontFamily: Typography.fontFamily.black, fontSize: 18,
        color: Colors.secondary, marginBottom: 14, textAlign: 'center',
    },
    decisionCard: {
        backgroundColor: Colors.white, borderRadius: BorderRadius.lg,
        padding: Spacing.lg, borderWidth: 2, borderColor: Colors.inputBorder,
        marginBottom: 10,
    },
    decisionCardTop: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
    },
    decisionIconWrapper: {
        width: 48, height: 48, borderRadius: 14,
        backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: Colors.inputBorder,
    },
    decisionLabel: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 15, color: Colors.secondary,
    },
    decisionDesc: {
        fontFamily: Typography.fontFamily.medium, fontSize: 12, color: Colors.textMuted,
        marginTop: 2,
    },
    riskBadge: {
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    },
    riskText: {
        fontFamily: Typography.fontFamily.bold, fontSize: 10,
    },
    // Crisis
    crisisContainer: {
        backgroundColor: '#0A0E27', justifyContent: 'center', alignItems: 'center',
    },
    crisisOverlay: {
        alignItems: 'center', paddingHorizontal: 30,
    },
    crisisIconWrapper: {
        marginBottom: 20,
    },
    crisisTitle: {
        fontFamily: Typography.fontFamily.black, fontSize: 32,
        color: '#FF3366', letterSpacing: 2, marginBottom: 10,
    },
    crisisSubtitle: {
        fontFamily: Typography.fontFamily.bold, fontSize: 16,
        color: '#94A3B8', textAlign: 'center', lineHeight: 22, marginBottom: 24,
    },
    crisisImpact: {
        flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16,
    },
    crisisLoss: {
        fontFamily: Typography.fontFamily.black, fontSize: 44, color: '#FF3366',
    },
    crisisPortfolio: {
        fontFamily: Typography.fontFamily.bold, fontSize: 16,
        color: '#64748B', marginBottom: 24,
    },
    crisisEvent: {
        fontFamily: Typography.fontFamily.medium, fontSize: 13,
        color: '#8892B0', lineHeight: 20, marginBottom: 6, textAlign: 'center',
    },
    // Intro
    introCard: {
        backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
        padding: Spacing.xxl, borderWidth: 2, borderColor: Colors.inputBorder,
        marginBottom: Spacing.xl, alignItems: 'center',
    },
    introIconWrapper: {
        width: 80, height: 80, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, marginBottom: 20,
    },
    introTitle: {
        fontFamily: Typography.fontFamily.black, fontSize: 28,
        color: Colors.secondary, letterSpacing: -1, marginBottom: 4,
    },
    introSubtitle: {
        fontFamily: Typography.fontFamily.semiBold, fontSize: 14,
        color: Colors.textMuted, marginBottom: 16,
    },
    introDivider: {
        height: 1, backgroundColor: Colors.inputBorder, marginVertical: 16,
    },
    contextTitle: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 16,
        color: Colors.secondary, marginBottom: 8,
    },
    contextText: {
        fontFamily: Typography.fontFamily.medium, fontSize: 14,
        color: Colors.textSecondary, lineHeight: 21,
    },
    capitalRow: {
        flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20,
    },
    capitalIcon: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center',
    },
    capitalLabel: {
        fontFamily: Typography.fontFamily.semiBold, fontSize: 12,
        color: Colors.textMuted, textTransform: 'uppercase',
    },
    capitalValue: {
        fontFamily: Typography.fontFamily.black, fontSize: 22,
        color: Colors.secondary, letterSpacing: -0.5,
    },
    assetsTitle: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 16,
        color: Colors.secondary, marginBottom: 10,
    },
    assetsGrid: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16,
    },
    assetChip: {
        backgroundColor: Colors.background, paddingHorizontal: 12,
        paddingVertical: 6, borderRadius: 10, borderWidth: 1.5,
        borderColor: Colors.inputBorder,
    },
    assetChipText: {
        fontFamily: Typography.fontFamily.bold, fontSize: 12, color: Colors.textSecondary,
    },
    metaRow: {
        flexDirection: 'row', gap: 20,
    },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    metaText: {
        fontFamily: Typography.fontFamily.semiBold, fontSize: 13, color: Colors.textMuted,
    },
    beginBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        height: 60, borderRadius: 30, gap: 8,
        borderWidth: 3, borderColor: Colors.secondary,
        shadowColor: Colors.secondary,
        shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 0,
        elevation: 4,
    },
    beginBtnText: {
        fontFamily: Typography.fontFamily.black, fontSize: 18,
        color: '#FFF', letterSpacing: 0.5,
    },
});
