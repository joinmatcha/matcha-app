import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useContext } from 'react';
import { Alert } from 'react-native';

import { AuthContext } from '@/contexts/AuthContext';
import { TabParamList } from '@/types/navigation';

export default function LogoutScreen() {
  const auth = useContext(AuthContext);
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();

  useFocusEffect(
    useCallback(() => {
      const showConfirm = () => {
        Alert.alert(
          'Deconnexion',
          'Voulez-vous vraiment vous déconnecter ?',
          [
            {
              text: 'Annuler',
              style: 'cancel',
              onPress: () => {
                navigation.navigate('Home');
              },
            },
            {
              text: 'Oui',
              style: 'destructive',
              onPress: async () => {
                if (auth) {
                  await auth.logout();
                }
              },
            },
          ],
          { cancelable: false },
        );
      };

      showConfirm();
      return () => {};
    }, [auth, navigation]),
  );

  return null;
}
