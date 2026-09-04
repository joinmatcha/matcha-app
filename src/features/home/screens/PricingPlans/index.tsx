import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppScreen from '@/components/layout/AppScreen';
import { useAuth } from '@/hooks/useAuth';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  labelFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { Subscription, normalizeSubscription } from '@/utils/subscription';

const INK = '#101820';
const HOME_ACCENT = '#00513A';

type Plan = {
  name: string;
  badge: string;
  price: string;
  subtitle: string;
  tone: 'free' | 'complete';
  subscription: Subscription;
  features: string[];
};

const plans: Plan[] = [
  {
    name: 'Free',
    badge: 'Pour commencer',
    price: '0 €',
    subtitle: 'Les bases pour découvrir Matcha sans engagement.',
    tone: 'free',
    subscription: 'free',
    features: [
      'Test de personnalité inclus',
      '10 likes par jour sur les métiers',
      'Accès au swipe métier',
    ],
  },
  {
    name: 'Pass Complet',
    badge: 'Achat unique',
    price: '39 €',
    subtitle: 'Tout débloquer une fois, sans abonnement.',
    tone: 'complete',
    subscription: 'premium',
    features: [
      'Tous les tests Matcha débloqués',
      'Profil Matcha complet',
      'Matching métier consolidé',
      '20 likes par jour sur les métiers',
    ],
  },
];

const premiumBenefits = [
  'Tous les tests Matcha sont débloqués',
  'Ton profil Matcha complet reste accessible',
  'Le matching métier consolidé est disponible',
  'Tu disposes de 20 likes par jour sur les métiers',
];

