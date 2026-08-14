import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import TestIntroLayout from '@/features/shared/TestIntroLayout';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'PersonalityIntro'>;
type IntroRoute = RouteProp<RootStackParamList, 'PersonalityIntro'>;

const flow = [
  'Tu réponds vite et spontanément',
  'On calcule ton profil dominant',
  'Tu obtiens des pistes métier claires',
];

const benefits = [
  { title: 'Ton type', subtitle: 'Un profil lisible' },
  { title: 'Tes forces', subtitle: 'Ce qui te porte' },
  { title: "Points d'attention", subtitle: 'Ce à quoi faire attention' },
  { title: 'Métiers cibles', subtitle: 'Des pistes concrètes' },
];

export default function PersonalityIntroScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<IntroRoute>();
  const hasDraft = !!route.params?.hasDraft;

  return (
    <TestIntroLayout
      eyebrow={hasDraft ? 'Pour rappel' : 'Test de personnalité'}
      title={hasDraft ? "Reprends où tu t'es arrêté" : 'Mieux te connaître'}
      subtitle={
        hasDraft
          ? "Ton brouillon est enregistré. Relis l'essentiel, puis continue."
          : 'Un test court pour comprendre ton style, ton énergie et les environnements qui te correspondent.'
      }
      stats={[
        { value: '24', label: 'questions' },
        { value: '~3 min', label: 'à ton rythme' },
        { value: 'Profil', label: 'indicatif' },
      ]}
      flowTitle={hasDraft ? undefined : 'Comment ça marche'}
      flow={hasDraft ? [] : flow}
      benefitsTitle="Ce que tu récupères"
      benefits={benefits}
      noteTitle="À garder en tête"
      note="Résultat indicatif: utile pour te guider, pas pour t'enfermer."
      ctaLabel={hasDraft ? 'Reprendre le test' : 'Commencer le test'}
      onPress={() => navigation.navigate('PersonalityTest')}
    />
  );
}
