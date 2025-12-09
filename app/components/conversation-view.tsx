import React, { useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { useAudioPlayback } from '@/hooks/use-audio-playback';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  audioUri?: string;
  timestamp: Date;
  inputType?: 'audio' | 'text';
}

interface ConversationViewProps {
  messages: Message[];
  autoPlayInputType?: 'audio' | 'text' | 'all';
}

export default function ConversationView({ messages, autoPlayInputType = 'all' }: ConversationViewProps) {
  // Encontrar el último mensaje del bot para activar autoPlay solo en ese
  let lastBotMessageIndex = messages.length - 1;
  while (lastBotMessageIndex >= 0 && messages[lastBotMessageIndex].type !== 'bot') {
    lastBotMessageIndex--;
  }
  const flatListRef = useRef<FlatList>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        if (messages.length > 2) {
          flatListRef.current?.scrollToEnd({ animated: true });
        } else {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  }, [messages]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.type === 'user';
    const isLastBotMessage = item.type === 'bot' && index === lastBotMessageIndex;

    return (
      <View style={[
        styles.messageWrapper,
        isUser ? styles.userMessageWrapper : styles.botMessageWrapper
      ]}>
        <ThemedView
          style={[
            styles.messageContainer,
            isUser ? styles.userMessage : styles.botMessage
          ]}
          lightColor="transparent"
          darkColor="transparent"
        >
          <ThemedText style={styles.messageText}>
            {item.content}
          </ThemedText>

          {item.type === 'bot' && item.audioUri && (
            <AudioMessagePlayer
              audioUri={item.audioUri}
              inputType={item.inputType}
              autoPlayInputType={autoPlayInputType}
              isLastBotMessage={isLastBotMessage}
            />
          )}

          <ThemedText style={styles.timestampText}>
            {item.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </ThemedText>
        </ThemedView>
      </View>
    );
  };

  // Para pocos mensajes (≤2), usar ScrollView para evitar conflicto con ParallaxScrollView
  if (messages.length <= 2) {
    return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => (
          <View key={message.id}>
            {renderMessage({ item: message, index })}
          </View>
        ))}
      </ScrollView>
    );
  }

  // Para muchos mensajes, usar FlatList
  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={renderMessage}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

function AudioMessagePlayer({
  audioUri,
  inputType,
  autoPlayInputType = 'all',
  isLastBotMessage = false
}: {
  audioUri: string;
  inputType?: 'audio' | 'text';
  autoPlayInputType?: 'audio' | 'text' | 'all';
  isLastBotMessage?: boolean;
}) {
  const shouldAutoPlay = isLastBotMessage && (
    autoPlayInputType === 'all' ||
    (autoPlayInputType === 'audio' && inputType === 'audio') ||
    (autoPlayInputType === 'text' && inputType === 'text')
  );

  const { isPlaying, isLoading, playPause, stop } = useAudioPlayback(audioUri, shouldAutoPlay);

  const handlePress = () => {
    if (isPlaying) {
      stop();
    } else {
      playPause();
    }
  };

  return (
    <TouchableOpacity
      style={styles.audioButton}
      onPress={handlePress}
      disabled={isLoading}
    >
      <IconSymbol
        name={isPlaying ? 'stop.fill' : 'play.fill'}
        size={20}
        color="white"
      />
      <ThemedText style={styles.audioButtonText}>
        {isLoading ? 'Cargando...' : (isPlaying ? 'Detener' : 'Reproducir')}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    paddingBottom: 100,
  },
  messageWrapper: {
    marginBottom: 12,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageContainer: {
    maxWidth: '90%',
    minWidth: '30%',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  userMessage: {
    backgroundColor: 'rgba(0, 28, 65, 0.9)',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: 'rgba(32, 178, 170, 0.9)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    color: 'white',
    fontSize: 15,
    lineHeight: 18,
  },
  timestampText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  audioButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 6,
  },
});
