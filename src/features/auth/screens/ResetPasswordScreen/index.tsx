import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Branding } from '@/assets';
import BackgroundRadial from '@/components/layout/BackgroundRadial';
import KeyboardAwareScrollView from '@/components/layout/KeyboardAwareScrollView';
import LoginLink from '@/features/auth/components/LoginLink';
import NewPasswordForm from '@/features/auth/forms/NewPasswordForm';
import { bodyFontFamily, displayFontFamily } from '@/themes/typography';
import { cardSurface } from '@/themes/ui';
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
    <BackgroundRadial bubbles>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <KeyboardAwareScrollView
          style={styles.scroll}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.logoContainer}>
            <Branding.Logo />
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Nouveau mot de passe</Text>

            {token ? (
              <>
                <Text style={styles.subtitle}>
                  Veuillez saisir votre nouveau mot de passe.
                </Text>
                <NewPasswordForm token={token} onSuccess={handleSuccess} />
              </>
            ) : (
              <View style={styles.centeredView}>
                <Text style={styles.subtitle}>
                  Aucun token de réinitialisation trouvé.
                </Text>

                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('ForgotPassword')}
                  buttonColor="#E9E6E2"
                  textColor="#2B2A29"
                  style={styles.continueButton}
                >
                  Demander un nouveau lien
                </Button>
              </View>
            )}

            <View style={styles.linksContainer}>
              <LoginLink />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scroll: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 5,
  },
  card: {
    ...cardSurface,
    paddingHorizontal: 22,
    paddingVertical: 24,
    zIndex: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    fontFamily: displayFontFamily,
    color: '#1F1F1F',
    marginBottom: 8,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: bodyFontFamily,
    color: 'rgba(45,33,27,0.72)',
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'left',
  },
  centeredView: {
    alignItems: 'center',
  },
  continueButton: {
    marginTop: 12,
    borderRadius: 16,
  },
  linksContainer: {
    marginTop: 16,
    alignItems: 'center',
    gap: 4,
  },
});
