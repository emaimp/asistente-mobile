import { StyleSheet, View, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useRef } from 'react';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { BackgroundPattern } from '@/components/ui/background-pattern';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ChatInput } from '@/components/chat/input';
import { useConversation } from '@/contexts/chatbot-conversation-context';
import { useLanguage } from '@/contexts/language-context';
import { useGender } from '@/contexts/gender-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import SideDrawer, { SideDrawerRef } from '@/components/chat/side-drawer';
import ConversationView from '@/components/chat-conversation';

export default function ChatScreen() {
  // Colores dinámicos basados en género
  const backgroundColor = useThemeColor({}, 'background');
  const backgroundAltColor = useThemeColor({}, 'backgroundAlt');
  const tabBackgroundColor = useThemeColor({}, 'tabBackground');
  const textColor = useThemeColor({}, 'text');

  const { messages, handleTextSubmit, isProcessing } = useConversation();
  const { t } = useLanguage();
  const gender = useGender().currentGender;
  const colorScheme = useColorScheme();

  const drawerRef = useRef<SideDrawerRef>(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ThemedView style={{flex: 1, backgroundColor: 'transparent'}}>
        <BackgroundPattern gender={gender} colorScheme={colorScheme as 'light' | 'dark'} />
        <View style={[StyleSheet.absoluteFillObject, {backgroundColor: Colors[colorScheme === 'dark' ? 'dark' : 'light'].tabBackground, zIndex: -2}]} />
        <View style={styles.container}>
          <View style={[styles.topBar, { backgroundColor: tabBackgroundColor, borderBottomColor: textColor + '10' }]}>
            <TouchableOpacity onPress={() => drawerRef.current?.open()} style={styles.menuButton}>
              <IconSymbol name="menu" size={24} color={textColor} />
            </TouchableOpacity>
            <ThemedText style={styles.title}>{t('chat.title')}</ThemedText>
            <View style={styles.placeholder} />
          </View>
          <SideDrawer ref={drawerRef} backgroundColor={backgroundColor} backgroundAltColor={backgroundAltColor} textColor={textColor} />
          <View style={styles.content}>
            <ConversationView messages={messages} />
          </View>

          <ChatInput
            onSubmit={handleTextSubmit}
            isProcessing={isProcessing}
            placeholder={t('chat.placeholder')}
          />
        </View>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: 16,
    paddingTop: 105,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuButton: {
    padding: 8,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 95,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: StatusBar.currentHeight || 24,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  placeholder: {
    width: 40,
  },
});
