import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import MatchaButton from '@/components/ui/MatchaButton';
import AuthCard from '@/features/auth/components/AuthCard';
import AuthLayout from '@/features/auth/components/AuthLayout';
import LoginLink from '@/features/auth/components/LoginLink';
import NewPasswordForm from '@/features/auth/forms/NewPasswordForm';
import Colors from '@/themes/colors';
import { bodyFontFamily } from '@/themes/typography';
import { AuthStackParamList } from '@/types/navigation';

type ResetPasswordScreenRouteProp = RouteProp<
  AuthStackParamList,
  'ResetPassword'
>;

export default function ResetPasswordScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (route.params?.token) {
      setToken(route.params.token);
    }
  }, [route.params]);

  const handleSuccess = () => {
    navigation.navigate('Login');
  };

  return (
    <AuthLayout>
      <AuthCard
        eyebrow="Sécurité"
        title="Nouveau mot de passe"
        subtitle="Choisis un mot de passe solide pour protéger ton espace Matcha."
      >
        {token ? (
          <NewPasswordForm token={token} onSuccess={handleSuccess} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Aucun token de réinitialisation trouvé.
            </Text>
            <MatchaButton
              label="Demander un nouveau lien"
              icon="mail-outline"
              variant="primary"
              onPress={() => navigation.navigate('ForgotPassword')}
              fullWidth
            />
          </View>
        )}

        <View style={styles.links}>
          <LoginLink />
        </View>
      </AuthCard>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    gap: 14,
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  links: {
    marginTop: 14,
    alignItems: 'center',
    gap: 4,
  },
});
