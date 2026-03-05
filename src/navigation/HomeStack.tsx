import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  BilanIntroScreen,
  BilanQuestionsScreen,
  BilanResultScreen,
} from '@/features/bilan';
import { HomeScreen } from '@/features/home';
import { JobDetailScreen } from '@/features/jobs';
import {
  PersonalityIntroScreen,
  PersonalityResultScreen,
  PersonalityTestScreen,
} from '@/features/personality';
import { HomeStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* HOME */}
      <Stack.Screen name="HomeMain" component={HomeScreen} />

      {/* PERSONALITY FLOW */}
      <Stack.Screen
        name="PersonalityIntro"
        component={PersonalityIntroScreen}
      />
      <Stack.Screen name="PersonalityTest" component={PersonalityTestScreen} />
      <Stack.Screen
        name="PersonalityResult"
        component={PersonalityResultScreen}
      />

      {/* BILAN FLOW */}
      <Stack.Screen name="BilanIntro" component={BilanIntroScreen} />
      <Stack.Screen name="BilanQuestions" component={BilanQuestionsScreen} />
      <Stack.Screen name="BilanResult" component={BilanResultScreen} />
      <Stack.Screen name="JobDetail" component={JobDetailScreen} />
    </Stack.Navigator>
  );
}
