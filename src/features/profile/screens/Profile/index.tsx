import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ConfirmDeleteAccountModal from '@/components/Modals/ConfirmDeleteAccountModal';
import BackgroundRadial from '@/components/layout/BackgroundRadial';
import MatchaButton from '@/components/ui/MatchaButton';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import ProfileInfosReadOnly from '@/features/profile/components/ProfileInfosReadOnly';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import Colors from '@/themes/colors';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';
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

  if (loading) {
    return (
      <BackgroundRadial>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.accent.primary} />
          </View>
        </SafeAreaView>
      </BackgroundRadial>
    );
  }

  if (error || !user) {
    return (
      <BackgroundRadial>
        <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {error ?? 'Impossible de charger le profil.'}
            </Text>
            <MatchaButton
              label="Réessayer"
              variant="primary"
              onPress={refresh}
            />
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
          <View style={styles.heroRow}>
            <View style={styles.heroCopy}>
              <Text style={styles.screenTitle}>Profil</Text>
              <Text style={styles.screenSubtitle}>
                Gère ton compte, tes préférences et tes informations.
              </Text>
            </View>

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

          <MatchaButton
            label="Se déconnecter"
            icon="logout"
            variant="light"
            fullWidth
            onPress={handleLogout}
            style={styles.logoutButton}
          />
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
    paddingTop: 18,
    paddingBottom: 118,
    zIndex: 5,
  },
  heroRow: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  heroCopy: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  screenSubtitle: {
    marginTop: 6,
    maxWidth: 280,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: '#222',
    fontSize: 16,
    fontFamily: bodyFontFamily,
  },
  logoutButton: {
    marginTop: 0,
    marginBottom: 8,
    backgroundColor: '#DDE5EA',
  },
});
