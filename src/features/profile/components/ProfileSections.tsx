import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';

import MatchaButton from '@/components/ui/MatchaButton';
import YearPickerInput from '@/components/ui/YearPickerInput';
import { AuthContext } from '@/contexts/AuthContext';
import {
  UpdateProfilePayload,
  changePassword,
  requestEmailChange,
  updateProfile,
} from '@/features/profile/api/profileApi';
import { changePasswordSchema } from '@/schemas/change-password';
import Colors from '@/themes/colors';
import { bodyFontFamily } from '@/themes/typography';
import { UserFull } from '@/types/user';
import { getApiErrorMessage } from '@/utils/apiError';
import { validateZod } from '@/utils/validation';

type ChoiceOption<T extends string | boolean> = {
  label: string;
  value: T;
};
type GenderValue = NonNullable<UserFull['gender']>;
type LocationPrefValue = NonNullable<UserFull['locationPref']>;

const genderOptions: ChoiceOption<GenderValue>[] = [
  { label: 'Homme', value: 'male' },
  { label: 'Femme', value: 'female' },
  { label: 'Autre', value: 'other' },
  { label: 'Non renseigné', value: 'undisclosed' },
];

const locationOptions: ChoiceOption<LocationPrefValue>[] = [
  { label: 'Télétravail', value: 'remote' },
  { label: 'Hybride', value: 'hybrid' },
  { label: 'Sur site', value: 'on-site' },
];

const booleanOptions: ChoiceOption<boolean>[] = [
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
];

const lettersRegex = /[A-Za-zÀ-ÖØ-öø-ÿ]/;

const sanitizeTextField = (value: string, maxLength = 80) =>
  value.replace(/\s{2,}/g, ' ').slice(0, maxLength);

