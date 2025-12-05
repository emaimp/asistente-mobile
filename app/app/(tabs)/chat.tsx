import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import ConversationView from '@/components/conversation-view';
import { useConversation } from '@/contexts/conversation-context';

export default function ChatScreen() {
  const { messages } = useConversation();

  return (
    <LinearGradient
      colors={['#0a0a5c', '#004480']}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, messages.length === 0 && styles.emptyState]}>
        {messages.length === 0 ? (
          <ThemedText style={styles.emptyText}>Sin historial de Chat</ThemedText>
        ) : (
          <ConversationView messages={messages} autoPlay={false} />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
    paddingTop: 20,
    paddingHorizontal: 20
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
