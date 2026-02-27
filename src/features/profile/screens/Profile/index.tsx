import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import ConfirmDeleteAccountModal from '@/components/Modals/ConfirmDeleteAccountModal';
import BackgroundRadial from '@/components/layout/BackgroundRadial';
import ProfileHeader from '@/features/profile/components/ProfileHeader';
import ProfileInfosReadOnly from '@/features/profile/components/ProfileInfosReadOnly';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileScreen() {
  const { user, loading, error, refresh } = useProfile();
  const { deleteAccount } = useAuth();

  const [editSection, setEditSection] = useState<
    null | 'personal' | 'address' | 'work' | 'privacy' | 'email' | 'password'
  >(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (loading) return null;

  if (error || !user) {
    return (
      <BackgroundRadial>
        <SafeAreaView style={styles.safeArea}>
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
      Toast.show({
        type: 'success',
        text1: 'Compte supprimé',
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Suppression impossible',
        text2: 'Réessaie plus tard.',
      });
    }
  };

  return (
    <BackgroundRadial>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
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
    paddingTop: 20,
    paddingBottom: 40,
    zIndex: 5,
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
    color: '#444',
    fontSize: 16,
  },
});