const sanitizeHumanName = (value: string) =>
  sanitizeTextField(value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ' -]/g, ''), 60);

const sanitizePostalCode = (value: string) =>
  value.replace(/\D/g, '').slice(0, 5);

export default function ProfileSections({
  section,
  user,
  onCancel,
  onSaved,
}: {
  section: 'personal' | 'address' | 'work' | 'privacy' | 'email' | 'password';
  user: UserFull;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const auth = useContext(AuthContext);
  const logout = auth?.logout;
  const [loading, setLoading] = useState(false);

  const [firstName, setFirstName] = useState(user.firstName ?? '');
  const [lastName, setLastName] = useState(user.lastName ?? '');
  const [birthDate, setBirthDate] = useState<Date | null>(
    user.birthYear ? new Date(user.birthYear, 0, 1) : null,
  );
  const [gender, setGender] = useState<GenderValue>(
    user.gender ?? 'undisclosed',
  );

  const [street, setStreet] = useState(user.addressStreet ?? '');
  const [city, setCity] = useState(user.addressCity ?? '');
  const [postal, setPostal] = useState(user.addressPostalCode ?? '');
  const [country, setCountry] = useState(user.addressCountry ?? '');

  const [locationPref, setLocationPref] = useState<LocationPrefValue>(
    user.locationPref ?? 'remote',
  );
  const [remote, setRemote] = useState<boolean | null>(user.remote ?? null);

  const [consent, setConsent] = useState<boolean>(
    user.consentAccepted ?? false,
  );

  const [newEmail, setNewEmail] = useState(user.email);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    setLoading(true);

    try {
      if (section === 'email') {
        const trimmed = newEmail.trim();

        if (!trimmed) {
          Alert.alert('Erreur', 'Veuillez saisir une adresse e-mail.');
          return;
        }

        if (!trimmed.includes('@')) {
          Alert.alert('Erreur', 'Adresse e-mail invalide.');
          return;
        }

        if (trimmed === user.email) {
          Alert.alert(
            'Aucun changement',
            'Cette adresse est déjà celle de ton compte.',
          );
          return;
        }

        await requestEmailChange(trimmed);
        Alert.alert(
          'Vérification envoyée',
          'Un e-mail de confirmation a été envoyé à ta nouvelle adresse. Clique sur le lien pour finaliser le changement.',
        );

        setTimeout(async () => {
          await logout?.();
        }, 1500);

        onSaved();
        return;
      }

      if (section === 'password') {
        const { valid, errors } = validateZod(changePasswordSchema, {
          oldPassword: currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        });
        if (!valid) {
          Alert.alert(
            'Erreur',
            errors.oldPassword ||
              errors.newPassword ||
              errors.confirmNewPassword ||
              'Erreur de validation',
          );
          return;
        }

        await changePassword({
          oldPassword: currentPassword,
          newPassword,
          confirmNewPassword: confirmPassword,
        });

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');

        onSaved();
        return;
      }

      let payload: UpdateProfilePayload = {};

      if (section === 'personal') {
        payload = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          birthYear: birthDate ? birthDate.getFullYear() : undefined,
          gender,
        };
      }

      if (section === 'address') {
        const normalizedCity = city.trim();
        const normalizedPostal = postal.trim();
        const normalizedCountry = country.trim();

        if (normalizedCity && !lettersRegex.test(normalizedCity)) {
          Alert.alert('Erreur', 'La ville doit contenir au moins une lettre.');
          return;
        }

        if (normalizedPostal && !/^\d{5}$/.test(normalizedPostal)) {
          Alert.alert(
            'Erreur',
            'Le code postal doit contenir exactement 5 chiffres.',
          );
          return;
        }

        if (normalizedCountry && !lettersRegex.test(normalizedCountry)) {
          Alert.alert('Erreur', 'Le pays doit contenir au moins une lettre.');
          return;
        }

        payload = {
          addressStreet: street.trim(),
          addressCity: normalizedCity,
          addressPostalCode: normalizedPostal,
          addressCountry: normalizedCountry,
        };
      }

      if (section === 'work') {
        payload = {
          locationPref,
          remote,
        };
      }

      if (section === 'privacy') {
        payload = {
          consentAccepted: consent,
        };
      }

      await updateProfile(payload);

      onSaved();
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Impossible de modifier tes informations.',
      );

      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.card}>
      {section === 'personal' && (
        <>
          <TextInput
            label="Prénom"
            mode="outlined"
            value={firstName}
            onChangeText={(value) => setFirstName(sanitizeHumanName(value))}
            style={styles.input}
            outlineColor={Colors.ui.borderSoft}
            activeOutlineColor={Colors.accent.primary}
            textColor={Colors.text.strong}
            outlineStyle={styles.inputOutline}
          />

          <TextInput
            label="Nom"
            mode="outlined"
            value={lastName}
            onChangeText={(value) => setLastName(sanitizeHumanName(value))}
            style={styles.input}
            outlineColor={Colors.ui.borderSoft}
            activeOutlineColor={Colors.accent.primary}
            textColor={Colors.text.strong}
            outlineStyle={styles.inputOutline}
          />

          <YearPickerInput
            label="Année de naissance"
            value={birthDate}
            onChange={setBirthDate}
          />

          <ChoiceGroup<GenderValue>
            label="Genre"
            value={gender}
            onChange={setGender}
            options={genderOptions}
          />
        </>
      )}

      {section === 'email' && (
        <>
          <TextInput
            label="Nouvel e-mail"
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            value={newEmail}
            onChangeText={setNewEmail}
            style={styles.input}
            outlineColor={Colors.ui.borderSoft}
            activeOutlineColor={Colors.accent.primary}
            textColor={Colors.text.strong}
            outlineStyle={styles.inputOutline}
          />

          <Text style={styles.infoText}>
            Après modification, tu devras confirmer cette adresse via un lien
            reçu par e-mail.
          </Text>
        </>
      )}

      {section === 'password' && (
        <>
          <TextInput
            label="Mot de passe actuel"
            mode="outlined"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
            style={styles.input}
            outlineColor={Colors.ui.borderSoft}
            activeOutlineColor={Colors.accent.primary}
            textColor={Colors.text.strong}
            outlineStyle={styles.inputOutline}
          />

          <TextInput
            label="Nouveau mot de passe"
            mode="outlined"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.input}
            outlineColor={Colors.ui.borderSoft}
            activeOutlineColor={Colors.accent.primary}
            textColor={Colors.text.strong}
            outlineStyle={styles.inputOutline}
          />

          <TextInput
            label="Confirmer le mot de passe"
            mode="outlined"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            outlineColor={Colors.ui.borderSoft}
            activeOutlineColor={Colors.accent.primary}
            textColor={Colors.text.strong}
            outlineStyle={styles.inputOutline}
          />
        </>
      )}

      {section === 'address' && (
        <>
          <TextInput
            label="Rue"
            mode="outlined"
            value={street}
            onChangeText={(value) => setStreet(sanitizeTextField(value, 120))}
            style={styles.input}
            outlineColor={Colors.ui.borderSoft}
            activeOutlineColor={Colors.accent.primary}
            textColor={Colors.text.strong}
            outlineStyle={styles.inputOutline}
          />

          <TextInput
            label="Ville"
            mode="outlined"
            value={city}
            onChangeText={(value) => setCity(sanitizeHumanName(value))}
            autoCapitalize="words"
            style={styles.input}
            outlineColor={Colors.ui.borderSoft}
            activeOutlineColor={Colors.accent.primary}
            textColor={Colors.text.strong}
            outlineStyle={styles.inputOutline}
          />

          <TextInput
            label="Code postal"
            mode="outlined"
            value={postal}
            onChangeText={(value) => setPostal(sanitizePostalCode(value))}
            keyboardType="number-pad"
            maxLength={5}
            style={styles.input}
            outlineColor={Colors.ui.borderSoft}
            activeOutlineColor={Colors.accent.primary}
            textColor={Colors.text.strong}
            outlineStyle={styles.inputOutline}
          />

          <TextInput
            label="Pays"
            mode="outlined"
            value={country}
            onChangeText={(value) => setCountry(sanitizeHumanName(value))}
            autoCapitalize="words"
            style={styles.input}
            outlineColor={Colors.ui.borderSoft}
            activeOutlineColor={Colors.accent.primary}
            textColor={Colors.text.strong}
            outlineStyle={styles.inputOutline}
          />
        </>
      )}

      {section === 'work' && (
        <>
          <ChoiceGroup<LocationPrefValue>
            label="Mode de travail"
            value={locationPref}
            onChange={setLocationPref}
            options={locationOptions}
          />

          <ChoiceGroup<boolean>
            label="Télétravail possible ?"
            value={remote}
            onChange={setRemote}
            options={booleanOptions}
          />
        </>
      )}

      {section === 'privacy' && (
        <>
          <ChoiceGroup<boolean>
            label="Consentement RGPD"
            value={consent}
            onChange={setConsent}
            options={booleanOptions}
          />

          <Text style={styles.infoText}>
            Tu peux modifier ton consentement à tout moment conformément au
            RGPD.
          </Text>
        </>
      )}

      <View style={styles.actions}>
        <MatchaButton
          label="Annuler"
          icon="close"
          variant="light"
          onPress={onCancel}
          disabled={loading}
        />

        <MatchaButton
          label={loading ? 'Enregistrement...' : 'Enregistrer'}
          icon="check"
          variant="primary"
          onPress={handleSave}
          disabled={loading}
        />
      </View>
    </View>
  );
}

