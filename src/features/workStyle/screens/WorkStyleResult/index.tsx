import {
  CommonActions,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppScreen from '@/components/layout/AppScreen';
import {
  WorkStyleDimension,
  resetWorkStyleTest,
} from '@/features/workStyle/api/workStyleApi';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
import {
  cardSurface,
  primaryButton,
  primaryButtonText,
  secondaryButton,
  secondaryButtonText,
} from '@/themes/ui';
import { RootStackParamList } from '@/types/navigation';

type Route = RouteProp<RootStackParamList, 'WorkStyleResult'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

const axisInsights: Record<
  WorkStyleDimension,
  { title: string; goodFit: string; watch: string }
> = {
  autonomy: {
    title: 'Autonomie',
    goodFit: 'Missions avec marge de décision, objectifs clairs et confiance.',
    watch: 'Risque de frustration si chaque étape est trop contrôlée.',
  },
  collaboration: {
    title: 'Collaboration',
    goodFit: 'Équipes soudées, échanges fréquents et décisions partagées.',
    watch: 'Un poste trop isolé peut vite perdre en énergie.',
  },
  pace: {
    title: 'Rythme',
    goodFit: 'Environnements vivants, priorités qui bougent et action rapide.',
    watch: 'À équilibrer avec des temps de recul pour éviter la dispersion.',
  },
  structure: {
    title: 'Structure',
    goodFit: 'Cadre lisible, méthodes, responsabilités et attentes explicites.',
    watch: 'Le flou durable ou les règles changeantes peuvent peser.',
  },
  variety: {
    title: 'Variété',
    goodFit:
      'Missions diversifiées, sujets nouveaux et apprentissage par projet.',
    watch: 'Attention aux postes très répétitifs ou trop spécialisés.',
  },
  human_contact: {
    title: 'Contact humain',
    goodFit: 'Relation, accompagnement, service, pédagogie ou coordination.',
    watch: 'Un rôle sans interaction peut sembler peu stimulant.',
  },
  mobility: {
    title: 'Terrain',
    goodFit:
      'Présence sur le terrain, déplacements, concret et observation directe.',
    watch: 'Un cadre 100% bureau peut manquer de concret.',
  },
  learning: {
    title: 'Progression',
    goodFit: 'Postes avec montée en compétence, feedback et évolution.',
    watch: 'À surveiller si le métier laisse peu de place à l’apprentissage.',
  },
};

function getDominantAxisInsights(topAxes: WorkStyleDimension[]) {
  return topAxes.slice(0, 3).map((axis) => axisInsights[axis]);
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {items.map((item) => (
        <View key={item} style={styles.listRow}>
          <View style={styles.dot} />
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export default function WorkStyleResultScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation<Nav>();
  const { result } = route.params;
  const dominantInsights = useMemo(
    () => getDominantAxisInsights(result.topAxes),
    [result.topAxes],
  );

  const handleRedo = async () => {
    await resetWorkStyleTest();
    navigation.navigate('WorkStyleIntro', { hasDraft: false });
  };

  return (
    <AppScreen>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>STYLE PROFESSIONNEL</Text>
            <Text style={styles.title}>{result.profile.title}</Text>
            <Text style={styles.subtitle}>{result.profile.description}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.cardTitle}>Ce que ça veut dire</Text>
            <Text style={styles.summaryText}>
              Ce résultat ne dit pas seulement ce que tu aimes faire. Il indique
              surtout le cadre dans lequel tu as le plus de chances d’être
              régulier, motivé et à l’aise.
            </Text>
            <View style={styles.tagList}>
              {result.topAxisLabels.map((axis) => (
                <View key={axis} style={styles.tag}>
                  <Text style={styles.tagText}>{axis}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>À rechercher dans un métier</Text>
            {dominantInsights.map((insight) => (
              <View key={insight.title} style={styles.insightRow}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <Text style={styles.insightText}>{insight.goodFit}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>À vérifier avant de choisir</Text>
            {dominantInsights.map((insight) => (
              <View key={insight.watch} style={styles.listRow}>
                <View style={styles.dot} />
                <Text style={styles.listText}>{insight.watch}</Text>
              </View>
            ))}
          </View>

          <ListSection
            title="Ce qui te porte"
            items={result.profile.strengths}
          />
          <ListSection
            title="Points d’attention"
            items={result.profile.cautions}
          />
          <ListSection
            title="Conseils concrets"
            items={result.profile.advice}
          />

          <View style={styles.crossSignalCard}>
            <Text style={styles.crossSignalTitle}>
              Pris en compte dans tes recommandations
            </Text>
            <Text style={styles.crossSignalText}>
              Matcha croise ce style avec ton auto-évaluation professionnelle,
              ton profil et tes interactions métiers. Il ne remplace pas le
              classement principal : il ajoute un signal de compatibilité sur
              les fiches métier et la comparaison.
            </Text>
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleRedo}>
            <Text style={styles.primaryButtonText}>Repasser le test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main', params: { screen: 'Home' } }],
                }),
              )
            }
          >
            <Text style={styles.secondaryButtonText}>Retour à l’accueil</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  hero: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    letterSpacing: 1.1,
    color: Colors.accent.strong,
  },
  title: {
    marginTop: 6,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '800',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  card: { ...cardSurface, borderRadius: 8, padding: 16 },
  summaryCard: {
    ...cardSurface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDEBE5',
  },
  cardTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
    marginBottom: 12,
  },
  tagList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    borderRadius: 999,
    backgroundColor: Colors.accent.soft,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
  },
  listRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginTop: 7,
    backgroundColor: Colors.accent.strong,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  insightRow: {
    borderRadius: 8,
    backgroundColor: Colors.ui.surfaceSoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  insightText: {
    marginTop: 3,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  crossSignalCard: {
    backgroundColor: Colors.accent.soft,
    borderRadius: 8,
    padding: 16,
  },
  crossSignalTitle: {
    fontSize: 15,
    fontWeight: '800',
    fontFamily: titleFontFamily,
    color: Colors.accent.strong,
  },
  crossSignalText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  primaryButton: { ...primaryButton },
  primaryButtonText: { ...primaryButtonText },
  secondaryButton: { ...secondaryButton },
  secondaryButtonText: { ...secondaryButtonText },
});
