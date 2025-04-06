import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import { useLanguageStore } from '@/store/language-store';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react-native';
import { Language } from '@/types';

interface LanguageSelectorProps {
  style?: any;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ style }) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  
  const [modalVisible, setModalVisible] = useState(false);
  
  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: t('english'), flag: '🇬🇧' },
    { code: 'ru', name: t('russian'), flag: '🇷🇺' },
    { code: 'de', name: t('german'), flag: '🇩🇪' },
  ];
  
  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === language) || languages[0];
  };
  
  const handleLanguageSelect = (langCode: Language) => {
    setLanguage(langCode);
    setModalVisible(false);
  };
  
  return (
    <View style={style}>
      <TouchableOpacity
        style={[
          styles.selector,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Globe size={20} color={colors.primary} />
        <Text style={[styles.currentLanguage, { color: colors.text }]}>
          {getCurrentLanguage().flag} {getCurrentLanguage().name}
        </Text>
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View 
            style={[
              styles.modalContent,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {t('language')}
            </Text>
            
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  { 
                    backgroundColor: language === lang.code 
                      ? colors.primary + '20' 
                      : 'transparent',
                  },
                ]}
                onPress={() => handleLanguageSelect(lang.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[styles.languageName, { color: colors.text }]}>
                    {lang.name}
                  </Text>
                </View>
                
                {language === lang.code && (
                  <Check size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
  },
  currentLanguage: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: SPACING.md,
  },
  modalContent: {
    width: '80%',
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: FONT_SIZE.lg,
    marginRight: SPACING.sm,
  },
  languageName: {
    fontSize: FONT_SIZE.md,
  },
});

export default LanguageSelector;