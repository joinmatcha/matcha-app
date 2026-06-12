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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackgroundRadial from '@/components/layout/BackgroundRadial';
import {
  SupportContactPayload,
  sendSupportContact,
} from '@/features/profile/api/profileApi';
import Colors from '@/themes/colors';
import {
  bodyFontFamily,
  displayFontFamily,
  titleFontFamily,
} from '@/themes/typography';
import { primaryButton, primaryButtonText } from '@/themes/ui';
import { RootStackParamList } from '@/types/navigation';
import { getApiErrorMessage } from '@/utils/apiError';

type Nav = NativeStackNavigationProp<RootStackParamList, 'HelpSupport'>;
type ContactCategory = SupportContactPayload['category'];

const categories: Array<{ value: ContactCategory; label: string }> = [
  { value: 'account', label: 'Compte' },
  { value: 'privacy', label: 'Données' },
  { value: 'billing', label: 'Paiement' },
  { value: 'bug', label: 'Bug' },
  { value: 'other', label: 'Autre' },
];

const faqs = [
  {
    question: 'À quoi servent les tests Matcha ?',
    answer:
      'Ils t’aident à mieux comprendre ton profil, tes préférences et des pistes métiers possibles. Les résultats sont indicatifs et ne remplacent pas un accompagnement professionnel individualisé.',
  },
  {
    question: 'Puis-je supprimer mon compte ?',
    answer:
      'Oui. La suppression est disponible depuis ton profil. Elle supprime ton compte et les données associées dans les conditions prévues par notre politique de confidentialité.',
  },
  {
    question: 'Comment exercer mes droits RGPD ?',
    answer:
      'Utilise le formulaire de contact ci-dessous en choisissant la catégorie Données. Tu peux demander l’accès, la rectification, l’effacement ou la limitation du traitement de tes données.',
  },
];

const legalSections = [
  {
    title: 'Conditions d’utilisation',
    body: [
      'Matcha est une application d’aide à l’orientation et à la reconversion professionnelle. Les contenus, tests, scores, recommandations et fiches métiers sont fournis à titre informatif.',
      'L’utilisateur s’engage à fournir des informations exactes et à utiliser l’application dans un cadre personnel, loyal et conforme à la loi.',
      'Les recommandations ne constituent ni une promesse d’emploi, ni un conseil juridique, médical, financier ou administratif. Elles doivent être croisées avec des sources officielles et, si nécessaire, un accompagnement humain.',
      'Matcha peut faire évoluer ses fonctionnalités, ses contenus et ses conditions. En cas de changement important, les utilisateurs seront informés par un moyen raisonnable.',
    ],
  },
  {
    title: 'Confidentialité et RGPD',
    body: [
      'Matcha traite les données nécessaires à la création du compte, à la sécurisation de l’accès, au fonctionnement des tests, à la personnalisation des résultats et au support utilisateur.',
      'Les données traitées peuvent inclure l’identité, l’email, les réponses aux tests, les préférences métiers, les interactions avec les fiches métiers et les informations volontairement transmises via le support.',
      'Les bases légales principales sont l’exécution du service demandé, le consentement lorsque requis, l’intérêt légitime de sécurisation et d’amélioration du service, ainsi que le respect d’obligations légales applicables.',
      'Les données sont conservées pendant la durée nécessaire aux finalités du service. Un compte supprimé entraîne la suppression ou l’anonymisation des données associées, sauf obligation légale contraire.',
      'Tu peux demander l’accès, la rectification, l’effacement, la limitation, l’opposition ou la portabilité de tes données. Une réponse doit être apportée dans le délai prévu par la réglementation applicable.',
      'En cas de difficulté, tu peux également contacter l’autorité compétente, notamment la CNIL.',
    ],
  },
];

