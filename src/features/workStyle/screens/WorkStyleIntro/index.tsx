import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import TestIntroLayout from '@/features/shared/TestIntroLayout';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'WorkStyleIntro'>;

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

  return (
    <TestIntroLayout
      eyebrow="Style professionnel"
      title="Ton cadre de travail idéal"
      subtitle="Un test court pour comprendre les environnements dans lesquels tu avances avec le plus d’énergie."
      stats={[
        { value: '16', label: 'questions' },
        { value: '~2 min', label: 'à ton rythme' },
        { value: '0', label: 'bonne réponse' },
      ]}
      flowTitle="Comment ça marche"
      flow={flow}
      benefitsTitle="Ce que tu récupères"
      benefits={benefits}
      noteTitle="Pourquoi c’est utile"
      note="Ton résultat est croisé avec ton profil, ton auto-évaluation et tes métiers favoris pour mieux lire les fiches métier."
      ctaLabel="Commencer le test"
      onPress={() => navigation.navigate('WorkStyleQuestions')}
    />
  );
}
