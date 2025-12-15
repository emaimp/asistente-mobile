import React, { useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { useAudioPlaybackContext } from '@/contexts/audio-playback-context';

// Estructura de datos para representar un mensaje en la conversación
interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  audioUri?: string; // URL del audio generado por el bot
  timestamp: Date;
  inputType?: 'audio' | 'text'; // Cómo se generó el mensaje del usuario
}

// Props que recibe el componente ConversationView
interface ConversationViewProps {
  messages: Message[]; // Array de mensajes a mostrar
  autoPlayInputType?: 'audio' | 'text' | 'all'; // Tipo de entrada que activa auto-play
}

/*
 * Componente principal para mostrar la vista de la conversación/chat.
 * Renderiza mensajes entre usuario y bot con controles de audio.
*/
export default function ConversationView({ messages, autoPlayInputType }: ConversationViewProps) {
  // Encontrar el último mensaje del bot para activar autoPlay solo en ese
  let lastBotMessageIndex = messages.length - 1;
  while (lastBotMessageIndex >= 0 && messages[lastBotMessageIndex].type !== 'bot') {
    lastBotMessageIndex--;
  }

  // Refs para controlar scroll al final de la conversación
  const flatListRef = useRef<FlatList>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Estado global de audio (para bloquear controles cuando hay audio reproduciendo)
  const { isAnyAudioPlaying } = useAudioPlaybackContext();

  // Auto-scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        // Usar el scroll apropiado según cantidad de mensajes
        if (messages.length > 2) {
          flatListRef.current?.scrollToEnd({ animated: true });
        } else {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      }, 100); // Delay para que se complete el render
    }
  }, [messages]);

  // Función que renderiza cada mensaje individual
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isUser = item.type === 'user'; // Determinar si es mensaje del usuario
    const isLastBotMessage = item.type === 'bot' && index === lastBotMessageIndex; // Último mensaje del bot para auto-play

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
              isAnyAudioPlaying={isAnyAudioPlaying}
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

/*
 * Renderiza controles de reproducción de audio para mensajes del bot.
 * Maneja estado de reproducción y prevención de ecos.
*/
function AudioMessagePlayer({
  audioUri,
  inputType,
  autoPlayInputType,
  isLastBotMessage = false,
  isAnyAudioPlaying = false
}: {
  audioUri: string;
  inputType?: 'audio' | 'text';
  autoPlayInputType?: 'audio' | 'text' | 'all';
  isLastBotMessage?: boolean;
  isAnyAudioPlaying?: boolean;
}) {
  // Determinar si este audio debe reproducirse automáticamente
  const shouldAutoPlay = isLastBotMessage && (
    autoPlayInputType === 'all' ||
    (autoPlayInputType === 'audio' && inputType === 'audio') ||
    (autoPlayInputType === 'text' && inputType === 'text')
  );

  // Hook personalizado para controlar reproducción específica de este audio
  const { isPlaying, isLoading, playPause, stop } = useAudioPlayback(audioUri, shouldAutoPlay);

  // Bloquear todos los controles cuando hay audio reproduciendo para evitar eco
  const isBlocked = isAnyAudioPlaying;

  const handlePress = () => {
    if (isPlaying) {
      stop();
    } else {
      playPause();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.audioButton, isBlocked && styles.audioButtonBlocked]}
      onPress={handlePress}
      disabled={isLoading || isBlocked}
    >
      <IconSymbol
        name={isBlocked ? 'speaker.slash.fill' : (isPlaying ? 'stop.fill' : 'play.fill')}
        size={20}
        color="white"
      />
      <ThemedText style={styles.audioButtonText}>
        {isBlocked ? 'Reproduciendo audio...' : (isLoading ? 'Cargando...' : (isPlaying ? 'Detener' : 'Reproducir'))}
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
  audioButtonBlocked: {
    opacity: 0.5,
  },
  audioButtonText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 6,
  },
});
