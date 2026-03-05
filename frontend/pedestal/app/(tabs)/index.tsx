import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Line } from 'react-native-svg';
import {
  Zap,
  BookOpen,
  PieChart,
  Search,
  Bell,
  EyeOff,
  Plus,
  Lock,
} from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, Typography } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

import { TrendingUp, Play, Trophy, Swords } from 'lucide-react-native';

const PORTFOLIO_VAL = 104250;
const PORTFOLIO_PL = 4250;

export default function DashboardScreen() {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const router = useRouter();

  useEffect(() => {
    // Bounce for the current node
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -6,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: Math.max(insets.top, 20) }
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Decorative Top Background (Cooper style curve inspiration) */}
      <View style={styles.topDecor} />

      {/* Header (Cooper + Neobank style) */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.profileChip}>
            <Zap size={16} color={Colors.white} strokeWidth={2.5} />
            <Text style={styles.profileChipText}>Pedestal 1.0</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>AR</Text>
            {/* Notification Dot */}
            <View style={styles.notificationDot} />
          </View>
        </View>

        <Text style={styles.greeting}>Hello Abhiman</Text>
        <Text style={styles.subGreeting}>Make your day easy with us</Text>
      </View>

      {/* Gen Z Brutalist Net Worth Section */}
      <View style={styles.netWorthCard}>
        <View style={styles.nwTopRow}>
          <Text style={styles.nwLabel}>VIRTUAL NET WORTH</Text>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        <Text style={styles.nwValue}>
          {'\u20B9'}{PORTFOLIO_VAL.toLocaleString('en-IN')}
        </Text>

        <View style={styles.nwBottomRow}>
          <View style={styles.plPill}>
            <TrendingUp size={16} color={Colors.neonGreen} strokeWidth={3} />
            <Text style={styles.plText}>+{'\u20B9'}{PORTFOLIO_PL.toLocaleString('en-IN')} (4.2%)</Text>
          </View>
          <Pressable style={styles.depositBtn}>
            <Plus size={18} color={Colors.white} strokeWidth={3} />
          </Pressable>
        </View>
      </View>

      {/* Bento Box Grid (Cooper style) */}
      <View style={styles.bentoGrid}>
        {/* Left Tall Card (Pastel Purple) */}
        <Pressable
          style={({ pressed }) => [styles.bentoLeft, pressed && { opacity: 0.9 }]}
          onPress={() => router.push('/simulator')}
        >
          <View style={styles.bentoIconWhite}>
            <Swords size={20} color={Colors.secondary} strokeWidth={2.5} />
          </View>
          <View style={styles.bentoLeftBottom}>
            <Text style={styles.bentoLeftTitle}>Market{'\n'}Arena</Text>
            <Text style={styles.bentoLeftSub}>Relive history</Text>
          </View>
          {/* Decorative faint sunburst could go here */}
        </Pressable>

        {/* Right Column */}
        <View style={styles.bentoRight}>
          {/* Top Right Card (Pastel Yellow) */}
          <Pressable
            style={({ pressed }) => [styles.bentoTopRight, pressed && { opacity: 0.9 }]}
            onPress={() => router.push('/streaks')}
          >
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>New</Text>
            </View>
            <View style={styles.bentoIconOutline}>
              <Zap size={20} color={Colors.secondary} strokeWidth={2.5} />
            </View>
            <Text style={styles.bentoSmallTitle}>Streaks</Text>
          </Pressable>

          {/* Bottom Right Card (Dark/Black) */}
          <Pressable
            style={({ pressed }) => [styles.bentoBottomRight, pressed && { opacity: 0.9 }]}
            onPress={() => router.push('/leaderboard')}
          >
            <View style={styles.bentoIconDarkOutline}>
              <Trophy size={20} color={Colors.white} strokeWidth={2.5} />
            </View>
            <Text style={styles.bentoDarkTitle}>Leader{'\n'}board</Text>
          </Pressable>
        </View>
      </View>

      {/* Daily Check-in Banner */}
      <Pressable
        style={({ pressed }) => [styles.learnBanner, styles.dailyCheckinBanner, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
        onPress={() => router.push('/daily-checkin')}
      >
        <View style={styles.learnBannerLeft}>
          <Text style={styles.learnBannerEmoji}>🌙</Text>
          <View>
            <Text style={[styles.learnBannerTitle, { color: Colors.white }]}>9 PM Check-in</Text>
            <Text style={[styles.learnBannerSub, { color: 'rgba(255,255,255,0.7)' }]}>Reflect on today's spending</Text>
          </View>
        </View>
        <View style={[styles.learnBannerBtn, { backgroundColor: Colors.white, borderColor: Colors.white }]}>
          <Text style={[styles.learnBannerBtnText, { color: Colors.primary }]}>GO</Text>
        </View>
      </Pressable>


      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Continue Learning</Text>
      </View>

      {/* Duolingo Style Resume Card */}
      <Pressable
        style={({ pressed }) => [styles.resumeCard, pressed && { transform: [{ scale: 0.97 }] }]}
        onPress={() => router.push('/learn/roadmap')}
      >
        <View style={styles.resumeCardInner}>
          <View style={styles.resumeTop}>
            <View style={styles.resumeIconWrap}>
              <Text style={{ fontSize: 32 }}>📈</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.resumeChap}>CHAPTER 2</Text>
              <Text style={styles.resumeTitle}>Stock Market Basics</Text>
              <View style={styles.progressBarWrap}>
                <View style={[styles.progressBarFill, { width: '40%' }]} />
              </View>
            </View>
          </View>

          <View style={styles.resumeBottom}>
            <Animated.View style={[styles.resumeBtn, { transform: [{ translateY: bounceAnim }] }]}>
              <Play size={20} color="#FFF" fill="#FFF" />
              <Text style={styles.resumeBtnText}>RESUME</Text>
            </Animated.View>
          </View>
        </View>
      </Pressable>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },
  topDecor: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.purpleLight,
    opacity: 0.6,
  },
  // Header
  header: {
    marginBottom: Spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  profileChipText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 14,
    color: Colors.white,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.pastelYellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: Typography.fontFamily.extraBold,
    fontSize: 16,
    color: Colors.secondary,
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    backgroundColor: Colors.error,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: Colors.background,
  },
  greeting: {
    fontFamily: Typography.fontFamily.extraBold,
    fontSize: 34,
    color: Colors.secondary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subGreeting: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  // Net Worth Card (Gen Z Brutalist)
  netWorthCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 24,
    padding: 24,
    marginBottom: Spacing.xxxl,
    borderWidth: 4,
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  nwTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nwLabel: {
    fontFamily: Typography.fontFamily.extraBold,
    fontSize: 13,
    color: '#A1A1AA',
    letterSpacing: 1.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.neonGreen,
  },
  liveText: {
    fontFamily: Typography.fontFamily.black,
    fontSize: 10,
    color: Colors.neonGreen,
  },
  nwValue: {
    fontFamily: Typography.fontFamily.black,
    fontSize: 42,
    color: Colors.white,
    letterSpacing: -1.5,
    marginBottom: 20,
  },
  nwBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  plText: {
    fontFamily: Typography.fontFamily.black,
    fontSize: 14,
    color: Colors.neonGreen,
  },
  depositBtn: {
    backgroundColor: Colors.neonGreen,
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  // Bento Box Grid
  bentoGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    height: 240,
    marginBottom: Spacing.xxxl,
  },
  bentoLeft: {
    flex: 1,
    backgroundColor: Colors.pastelPurple,
    borderRadius: 32,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  bentoIconWhite: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoLeftBottom: {
    gap: 4,
  },
  bentoLeftTitle: {
    fontFamily: Typography.fontFamily.extraBold,
    fontSize: 22,
    color: Colors.secondary,
    lineHeight: 26,
  },
  bentoLeftSub: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: 14,
    color: '#8A7BB3', // Slightly darker purple
  },
  bentoRight: {
    flex: 1,
    gap: Spacing.md,
  },
  bentoTopRight: {
    flex: 1,
    backgroundColor: Colors.pastelYellow,
    borderRadius: 32,
    padding: Spacing.lg,
    justifyContent: 'space-between',
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.pastelRed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 12,
    color: Colors.white,
  },
  bentoIconOutline: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoSmallTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
    color: Colors.secondary,
  },
  bentoBottomRight: {
    flex: 1,
    backgroundColor: Colors.darkCard,
    borderRadius: 32,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  bentoIconDarkOutline: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bentoDarkTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
    color: Colors.white,
    lineHeight: 22,
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 18,
    color: Colors.secondary,
  },
  seeAll: {
    fontFamily: Typography.fontFamily.semiBold,
    fontSize: 14,
    color: '#999',
  },
  // Duolingo Style Resume Card
  resumeCard: {
    width: '100%',
    backgroundColor: Colors.white,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: Colors.inputBorder,
    borderBottomWidth: 8, // Brutalist bottom shadow effect
    marginBottom: Spacing.xxl,
  },
  resumeCardInner: {
    padding: 24,
  },
  resumeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  resumeIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.pastelPurple,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  resumeChap: {
    fontFamily: Typography.fontFamily.extraBold,
    fontSize: 12,
    color: Colors.streak,
    letterSpacing: 1,
    marginBottom: 4,
  },
  resumeTitle: {
    fontFamily: Typography.fontFamily.black,
    fontSize: 20,
    color: Colors.secondary,
    marginBottom: 10,
  },
  progressBarWrap: {
    width: '100%',
    height: 12,
    backgroundColor: Colors.inputBorder,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.streak,
    borderRadius: 6,
  },
  resumeBottom: {
    width: '100%',
  },
  resumeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    height: 56,
    borderRadius: 16,
    gap: 10,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  resumeBtnText: {
    fontFamily: Typography.fontFamily.black,
    fontSize: 16,
    color: Colors.white,
    letterSpacing: 1,
  },
  // Learning CTA Banner
  learnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 18,
    marginBottom: Spacing.xxxl,
    borderWidth: 3,
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  dailyCheckinBanner: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  learnBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  learnBannerEmoji: { fontSize: 32 },
  learnBannerTitle: {
    fontFamily: Typography.fontFamily.black,
    fontSize: 18,
    color: Colors.secondary,
    letterSpacing: -0.5,
  },
  learnBannerSub: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  learnBannerBtn: {
    backgroundColor: Colors.secondary,
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  learnBannerBtnText: {
    fontFamily: Typography.fontFamily.black,
    fontSize: 14,
    color: Colors.neonGreen,
    letterSpacing: 1,
  },
});
