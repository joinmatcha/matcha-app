import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import TestIntroLayout from '@/features/shared/TestIntroLayout';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'WorkStyleIntro'>;
type IntroRoute = RouteProp<RootStackParamList, 'WorkStyleIntro'>;

const flow = [
  'Tu réponds à 16 situations concrètes',
  'On identifie ton cadre de travail idéal',
  'On l’ajoute comme signal dans tes recommandations métier',
];

const benefits = [
  { title: 'Profil', subtitle: 'Ton style principal' },
  { title: 'Axes forts', subtitle: 'Ce qui facilite ton énergie' },
  { title: 'Points à vérifier', subtitle: 'Les contextes moins naturels' },
  { title: 'Métiers', subtitle: 'Un signal croisé avec tes pistes' },
];

export default function WorkStyleIntroScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<IntroRoute>();
  const hasDraft = !!route.params?.hasDraft;

  return (
    <TestIntroLayout
      eyebrow={hasDraft ? 'Pour rappel' : 'Style professionnel'}
      title={
        hasDraft ? "Reprends où tu t'es arrêté" : 'Ton cadre de travail idéal'
      }
      subtitle={
        hasDraft
          ? 'Ton brouillon est enregistré. Tu peux continuer sans perdre tes réponses.'
          : 'Un test court pour comprendre les environnements dans lesquels tu avances avec le plus d’énergie.'
      }
      stats={[
        { value: '16', label: 'questions' },
        { value: '~2 min', label: 'à ton rythme' },
        { value: 'Profil', label: 'indicatif' },
      ]}
      flowTitle={hasDraft ? undefined : 'Comment ça marche'}
      flow={hasDraft ? [] : flow}
      benefitsTitle="Ce que tu récupères"
      benefits={benefits}
      noteTitle="Pourquoi c’est utile"
      note="Ton résultat est croisé avec ton profil, ton auto-évaluation et tes métiers favoris pour mieux lire les fiches métier."
      ctaLabel={hasDraft ? 'Reprendre le test' : 'Commencer le test'}
      onPress={() => navigation.navigate('WorkStyleQuestions')}
    />
  );
}
