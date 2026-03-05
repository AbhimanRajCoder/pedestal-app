import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';
import { ArrowLeft, Trophy, Medal, Star, Shield, Flame } from 'lucide-react-native';

const LEADERBOARD_DATA = [
    { id: '1', name: 'Abhiman', xp: 2450, rank: 1, avatar: 'AR', color: '#3B82F6', badge: <Trophy size={18} color="#F59E0B" fill="#F59E0B" /> },
    { id: '2', name: 'Yasir', xp: 2100, rank: 2, avatar: 'YA', color: '#10B981', badge: <Medal size={18} color="#94A3B8" fill="#94A3B8" /> },
    { id: '3', name: 'Manas', xp: 1850, rank: 3, avatar: 'MA', color: '#8B5CF6', badge: <Medal size={18} color="#D97706" fill="#D97706" /> },
    { id: '4', name: 'Rohan', xp: 1240, rank: 4, avatar: 'RO', color: '#F43F5E', badge: <Star size={16} color={Colors.textMuted} /> },
    { id: '5', name: 'Priya', xp: 980, rank: 5, avatar: 'PR', color: '#F59E0B', badge: <Star size={16} color={Colors.textMuted} /> },
];

export default function LeaderboardScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const slideAnim = useRef(new Animated.Value(50)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
        ]).start();
    }, []);

    const renderTopPlayer = (player: typeof LEADERBOARD_DATA[0], position: 'left' | 'center' | 'right') => {
        const isFirst = player.rank === 1;
        const h = isFirst ? 140 : 110;
        const mt = isFirst ? 0 : 30;

        return (
            <View style={[styles.topPlayerWrap, { marginTop: mt }]}>
                <View style={[styles.topAvatar, { backgroundColor: player.color, borderColor: isFirst ? '#F59E0B' : Colors.secondary }]}>
                    <Text style={styles.topAvatarText}>{player.avatar}</Text>
                    {isFirst && (
                        <View style={styles.crownBadge}>
                            <Trophy size={12} color="#FFF" />
                        </View>
                    )}
                </View>
                <Text style={styles.topName} numberOfLines={1}>{player.name}</Text>
                <Text style={styles.topXp}>{player.xp} XP</Text>

                <View style={[styles.podiumPlatform, { height: h, backgroundColor: player.color + '20' }]}>
                    <Text style={[styles.podiumRank, { color: player.color }]}>{player.rank}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={Colors.secondary} strokeWidth={2.5} />
                </Pressable>
                <Text style={styles.title}>Leaderboard</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                    {/* Podium Section */}
                    <View style={styles.podiumContainer}>
                        {renderTopPlayer(LEADERBOARD_DATA[1], 'left')}
                        {renderTopPlayer(LEADERBOARD_DATA[0], 'center')}
                        {renderTopPlayer(LEADERBOARD_DATA[2], 'right')}
                    </View>

                    <View style={styles.leagueBanner}>
                        <Shield size={20} color="#8B5CF6" fill="#8B5CF6" />
                        <Text style={styles.leagueText}>Diamond League</Text>
                    </View>

                    <Text style={styles.sectionTitle}>Top Learning</Text>

                    {/* Rest of the list */}
                    <View style={styles.listContainer}>
                        {LEADERBOARD_DATA.map((player) => (
                            <View key={player.id} style={[styles.listCard, player.rank <= 3 && styles.listCardTop]}>
                                <Text style={styles.rankNum}>{player.rank}</Text>
                                <View style={[styles.listAvatar, { backgroundColor: player.color }]}>
                                    <Text style={styles.listAvatarText}>{player.avatar}</Text>
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={styles.listName}>{player.name}</Text>
                                    <View style={styles.fireRow}>
                                        <Flame size={12} color={Colors.streak} fill={Colors.streak} />
                                        <Text style={styles.listXp}>{player.xp} XP</Text>
                                    </View>
                                </View>
                                <View style={styles.badgeWrap}>
                                    {player.badge}
                                </View>
                            </View>
                        ))}
                    </View>

                </Animated.View>
                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.secondary, alignItems: 'center', justifyContent: 'center' },
    title: { fontFamily: Typography.fontFamily.extraBold, fontSize: 24, color: Colors.secondary, marginLeft: 16 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    podiumContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', height: 260, marginBottom: 20, gap: 8 },
    topPlayerWrap: { flex: 1, alignItems: 'center' },
    topAvatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, alignItems: 'center', justifyContent: 'center', marginBottom: 8, zIndex: 2 },
    topAvatarText: { fontFamily: Typography.fontFamily.extraBold, fontSize: 18, color: '#FFF' },
    crownBadge: { position: 'absolute', top: -14, backgroundColor: '#F59E0B', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.background },
    topName: { fontFamily: Typography.fontFamily.bold, fontSize: 13, color: Colors.secondary, marginBottom: 2 },
    topXp: { fontFamily: Typography.fontFamily.bold, fontSize: 11, color: Colors.textMuted, marginBottom: 10 },
    podiumPlatform: { width: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16, alignItems: 'center', paddingTop: 12, borderWidth: 2, borderColor: Colors.background, borderBottomWidth: 0 },
    podiumRank: { fontFamily: Typography.fontFamily.black, fontSize: 28, opacity: 0.5 },
    leagueBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#8B5CF6' + '15', paddingVertical: 12, borderRadius: 16, marginBottom: 24, borderWidth: 2, borderColor: '#8B5CF6' + '30' },
    leagueText: { fontFamily: Typography.fontFamily.extraBold, fontSize: 16, color: '#8B5CF6', marginLeft: 8 },
    sectionTitle: { fontFamily: Typography.fontFamily.extraBold, fontSize: 18, color: Colors.secondary, marginBottom: 12 },
    listContainer: { gap: 10 },
    listCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 16, borderRadius: 20, borderWidth: 2, borderColor: Colors.inputBorder },
    listCardTop: { borderColor: Colors.secondary, borderWidth: 3 },
    rankNum: { fontFamily: Typography.fontFamily.black, fontSize: 16, color: Colors.secondary, width: 24 },
    listAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    listAvatarText: { fontFamily: Typography.fontFamily.bold, fontSize: 15, color: '#FFF' },
    listName: { fontFamily: Typography.fontFamily.bold, fontSize: 16, color: Colors.secondary, marginBottom: 2 },
    fireRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    listXp: { fontFamily: Typography.fontFamily.bold, fontSize: 12, color: Colors.textMuted },
    badgeWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.inputBorder },
});
