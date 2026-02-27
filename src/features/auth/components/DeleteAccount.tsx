import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import DeleteAccountModal from '@/components/Modals/DeleteAccountModal';
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModals';
import { styles } from '@/themes/styles';

export default function DeleteAccount() {
  const { deleteAccount } = useAuth();
  const modal = useModal();

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      modal.hide();
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de supprimer le compte pour le moment.',
      });
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.deleteAccountButton}
        onPress={modal.show}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteAccountText}>Cliquez ici</Text>
      </TouchableOpacity>
      <DeleteAccountModal
        visible={modal.visible}
        onDismiss={modal.hide}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}
