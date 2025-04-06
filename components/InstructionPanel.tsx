import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  Platform
} from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '@/constants/theme';
import { X, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface Step {
  title: string;
  description: string;
}

interface InstructionPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const InstructionPanel: React.FC<InstructionPanelProps> = ({
  isVisible,
  onClose,
}) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const { t } = useTranslation();
  
  const [activeStep, setActiveStep] = useState(0);
  
  const steps: Step[] = [
    {
      title: 'Find API Management',
      description: 'Log in to your cryptocurrency exchange account and navigate to the "API Management" or "API Keys" section. This is usually found in the account settings or security section.',
    },
    {
      title: 'Create New API Key',
      description: 'Click on "Create New API Key" or a similar button. You may need to complete additional security verification steps like 2FA.',
    },
    {
      title: 'Set Permissions',
      description: 'IMPORTANT: Select "Read-Only" permissions for viewing balances and "Trading" permissions to allow our AI to execute trades. DO NOT enable withdrawal permissions.',
    },
    {
      title: 'IP Restrictions (Optional)',
      description: 'For extra security, you can restrict API access to specific IP addresses. Contact support if you need our server IPs.',
    },
    {
      title: 'Save Your Keys Immediately',
      description: 'After creation, your exchange will show the API Key and Secret ONLY ONCE. Copy them immediately and enter them in Simbiot AI. They cannot be retrieved later if lost.',
    },
  ];
  
  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
            borderRightWidth: Platform.OS === 'web' ? 1 : 0,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('howToFindApiKeys')}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.stepIndicator}>
          {steps.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveStep(index)}
              style={[
                styles.stepDot,
                {
                  backgroundColor: index === activeStep ? colors.primary : colors.inactive,
                },
              ]}
            />
          ))}
        </View>
        
        <ScrollView style={styles.content}>
          <View style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: colors.primary }]}>
              Step {activeStep + 1}: {steps[activeStep].title}
            </Text>
            <Text style={[styles.stepDescription, { color: colors.text }]}>
              {steps[activeStep].description}
            </Text>
          </View>
        </ScrollView>
        
        <View style={[styles.navigation, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            onPress={handlePrevStep}
            disabled={activeStep === 0}
            style={[
              styles.navButton,
              {
                opacity: activeStep === 0 ? 0.5 : 1,
              },
            ]}
          >
            <ChevronRight size={24} color={colors.primary} style={{ transform: [{ rotate: '180deg' }] }} />
            <Text style={[styles.navButtonText, { color: colors.primary }]}>
              {t('previous')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleNextStep}
            disabled={activeStep === steps.length - 1}
            style={[
              styles.navButton,
              {
                opacity: activeStep === steps.length - 1 ? 0.5 : 1,
              },
            ]}
          >
            <Text style={[styles.navButtonText, { color: colors.primary }]}>
              {t('next')}
            </Text>
            <ChevronRight size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: SPACING.xs,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  stepDescription: {
    fontSize: FONT_SIZE.md,
    lineHeight: 24,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderTopWidth: 1,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  navButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
});

export default InstructionPanel;