import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';

import TestIntroLayout from '@/features/shared/TestIntroLayout';
import { BilanIntroMode, RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList, 'BilanIntro'>;
type IntroRoute = RouteProp<RootStackParamList, 'BilanIntro'>;

const flow = [
  'Tu réponds sans chercher la bonne réponse',
  'On consolide tes forces, tes valeurs et tes préférences',
  "Tu récupères une synthèse claire avec des pistes d'action",
];

const benefits = [
  { title: 'Forces clés', subtitle: 'Ce que tu mobilises naturellement' },
  { title: 'Valeurs', subtitle: 'Ce qui compte dans ton travail' },
  { title: 'Environnements', subtitle: 'Les contextes où tu progresses' },
  { title: 'Pistes métiers', subtitle: 'Des idées concrètes à explorer' },
];

export default function BilanIntroScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<IntroRoute>();
  const mode: BilanIntroMode = route.params?.mode ?? 'start';
  const isResume = mode === 'resume';

  return (
    <TestIntroLayout
      eyebrow={isResume ? 'Pour rappel' : 'Auto-évaluation professionnelle'}
      title={
        isResume
          ? 'Reprends là où tu en étais'
          : 'Prendre du recul, concrètement'
      }
      subtitle={
        isResume
          ? "Ton brouillon est enregistré. Relis l'essentiel, puis reprends quand tu veux."
          : "Une lecture structurée de ton profil professionnel pour comprendre ce qui te porte aujourd'hui."
      }
      stats={[
        { value: '~15 min', label: 'à ton rythme' },
        { value: 'Mixte', label: 'notes + réponses libres' },
        { value: 'Utile', label: 'synthèse actionnable' },
      ]}
      flowTitle={isResume ? undefined : 'Comment ça se passe'}
      flow={isResume ? [] : flow}
      benefitsTitle="Ce que tu récupères"
      benefits={benefits}
      noteTitle="À garder en tête"
      note="Cette auto-évaluation clarifie une direction. Elle sert à ouvrir des pistes, pas à t'enfermer dans une case."
      ctaLabel={
        isResume ? "Reprendre l'auto-évaluation" : "Commencer l'auto-évaluation"
      }
      onPress={() => navigation.navigate('BilanQuestions')}
    />
  );
}