function PlanCard({
  currentSubscription,
  plan,
}: {
  currentSubscription: Subscription;
  plan: Plan;
}) {
  const isComplete = plan.tone === 'complete';
  const isCurrent = plan.subscription === currentSubscription;

  return (
    <View
      style={[
        styles.planCard,
        isComplete && styles.planCardComplete,
        isCurrent && styles.planCardCurrent,
      ]}
    >
      <View style={styles.planHeader}>
        <View>
          <View style={styles.badgeRow}>
            <Text style={[styles.planBadge, isComplete && styles.completeText]}>
              {plan.badge}
            </Text>
            {isCurrent ? (
              <View
                style={[
                  styles.currentBadge,
                  isComplete && styles.currentBadgeComplete,
                ]}
              >
                <Text
                  style={[
                    styles.currentBadgeText,
                    isComplete && styles.currentBadgeTextComplete,
                  ]}
                >
                  Plan actif
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.planName}>{plan.name}</Text>
        </View>
        <View style={[styles.pricePill, isComplete && styles.pricePillDark]}>
          <Text style={[styles.priceText, isComplete && styles.priceTextDark]}>
            {plan.price}
          </Text>
        </View>
      </View>

      <Text style={styles.planSubtitle}>{plan.subtitle}</Text>

      <View style={styles.featureList}>
        {plan.features.map((feature) => (
          <View key={feature} style={styles.featureRow}>
            <MaterialIcons
              name="check-circle"
              size={18}
              color={isComplete ? HOME_ACCENT : Colors.text.muted}
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PremiumStatus() {
  return (
    <>
      <View style={styles.activePassCard}>
        <View style={styles.activeIcon}>
          <MaterialIcons name="workspace-premium" size={34} color="#7A5A0A" />
        </View>
        <Text style={styles.activeEyebrow}>PASS COMPLET ACTIF</Text>
        <Text style={styles.activeTitle}>Ton accès est débloqué à vie</Text>
        <Text style={styles.activeText}>
          Ton achat unique est associé à ton compte. Tu gardes les tests
          avancés, le profil Matcha complet et le quota élargi sans abonnement.
        </Text>
      </View>

      <View style={styles.benefitsCard}>
        <Text style={styles.benefitsTitle}>Inclus dans ton Pass</Text>
        <View style={styles.featureList}>
          {premiumBenefits.map((benefit) => (
            <View key={benefit} style={styles.featureRow}>
              <MaterialIcons
                name="check-circle"
                size={18}
                color={HOME_ACCENT}
              />
              <Text style={styles.featureText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}

export default function PricingPlansScreen() {
  const { user, refreshUser } = useAuth();
  const currentSubscription = normalizeSubscription(user?.subscription);
  const hasPremiumAccess = currentSubscription === 'premium';

  useFocusEffect(
    React.useCallback(() => {
      refreshUser();
    }, [refreshUser]),
  );

  return (
    <AppScreen>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>PLANS MATCHA</Text>
            <Text style={styles.title}>
              {hasPremiumAccess
                ? 'Ton Pass Complet est actif'
                : 'Choisir le bon niveau d’accès'}
            </Text>
            <Text style={styles.subtitle}>
              {hasPremiumAccess
                ? 'Tu profites déjà de l’accès complet Matcha, sans limite de durée.'
                : 'Free garde l’essentiel pour démarrer. Le Pass Complet débloque toutes les analyses et plus de swipes quotidiens.'}
            </Text>
          </View>

          {hasPremiumAccess ? (
            <PremiumStatus />
          ) : (
            <>
              <View style={styles.planStack}>
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.name}
                    currentSubscription={currentSubscription}
                    plan={plan}
                  />
                ))}
              </View>

              <View style={styles.noteCard}>
                <View style={styles.noteIcon}>
                  <MaterialIcons
                    name="verified-user"
                    size={22}
                    color={HOME_ACCENT}
                  />
                </View>
                <View style={styles.noteCopy}>
                  <Text style={styles.noteTitle}>Accès lié à ton compte</Text>
                  <Text style={styles.noteText}>
                    Ton plan actif est appliqué automatiquement dans l’app. Les
                    fonctionnalités Premium deviennent accessibles dès que ton
                    compte passe en Pass Complet.
                  </Text>
                </View>
              </View>
            </>
          )}

          {hasPremiumAccess ? (
            <View style={styles.noteCard}>
              <View style={styles.noteIcon}>
                <MaterialIcons
                  name="verified-user"
                  size={22}
                  color={HOME_ACCENT}
                />
              </View>
              <View style={styles.noteCopy}>
                <Text style={styles.noteTitle}>Rien à renouveler</Text>
                <Text style={styles.noteText}>
                  Le Pass Complet est un achat unique. Tu conserves cet accès
                  tant que ton compte Matcha existe.
                </Text>
              </View>
            </View>
          ) : null}

          <View style={styles.futureCard}>
            <Text style={styles.futureLabel}>Plus tard</Text>
            <Text style={styles.futureTitle}>Un abonnement mensuel</Text>
            <Text style={styles.futureText}>
              Il pourra regrouper les formations, les offres d’emploi et les
              services récurrents quand ces fonctionnalités seront ajoutées.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 46,
  },
  hero: {
    marginBottom: 18,
  },
  eyebrow: {
    marginBottom: 8,
    fontSize: 13,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  title: {
    maxWidth: 330,
    fontSize: 30,
    lineHeight: 36,
    fontFamily: titleFontFamily,
    color: INK,
  },
  subtitle: {
    marginTop: 12,
    maxWidth: 330,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  planStack: {
    gap: 14,
  },
  planCard: {
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.accent.border,
  },
  planCardComplete: {
    backgroundColor: '#F7E7B2',
    borderColor: '#E6CE7B',
  },
  planCardCurrent: {
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  badgeRow: {
    minHeight: 22,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 7,
    marginBottom: 6,
  },
  planBadge: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: labelFontFamily,
    color: Colors.text.muted,
  },
  completeText: {
    color: '#7A5A0A',
  },
  currentBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EEF4F0',
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.16)',
  },
  currentBadgeComplete: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(122,90,10,0.18)',
  },
  currentBadgeText: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: labelFontFamily,
    color: HOME_ACCENT,
  },
  currentBadgeTextComplete: {
    color: '#7A5A0A',
  },
  planName: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: titleFontFamily,
    color: INK,
  },
  pricePill: {
    minWidth: 74,
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: Colors.ui.surfaceSoft,
  },
  pricePillDark: {
    backgroundColor: HOME_ACCENT,
  },
  priceText: {
    fontSize: 18,
    fontFamily: titleFontFamily,
    color: HOME_ACCENT,
  },
  priceTextDark: {
    color: '#FFFFFF',
  },
  planSubtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  featureList: {
    marginTop: 16,
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: INK,
  },
  activePassCard: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'flex-start',
    backgroundColor: '#F7E7B2',
    borderWidth: 1,
    borderColor: '#E6CE7B',
  },
  activeIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(122,90,10,0.18)',
  },
  activeEyebrow: {
    fontSize: 12,
    lineHeight: 15,
    fontFamily: labelFontFamily,
    color: '#7A5A0A',
  },
  activeTitle: {
    marginTop: 8,
    fontSize: 28,
    lineHeight: 34,
    fontFamily: titleFontFamily,
    color: INK,
  },
  activeText: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: bodyFontFamily,
    color: INK,
  },
  benefitsCard: {
    marginTop: 14,
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.accent.border,
  },
  benefitsTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontFamily: titleFontFamily,
    color: INK,
  },
  noteCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#EEF4F0',
    borderWidth: 1,
    borderColor: 'rgba(0,81,58,0.12)',
  },
  noteIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  noteCopy: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontFamily: titleFontFamily,
    color: INK,
  },
  noteText: {
    marginTop: 5,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  futureCard: {
    marginTop: 14,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.ui.surfaceSoft,
  },
  futureLabel: {
    fontSize: 12,
    fontFamily: labelFontFamily,
    color: Colors.text.muted,
  },
  futureTitle: {
    marginTop: 6,
    fontSize: 20,
    lineHeight: 25,
    fontFamily: titleFontFamily,
    color: INK,
  },
  futureText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
});