export default function HelpSupportScreen() {
  const navigation = useNavigation<Nav>();
  const [category, setCategory] = useState<ContactCategory>('account');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = subject.trim().length >= 3 && message.trim().length >= 20;

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert(
        'Message incomplet',
        'Ajoute un sujet et un message suffisamment détaillé.',
      );
      return;
    }

    try {
      setSubmitting(true);
      await sendSupportContact({
        category,
        subject: subject.trim(),
        message: message.trim(),
      });
      setSubject('');
      setMessage('');
      Alert.alert(
        'Message envoyé',
        'Notre équipe reviendra vers toi par email.',
      );
    } catch (error) {
      Alert.alert(
        'Envoi impossible',
        getApiErrorMessage(error, 'Réessaie dans quelques instants.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BackgroundRadial>
      <SafeAreaView edges={['left', 'right']} style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>AIDE & SUPPORT</Text>
            <Text style={styles.title}>Comment peut-on t’aider ?</Text>
            <Text style={styles.subtitle}>
              Retrouve les réponses principales, nos conditions, la politique de
              confidentialité et un formulaire pour contacter l’équipe.
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Questions fréquentes</Text>
            {faqs.map((item) => (
              <View key={item.question} style={styles.faqItem}>
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.answer}>{item.answer}</Text>
              </View>
            ))}
          </View>

          {legalSections.map((section) => (
            <View key={section.title} style={styles.card}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.body.map((paragraph) => (
                <Text key={paragraph} style={styles.legalText}>
                  {paragraph}
                </Text>
              ))}
            </View>
          ))}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Contacter le support</Text>
            <Text style={styles.answer}>
              Choisis le sujet le plus proche de ta demande. Les champs du
              formulaire sont utilisés uniquement pour traiter ton message.
            </Text>

            <View style={styles.categoryList}>
              {categories.map((item) => {
                const selected = item.value === category;
                return (
                  <TouchableOpacity
                    key={item.value}
                    activeOpacity={0.84}
                    style={[
                      styles.categoryButton,
                      selected && styles.categoryButtonActive,
                    ]}
                    onPress={() => setCategory(item.value)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selected && styles.categoryTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="Sujet"
              placeholderTextColor={Colors.text.soft}
              style={styles.input}
              maxLength={120}
            />

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Décris ta demande"
              placeholderTextColor={Colors.text.soft}
              style={[styles.input, styles.messageInput]}
              multiline
              textAlignVertical="top"
              maxLength={2000}
            />

            <TouchableOpacity
              activeOpacity={0.88}
              style={[
                styles.submitButton,
                (!canSubmit || submitting) && styles.submitButtonDisabled,
              ]}
              disabled={!canSubmit || submitting}
              onPress={handleSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <MaterialIcons name="send" size={18} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Envoyer</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backHome}
            onPress={() => navigation.navigate('Main', { screen: 'Profil' })}
          >
            <Text style={styles.backHomeText}>Retour au profil</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </BackgroundRadial>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    gap: 14,
  },
  hero: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    letterSpacing: 1.2,
    color: Colors.accent.strong,
  },
  title: {
    marginTop: 6,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    fontFamily: displayFontFamily,
    color: Colors.text.strong,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    shadowColor: '#0D1520',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '800',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
    marginBottom: 12,
  },
  faqItem: {
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.ui.borderSoft,
  },
  question: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    fontFamily: titleFontFamily,
    color: Colors.text.strong,
  },
  answer: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 21,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
  },
  legalText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: bodyFontFamily,
    color: Colors.text.muted,
    marginBottom: 10,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
    marginBottom: 14,
  },
  categoryButton: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ui.surfaceSoft,
  },
  categoryButtonActive: {
    backgroundColor: Colors.accent.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text.muted,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  input: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: Colors.ui.surfaceSoft,
    color: Colors.text.strong,
    fontFamily: bodyFontFamily,
    fontSize: 15,
  },
  messageInput: {
    minHeight: 132,
  },
  submitButton: {
    ...primaryButton,
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.48,
  },
  submitButtonText: {
    ...primaryButtonText,
  },
  backHome: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backHomeText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.soft,
  },
});
