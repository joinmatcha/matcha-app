import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text } from 'react-native-paper';

import { modalStyles } from '@/components/Modals/styles';
import rnpTheme from '@/themes/rnpTheme';

import { ModalProps } from './types';

interface DeleteAccountModalProps extends ModalProps {
  onConfirm: () => void;
}

export default function DeleteAccountModal(props: DeleteAccountModalProps) {
  const { visible, onDismiss, onConfirm } = props;

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={modalStyles.containerModal}
      >
        <Text style={modalStyles.title}>Tu nous quittes déjà ?</Text>

        <Text style={modalStyles.section}>
          On est triste de te voir partir...
        </Text>

        <Text style={modalStyles.section}>
          Si tu confirmes, ton compte et toutes tes données seront supprimés
          définitivement.
        </Text>

        <Text style={modalStyles.section}>
          Impossible de faire marche arrière.
        </Text>

        <Text style={[modalStyles.section, styles.boldSection]}>
          Tu es sûr(e) ?
        </Text>

        <View style={styles.actionsRow}>
          <Button
            mode="contained"
            onPress={onConfirm}
            style={styles.actionButton}
            buttonColor={rnpTheme.colors.greenDark.normal}
          >
            Adieu !
          </Button>
          <Button
            onPress={onDismiss}
            style={styles.actionButton}
            textColor={rnpTheme.colors.error}
            buttonColor="transparent"
            labelStyle={styles.underlineLabel}
          >
            C'est une erreur !
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  boldSection: {
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rnpTheme.spacing.lg,
    gap: rnpTheme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  underlineLabel: {
    textDecorationLine: 'underline',
  },
});
