import { CommonActions, NavigationProp } from '@react-navigation/native';

import { RootStackParamList } from '@/types/navigation';

type AppNavigation = Pick<NavigationProp<RootStackParamList>, 'dispatch'>;

export function resetToHome(navigation: AppNavigation) {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Main', params: { screen: 'Home' } }],
    }),
  );
}

export function resetToMatchaProfile(navigation: AppNavigation) {
  navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [
        { name: 'Main', params: { screen: 'Home' } },
        { name: 'MatchaProfile' },
      ],
    }),
  );
}
