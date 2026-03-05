import React, { useRef, useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Pressable,
    Animated, Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Trophy, TrendingUp, TrendingDown, Shield, Target,
    BarChart3, RefreshCcw, Home, Share2, Star, Award,
    Zap, ChevronRight,
} from 'lucide-react-native';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import * as LucideIcons from 'lucide-react-native';
import { getCaseById } from '@/data/simulatorCases';
import * as Haptics from 'expo-haptics';

function formatNum(n: number, currency: string): string {
    if (currency === '₹') {
        if (Math.abs(n) >= 100000) return `₹${(n / 100000).toFixed(2)}L`;
        return `₹${n.toLocaleString('en-IN')}`;
    }
    return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
}

function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
    const anim = useRef(new Animated.Value(0)).current;
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        Animated.timing(anim, {
            toValue: value,
            duration: 1500,
            delay,
            useNativeDriver: false,
        }).start();

        anim.addListener(({ value: v }) => setDisplay(Math.round(v)));
        return () => anim.removeAllListeners();
    }, []);

    return <Text style={styles.scoreValue}>{display}</Text>;
}

function ScoreBar({ label, score, color, icon: Icon, delay }: {
    label: string; score: number; color: string;
    icon: React.ElementType; delay: number;
}) {
    const widthAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(widthAnim, { toValue: score, duration: 1200, delay, useNativeDriver: false }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <Animated.View style={[styles.scoreBarRow, { opacity: fadeAnim }]}>
            <View style={styles.scoreBarHeader}>
                <View style={styles.scoreBarLabel}>
                    <Icon size={14} color={color} strokeWidth={2.5} />
                    <Text style={styles.scoreBarLabelText}>{label}</Text>
                </View>
                <AnimatedCounter value={score} delay={delay} />
            </View>
            <View style={styles.scoreBarBg}>
                <Animated.View style={[styles.scoreBarFill, {
                    backgroundColor: color,
                    width: widthAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%'],
                    }),
                }]} />
            </View>
        </Animated.View>
    );
}

