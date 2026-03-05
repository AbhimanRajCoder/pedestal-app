import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Flame, Calendar, Trophy, ChevronRight } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SW } = Dimensions.get('window');
const STORAGE_KEY = 'pedestal_checkin_streak';

export default function StreakScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [streak, setStreak] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const flameScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const data = JSON.parse(raw);
                    // Force a minimum mock streak if user hasn't started yet
                    setStreak(data.streak > 4 ? data.streak : 4);
                } else {
                    setStreak(4); // Hardcoded mock value
                }
            } catch {
                setStreak(4);
            }
        })();

        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(flameScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
        ]).start();
    }, []);

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Mock data for the current week's completion
    const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday
    const adjustedCurrentDay = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={Colors.secondary} strokeWidth={2.5} />
                </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>

                    {/* Big Flame Element */}
                    <Text style={styles.streakTitle}>Your Streak</Text>

                    <Animated.View style={[styles.flameCircle, { transform: [{ scale: flameScale }] }]}>
                        <Flame size={72} color={Colors.streak} fill={Colors.streak} strokeWidth={2} />
                        <View style={styles.streakBadge}>
                            <Text style={styles.streakBadgeNum}>{streak}</Text>
                        </View>
                    </Animated.View>

                    <Text style={styles.streakDesc}>
                        You're on a {streak}-day learning streak! Keep checking in to multiply your XP.
                    </Text>

                    {/* Weekly Calendar */}
                    <View style={styles.calendarCard}>
                        <View style={styles.calHeader}>
                            <Calendar size={18} color={Colors.secondary} strokeWidth={2.5} />
                            <Text style={styles.calTitle}>This Week</Text>
                        </View>

                        <View style={styles.weekRow}>
                            {weekDays.map((day, idx) => {
                                // Simple mock: marked completed if idx <= currentDay (and we have at least that much streak)
                                const isCompleted = idx <= adjustedCurrentDay && streak > 0;
                                const isToday = idx === adjustedCurrentDay;

                                return (
                                    <View key={day} style={styles.dayCol}>
                                        <Text style={[styles.dayText, isToday && { color: Colors.secondary, fontFamily: Typography.fontFamily.extraBold }]}>{day}</Text>
                                        <View style={[
                                            styles.dayCircle,
                                            isCompleted ? { backgroundColor: Colors.streak, borderColor: Colors.streak } : {}
                                        ]}>
                                            {isCompleted && <Flame size={14} color="#FFF" fill="#FFF" />}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Streak Freeze & Info */}
                    <View style={styles.infoCard}>
                        <View style={styles.infoLeft}>
                            <View style={styles.infoIconBox}>
                                <Text style={{ fontSize: 24 }}>❄️</Text>
                            </View>
                            <View>
                                <Text style={styles.infoTitle}>Streak Freeze</Text>
                                <Text style={styles.infoSub}>Protect your streak for 1 missed day</Text>
                            </View>
                        </View>
                        <Pressable style={styles.equipBtn}>
                            <Text style={styles.equipBtnText}>Get</Text>
                        </Pressable>
                    </View>

                    <Text style={styles.milestoneTitle}>Milestones</Text>

                    {[7, 30, 100].map(target => {
                        const isReached = streak >= target;
                        const pct = Math.min(100, Math.round((streak / target) * 100));

                        return (
                            <View key={target} style={[styles.milestoneCard, isReached && { borderColor: Colors.neonGreen, backgroundColor: Colors.white }]}>
                                <View style={styles.milestoneTop}>
                                    <View style={[styles.targetBox, isReached && { backgroundColor: Colors.neonGreen }]}>
                                        <Trophy size={16} color={isReached ? '#FFF' : Colors.textMuted} />
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text style={[styles.targetLabel, isReached && { color: Colors.secondary }]}>{target} Day Streak</Text>
                                        <Text style={styles.targetStatus}>{isReached ? 'Completed!' : `${streak} / ${target} days`}</Text>
                                    </View>
                                    {!isReached && <Text style={styles.percentage}>{pct}%</Text>}
                                </View>
                                {!isReached && (
                                    <View style={styles.progressWrap}>
                                        <View style={[styles.progressFill, { width: `${pct}%` }]} />
                                    </View>
                                )}
                            </View>
                        );
                    })}

                </Animated.View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { paddingHorizontal: 20, marginBottom: 10 },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    streakTitle: { fontFamily: Typography.fontFamily.black, fontSize: 26, color: Colors.secondary, marginBottom: 30 },

    flameCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#FFEDD5', borderWidth: 4, borderColor: Colors.streak, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowColor: Colors.streak, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 10 },
    streakBadge: { position: 'absolute', bottom: -12, backgroundColor: Colors.streak, paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20, borderWidth: 3, borderColor: Colors.white },
    streakBadgeNum: { fontFamily: Typography.fontFamily.black, fontSize: 18, color: Colors.white },
    streakDesc: { fontFamily: Typography.fontFamily.bold, fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginHorizontal: 20, marginBottom: 40, lineHeight: 22 },

    calendarCard: { width: '100%', backgroundColor: Colors.white, borderRadius: 24, padding: 20, borderWidth: 2, borderColor: Colors.inputBorder, marginBottom: 24 },
    calHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
    calTitle: { fontFamily: Typography.fontFamily.extraBold, fontSize: 16, color: Colors.secondary },
    weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
    dayCol: { alignItems: 'center', gap: 8 },
    dayText: { fontFamily: Typography.fontFamily.bold, fontSize: 13, color: Colors.textMuted },
    dayCircle: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: Colors.inputBorder, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },

    infoCard: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E0F2FE', padding: 16, borderRadius: 20, borderWidth: 2, borderColor: '#BAE6FD', marginBottom: 32 },
    infoLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    infoIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center' },
    infoTitle: { fontFamily: Typography.fontFamily.extraBold, fontSize: 15, color: '#0369A1', marginBottom: 2 },
    infoSub: { fontFamily: Typography.fontFamily.medium, fontSize: 12, color: '#0284C7', paddingRight: 20 },
    equipBtn: { backgroundColor: Colors.white, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 2, borderColor: '#BAE6FD' },
    equipBtnText: { fontFamily: Typography.fontFamily.extraBold, fontSize: 13, color: '#0369A1' },

    milestoneTitle: { fontFamily: Typography.fontFamily.extraBold, fontSize: 20, color: Colors.secondary, alignSelf: 'flex-start', marginBottom: 16 },
    milestoneCard: { width: '100%', backgroundColor: Colors.background, borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 2, borderColor: Colors.inputBorder },
    milestoneTop: { flexDirection: 'row', alignItems: 'center' },
    targetBox: { width: 44, height: 44, borderRadius: 14, backgroundColor: Colors.inputBorder, alignItems: 'center', justifyContent: 'center' },
    targetLabel: { fontFamily: Typography.fontFamily.extraBold, fontSize: 15, color: Colors.textSecondary },
    targetStatus: { fontFamily: Typography.fontFamily.bold, fontSize: 13, color: Colors.textMuted, marginTop: 4 },
    percentage: { fontFamily: Typography.fontFamily.extraBold, fontSize: 14, color: Colors.secondary },
    progressWrap: { width: '100%', height: 8, backgroundColor: Colors.inputBorder, borderRadius: 4, marginTop: 16 },
    progressFill: { height: '100%', backgroundColor: Colors.streak, borderRadius: 4 },
});
