import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

import Colors from '@/themes/colors';
import rnpTheme from '@/themes/rnpTheme';
import { bodyFontFamily, titleFontFamily } from '@/themes/typography';

export type SelectOption<T> = {
  label: string;
  value: T;
};

interface BottomSheetSelectProps<T> {
  label: string;
  value: T | null;
  options: readonly SelectOption<T>[];
  placeholder?: string;
  onChange: (val: T) => void;
}

export default function BottomSheetSelect<T>({
  label,
  value,
  options,
  placeholder = 'Choisir…',
  onChange,
}: BottomSheetSelectProps<T>) {
  const [visible, setVisible] = useState(false);
  const [tempValue, setTempValue] = useState<T | null>(value);

  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ?? placeholder;

  const openSheet = () => {
    setTempValue(value);
    setVisible(true);
  };

  const closeSheet = () => setVisible(false);

  const confirm = () => {
    if (tempValue != null) onChange(tempValue);
    closeSheet();
  };

  return (
    <>
      <Pressable onPress={openSheet}>
        <TextInput
          label={label}
          mode="outlined"
          value={selectedLabel}
          editable={false}
          pointerEvents="none"
          style={styles.input}
        />
      </Pressable>

      <Modal visible={visible} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={closeSheet}>
          <View />
        </Pressable>

        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.sheetTitle}>{label}</Text>

          <FlatList
            data={options}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
              const isSelected = item.value === tempValue;
              return (
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => setTempValue(item.value)}
                >
                  <Text style={styles.optionLabel}>{item.label}</Text>

                  <View
                    style={[
                      styles.selectorCircle,
                      isSelected && styles.selectorCircleSelected,
                    ]}
                  />
                </TouchableOpacity>
              );
            }}
          />

          <View style={styles.actions}>
            <Button
              mode="text"
              onPress={closeSheet}
              textColor="#5A534E"
              labelStyle={styles.cancelLabel}
            >
              Annuler
            </Button>
            <Button
              mode="contained"
              onPress={confirm}
              style={styles.confirmButton}
              buttonColor={Colors.accent.primary}
              textColor={Colors.text.inverse}
              contentStyle={styles.confirmButtonContent}
              labelStyle={styles.confirmButtonLabel}
            >
              Valider
            </Button>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: rnpTheme.colors.background,
    marginBottom: rnpTheme.spacing.md,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 25, 22, 0.24)',
  },
  sheet: {
    backgroundColor: '#FFFCF9',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 22,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '60%',
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#DDD4CB',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: titleFontFamily,
    marginBottom: 10,
    color: Colors.text.base,
  },
  optionRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE7DF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  selectorCircle: {
    width: 18,
    height: 18,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: '#D1C8C0',
  },
  selectorCircleSelected: {
    borderColor: Colors.accent.primary,
    backgroundColor: Colors.accent.soft,
  },
  actions: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  cancelLabel: {
    fontFamily: titleFontFamily,
    fontSize: 15,
  },
  confirmButtonContent: {
    minHeight: 46,
    paddingHorizontal: 8,
  },
  confirmButton: {
    borderRadius: 999,
  },
  confirmButtonLabel: {
    fontFamily: titleFontFamily,
    fontSize: 15,
    fontWeight: '600',
  },
});