function ChoiceGroup<T extends string | boolean>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T | null;
  options: readonly ChoiceOption<T>[];
  onChange: (value: T) => void;
}) {
  return (
    <View style={styles.choiceGroup}>
      <Text style={styles.choiceLabel}>{label}</Text>
      <View style={styles.choiceGrid}>
        {options.map((option) => {
          const selected = option.value === value;

          return (
            <TouchableOpacity
              key={String(option.value)}
              activeOpacity={0.84}
              onPress={() => onChange(option.value)}
              style={[styles.choicePill, selected && styles.choicePillSelected]}
            >
              <Text
                style={[
                  styles.choiceText,
                  selected && styles.choiceTextSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    paddingTop: 4,
    gap: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  inputOutline: {
    borderRadius: 8,
  },
  choiceGroup: {
    gap: 8,
  },
  choiceLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: bodyFontFamily,
    color: Colors.text.soft,
  },
  choiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  choicePill: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F6F4',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  choicePillSelected: {
    backgroundColor: '#DDEDE4',
    borderColor: Colors.accent.primary,
  },
  choiceText: {
    fontSize: 14,
    fontFamily: bodyFontFamily,
    color: Colors.text.base,
  },
  choiceTextSelected: {
    color: Colors.accent.strong,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  infoText: {
    fontSize: 13,
    fontFamily: bodyFontFamily,
    color: '#2A2A2A',
    marginTop: 4,
  },
});
