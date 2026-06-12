import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import ConfirmDeleteAccountModal from '@/components/Modals/ConfirmDeleteAccountModal';
import BackgroundRadial from '@/components/layout/BackgroundRadial';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import ProfileInfosReadOnly from '@/features/profile/components/ProfileInfosReadOnly';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import Colors from '@/themes/colors';
import { bodyFontFamily } from '@/themes/typography';
import { secondaryButton, secondaryButtonText } from '@/themes/ui';
import { RootStackParamList } from '@/types/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { user, loading, error, refresh } = useProfile();
  const { deleteAccount, logout } = useAuth();

  const [editSection, setEditSection] = useState<
    null | 'personal' | 'address' | 'work' | 'privacy' | 'email' | 'password'
  >(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (loading) return null;

  if (error || !user) {
    return (
      <BackgroundRadial>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error ?? 'Impossible de charger le profil.'}
            </Text>
            <Button mode="contained" onPress={refresh}>
              Réessayer
            </Button>
          </View>
        </SafeAreaView>
      </BackgroundRadial>
    );
  }

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      setShowDeleteModal(false);
    } catch {
      Alert.alert('Suppression impossible', 'Réessaie plus tard.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      Alert.alert('Déconnexion impossible', 'Réessaie plus tard.');
    }
  };

  return (
    <BackgroundRadial>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.topActions}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Aide et support"
              activeOpacity={0.82}
              style={styles.helpButton}
              onPress={() => navigation.navigate('HelpSupport')}
            >
              <MaterialIcons
                name="help-outline"
                size={22}
                color={Colors.text.strong}
              />
            </TouchableOpacity>
          </View>

          <ProfileHeader user={user} />

          <ProfileInfosReadOnly
            user={user}
            editSection={editSection}
            setEditSection={setEditSection}
            onSaved={async () => {
              await refresh();
              setEditSection(null);
            }}
            onDelete={() => setShowDeleteModal(true)}
          />

          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            labelStyle={styles.logoutButtonLabel}
          >
            Se déconnecter
          </Button>
        </ScrollView>

        <ConfirmDeleteAccountModal
          visible={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
        />
      </SafeAreaView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  bubblesLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    zIndex: 5,
  },
  topActions: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  helpButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.ui.borderSoft,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  errorText: {
    textAlign: 'center',
    color: '#222',
    fontSize: 16,
    fontFamily: bodyFontFamily,
  },
  logoutButton: {
    ...secondaryButton,
    marginTop: 4,
    marginBottom: 8,
  },
  logoutButtonLabel: {
    ...secondaryButtonText,
    color: Colors.text.strong,
  },
});