export default function ResultsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{
        caseId: string; finalPortfolio: string;
        startingCapital: string; divScore: string;
        decisionsMade: string; currency: string;
    }>();

    const simCase = getCaseById(params.caseId || '');
    const finalPortfolio = Number(params.finalPortfolio) || 0;
    const startingCapital = Number(params.startingCapital) || 1000000;
    const divScore = Number(params.divScore) || 50;
    const decisionsMade = Number(params.decisionsMade) || 0;
    const currency = params.currency || '₹';

    const gainLoss = finalPortfolio - startingCapital;
    const gainLossPercent = ((gainLoss / startingCapital) * 100).toFixed(1);
    const isProfit = gainLoss >= 0;

    // Score calculations
    const portfolioScore = Math.max(0, Math.min(100, 50 + (gainLoss / startingCapital) * 200));
    const decisionScore = Math.max(20, Math.min(100, 50 + decisionsMade * 15 - (isProfit ? 0 : 20)));
    const overallScore = Math.round(portfolioScore * 0.45 + decisionScore * 0.35 + divScore * 0.20);

    // Determine grade
    const grade = overallScore >= 85 ? 'S' : overallScore >= 70 ? 'A' : overallScore >= 55 ? 'B' : overallScore >= 40 ? 'C' : 'D';
    const gradeColors: Record<string, string> = { S: '#FFD700', A: '#22C55E', B: '#3B82F6', C: '#F59E0B', D: '#EF4444' };
    const gradeColor = gradeColors[grade] || '#F59E0B';

    // Achievements
    const achievements: { name: string; icon: string; earned: boolean; desc: string }[] = [
        { name: 'Crash Survivor', icon: 'ShieldCheck', earned: Math.abs(Number(gainLossPercent)) < 10, desc: 'Less than 10% portfolio loss' },
        { name: 'Risk Manager', icon: 'BarChart2', earned: divScore >= 70, desc: 'Diversification above 70%' },
        { name: 'Master Diversifier', icon: 'Gem', earned: divScore >= 80, desc: '5+ asset classes used' },
        { name: 'Market Strategist', icon: 'Target', earned: isProfit, desc: 'Positive returns in crisis' },
        { name: 'Quick Learner', icon: 'Zap', earned: decisionsMade >= 2, desc: 'Made strategic decisions' },
    ];

    // Determine educational message
    let eduMessage = '';
    if (Number(gainLossPercent) < -30) {
        eduMessage = 'Your portfolio suffered heavy losses. Consider diversifying across asset classes and using safe havens like gold and bonds during uncertain times.';
    } else if (Number(gainLossPercent) < -10) {
        eduMessage = 'Moderate losses suggest some exposure to risky assets. Taking profits early and recognizing warning signs can protect wealth during crises.';
    } else if (Number(gainLossPercent) < 0) {
        eduMessage = 'You limited your losses well. Strong risk management and timely decisions helped protect most of your capital.';
    } else {
        eduMessage = 'Impressive! You managed to profit during a crisis through strategic allocation and wise decision-making. Warren Buffett would be proud.';
    }

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(40)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch { }
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 40, friction: 8, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `I just completed the "${simCase?.title}" simulation on Pedestal! Final score: ${overallScore}/100 (Grade: ${grade}). Portfolio: ${gainLossPercent}% return. 📈`,
            });
        } catch { }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={[styles.scrollContent, {
                    paddingTop: Math.max(insets.top, 20),
                    paddingBottom: insets.bottom + 40,
                }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Grade Circle */}
                <Animated.View style={[styles.gradeSection, {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                }]}>
                    <View style={[styles.gradeCircle, { borderColor: gradeColor }]}>
                        <Text style={[styles.gradeText, { color: gradeColor }]}>{grade}</Text>
                    </View>
                    <Text style={styles.gradeLabel}>Overall Score</Text>
                    <Text style={styles.gradeScore}>{overallScore}/100</Text>
                    <Text style={styles.caseTitle}>{simCase?.title || 'Simulation Complete'}</Text>
                </Animated.View>

                {/* Portfolio Summary */}
                <Animated.View style={[styles.summaryCard, {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                }]}>
                    <Text style={styles.summaryCardTitle}>Portfolio Performance</Text>

                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Starting Capital</Text>
                            <Text style={styles.summaryValueSmall}>{formatNum(startingCapital, currency)}</Text>
                        </View>
                        <View style={[styles.summaryArrow, { backgroundColor: isProfit ? '#DCFCE7' : '#FEE2E2' }]}>
                            {isProfit ? (
                                <TrendingUp size={16} color="#22C55E" strokeWidth={2.5} />
                            ) : (
                                <TrendingDown size={16} color="#EF4444" strokeWidth={2.5} />
                            )}
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Final Value</Text>
                            <Text style={[styles.summaryValueSmall, { color: isProfit ? '#22C55E' : '#EF4444' }]}>
                                {formatNum(finalPortfolio, currency)}
                            </Text>
                        </View>
                    </View>

                    <View style={[styles.glBadge, { backgroundColor: isProfit ? '#DCFCE7' : '#FEE2E2' }]}>
                        <Text style={[styles.glText, { color: isProfit ? '#16A34A' : '#DC2626' }]}>
                            {isProfit ? '+' : ''}{gainLossPercent}% ({isProfit ? '+' : ''}{formatNum(gainLoss, currency)})
                        </Text>
                    </View>
                </Animated.View>

                {/* Score Breakdown */}
                <Animated.View style={[styles.scoresCard, {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }],
                }]}>
                    <Text style={styles.scoresCardTitle}>Score Breakdown</Text>
                    <ScoreBar label="Portfolio Value" score={Math.round(portfolioScore)} color="#22C55E" icon={BarChart3} delay={300} />
                    <ScoreBar label="Decision Quality" score={Math.round(decisionScore)} color="#F59E0B" icon={Target} delay={500} />
                    <ScoreBar label="Diversification" score={divScore} color="#8B5CF6" icon={Zap} delay={700} />
                </Animated.View>

                {/* Educational Insight */}
                <Animated.View style={[styles.insightCard, { opacity: fadeAnim }]}>
                    <View style={styles.insightHeader}>
                        <Award size={18} color={Colors.primary} strokeWidth={2.5} />
                        <Text style={styles.insightTitle}>Key Takeaway</Text>
                    </View>
                    <Text style={styles.insightText}>{eduMessage}</Text>

                    {simCase && (
                        <View style={styles.learnings}>
                            <Text style={styles.learningsTitle}>What you should learn:</Text>
                            {simCase.learningObjectives.map((obj, idx) => (
                                <View key={idx} style={styles.learningItem}>
                                    <View style={styles.learningDot} />
                                    <Text style={styles.learningText}>{obj}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </Animated.View>

                {/* Achievements */}
                <Animated.View style={[styles.achievementsCard, { opacity: fadeAnim }]}>
                    <Text style={styles.achievementsTitle}>Achievements</Text>
                    {achievements.map((ach) => {
                        const AchIcon = (LucideIcons as any)[ach.icon] || LucideIcons.CheckCircle;
                        return (
                            <View key={ach.name} style={[styles.achieveRow, !ach.earned && { opacity: 0.35 }]}>
                                <View style={styles.achieveIconWrapper}>
                                    <AchIcon size={22} color={Colors.secondary} strokeWidth={2.5} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.achieveName}>{ach.name}</Text>
                                    <Text style={styles.achieveDesc}>{ach.desc}</Text>
                                </View>
                                {ach.earned && (
                                    <View style={styles.earnedBadge}>
                                        <Text style={styles.earnedText}>Earned!</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </Animated.View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Pressable
                        style={[styles.actionBtn, { backgroundColor: simCase?.accentColor || Colors.primary }]}
                        onPress={() => {
                            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch { }
                            router.replace({ pathname: '/simulator/play', params: { caseId: params.caseId } });
                        }}
                    >
                        <RefreshCcw size={18} color="#FFF" strokeWidth={2.5} />
                        <Text style={styles.actionBtnText}>Replay Simulation</Text>
                    </Pressable>

                    <View style={styles.actionRow}>
                        <Pressable style={styles.secondaryBtn} onPress={handleShare}>
                            <Share2 size={18} color={Colors.secondary} strokeWidth={2.5} />
                            <Text style={styles.secondaryBtnText}>Share</Text>
                        </Pressable>
                        <Pressable style={styles.secondaryBtn} onPress={() => router.replace('/simulator')}>
                            <Home size={18} color={Colors.secondary} strokeWidth={2.5} />
                            <Text style={styles.secondaryBtnText}>All Cases</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    scrollContent: { paddingHorizontal: Spacing.xl },
    // Grade
    gradeSection: { alignItems: 'center', marginBottom: Spacing.xxl },
    gradeCircle: {
        width: 100, height: 100, borderRadius: 50,
        borderWidth: 5, alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.white, marginBottom: 10,
    },
    gradeText: { fontFamily: Typography.fontFamily.black, fontSize: 44 },
    gradeLabel: {
        fontFamily: Typography.fontFamily.semiBold, fontSize: 13,
        color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1,
    },
    gradeScore: {
        fontFamily: Typography.fontFamily.black, fontSize: 20,
        color: Colors.secondary, marginTop: 2,
    },
    caseTitle: {
        fontFamily: Typography.fontFamily.bold, fontSize: 14,
        color: Colors.textSecondary, marginTop: 4,
    },
    // Summary Card
    summaryCard: {
        backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
        padding: Spacing.xl, borderWidth: 2, borderColor: Colors.inputBorder,
        marginBottom: Spacing.lg,
    },
    summaryCardTitle: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 16,
        color: Colors.secondary, marginBottom: 16,
    },
    summaryRow: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14,
    },
    summaryItem: { alignItems: 'center', flex: 1 },
    summaryLabel: {
        fontFamily: Typography.fontFamily.semiBold, fontSize: 11,
        color: Colors.textMuted, textTransform: 'uppercase', marginBottom: 4,
    },
    summaryValueSmall: {
        fontFamily: Typography.fontFamily.black, fontSize: 18, color: Colors.secondary,
    },
    summaryArrow: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center', marginHorizontal: 8,
    },
    glBadge: {
        alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 8,
        borderRadius: 14,
    },
    glText: { fontFamily: Typography.fontFamily.extraBold, fontSize: 14 },
    // Scores
    scoresCard: {
        backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
        padding: Spacing.xl, borderWidth: 2, borderColor: Colors.inputBorder,
        marginBottom: Spacing.lg,
    },
    scoresCardTitle: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 16,
        color: Colors.secondary, marginBottom: 16,
    },
    scoreBarRow: { marginBottom: 16 },
    scoreBarHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 6,
    },
    scoreBarLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    scoreBarLabelText: {
        fontFamily: Typography.fontFamily.bold, fontSize: 13, color: Colors.secondary,
    },
    scoreValue: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 14, color: Colors.secondary,
    },
    scoreBarBg: {
        height: 8, backgroundColor: Colors.progressBg, borderRadius: 4, overflow: 'hidden',
    },
    scoreBarFill: { height: '100%', borderRadius: 4 },
    // Insight
    insightCard: {
        backgroundColor: Colors.secondary, borderRadius: BorderRadius.xl,
        padding: Spacing.xl, marginBottom: Spacing.lg,
    },
    insightHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10,
    },
    insightTitle: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 15, color: '#FFF',
    },
    insightText: {
        fontFamily: Typography.fontFamily.medium, fontSize: 14,
        color: '#94A3B8', lineHeight: 21,
    },
    learnings: { marginTop: 16 },
    learningsTitle: {
        fontFamily: Typography.fontFamily.bold, fontSize: 13,
        color: '#64748B', marginBottom: 8,
    },
    learningItem: {
        flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6,
    },
    learningDot: {
        width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.neonGreen,
    },
    learningText: {
        fontFamily: Typography.fontFamily.semiBold, fontSize: 13, color: '#CBD5E1',
    },
    // Achievements
    achievementsCard: {
        backgroundColor: Colors.white, borderRadius: BorderRadius.xl,
        padding: Spacing.xl, borderWidth: 2, borderColor: Colors.inputBorder,
        marginBottom: Spacing.xl,
    },
    achievementsTitle: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 16,
        color: Colors.secondary, marginBottom: 14,
    },
    achieveRow: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.inputBorder,
    },
    achieveIconWrapper: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: Colors.inputBorder,
    },
    achieveName: {
        fontFamily: Typography.fontFamily.bold, fontSize: 14, color: Colors.secondary,
    },
    achieveDesc: {
        fontFamily: Typography.fontFamily.medium, fontSize: 12, color: Colors.textMuted,
    },
    earnedBadge: {
        backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 8,
    },
    earnedText: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 11, color: '#16A34A',
    },
    // Actions
    actions: { gap: 12 },
    actionBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        height: 56, borderRadius: 28, gap: 8,
        borderWidth: 3, borderColor: Colors.secondary,
    },
    actionBtnText: {
        fontFamily: Typography.fontFamily.extraBold, fontSize: 16, color: '#FFF',
    },
    actionRow: { flexDirection: 'row', gap: 12 },
    secondaryBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        height: 48, borderRadius: 24, gap: 6,
        backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.inputBorder,
    },
    secondaryBtnText: {
        fontFamily: Typography.fontFamily.bold, fontSize: 14, color: Colors.secondary,
    },
});
