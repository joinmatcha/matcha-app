import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BilanIntroScreen from '@/screens/BilanIntro';
import BilanQuestionsScreen from '@/screens/BilanQuestions';
import BilanResultScreen from '@/screens/BilanResult';
import HomeScreen from '@/screens/Home';
import PersonalityResultScreen from '@/screens/PersonalityResult';
import PersonalityTestScreen from '@/screens/PersonalityTest';
import { HomeStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* HOME */}
      <Stack.Screen name="HomeMain" component={HomeScreen} />

      {/* PERSONALITY FLOW */}
      <Stack.Screen name="PersonalityTest" component={PersonalityTestScreen} />
      <Stack.Screen
        name="PersonalityResult"
        component={PersonalityResultScreen}
      />

      {/* BILAN FLOW */}
      <Stack.Screen name="BilanIntro" component={BilanIntroScreen} />
      <Stack.Screen name="BilanQuestions" component={BilanQuestionsScreen} />
      <Stack.Screen name="BilanResult" component={BilanResultScreen} />
    </Stack.Navigator>
  );
}
