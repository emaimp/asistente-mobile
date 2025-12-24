import React, { useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { useAudioPlayback } from '@/hooks/use-audio-playback';
import { useAudioPlaybackContext } from '@/contexts/audio-playback-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLanguage } from '@/contexts/language-context';
import Markdown from 'react-native-markdown-display';

// Estructura de datos para representar un mensaje en la conversación
interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  audioUri?: string; // URL del audio generado por el bot
  timestamp: Date;
  inputType?: 'audio' | 'text'; // Cómo se generó el mensaje del usuario
  isLoading?: boolean; // Indica si es un mensaje de carga
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
  const { t } = useLanguage();
  const colorScheme = useColorScheme();
  const userBorderColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';
  const botBorderColor = colorScheme === 'dark' ? '#FFFFFF' : '#000000';

  // Estilos para Markdown según el tema
  const markdownStyles = {
    body: {
      color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
      fontSize: 14,
      lineHeight: 20,
    },
    strong: {
      fontWeight: 'bold' as const,
    },
    em: {
      fontStyle: 'italic' as const,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 0,
    },
    code_inline: {
      backgroundColor: colorScheme === 'dark' ? '#rgba(255, 255, 255, 0.3)' : '#rgba(255, 255, 255, 0.3)',
      color: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: colorScheme === 'dark' ? '#rgba(255, 255, 255, 0.3)' : '#rgba(255, 255, 255, 0.3)',
      color: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
      padding: 8,
      borderRadius: 4,
      fontFamily: 'monospace',
      marginVertical: 4,
    },
    fence: {
      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.3)',
      color: colorScheme === 'dark' ? '#000000' : '#FFFFFF',
      padding: 8,
      borderRadius: 4,
      fontFamily: 'monospace',
      marginVertical: 4,
    },
  };

  // Encontrar el último mensaje del bot para activar autoPlay solo en ese
  let lastBotMessageIndex = messages.length - 1;
  while (lastBotMessageIndex >= 0 && messages[lastBotMessageIndex].type !== 'bot') {
    lastBotMessageIndex--;
  }

  // Refs para controlar scroll al final de la conversación
  const flatListRef = useRef<FlatList>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Estado global de audio (para bloquear controles cuando hay audio reproduciendo)
  const { isAnyAudioPlaying, currentPlayingUri } = useAudioPlaybackContext();

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
            isUser ? styles.userMessage : styles.botMessage,
            { borderColor: isUser ? userBorderColor : botBorderColor }
          ]}
          lightColor={isUser ? 'rgba(230, 230, 230, 1)' : 'rgba(43, 176, 225, 1)'}
          darkColor={isUser ? 'rgba(143, 143, 143, 1)' : 'rgba(43, 176, 225, 1)'}
        >
          {item.isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'} />
              <ThemedText
                style={styles.loadingText}
                lightColor="#000000"
                darkColor="#FFFFFF"
              >
                {item.type === 'user' ? t('chat.processingAudio') : t('chat.thinking')}
              </ThemedText>
            </View>
          ) : (
            <>
              <Markdown style={markdownStyles}>
                {item.content}
              </Markdown>

              {item.type === 'bot' && item.audioUri && (
                <AudioMessagePlayer
                  audioUri={item.audioUri}
                  inputType={item.inputType}
                  autoPlayInputType={autoPlayInputType}
                  isLastBotMessage={isLastBotMessage}
                  isAnyAudioPlaying={isAnyAudioPlaying}
                  currentPlayingUri={currentPlayingUri}
                />
              )}
            </>
          )}

          <ThemedText
            style={styles.timestampText}
            lightColor="rgba(0, 0, 0, 0.7)"
            darkColor="rgba(255, 255, 255, 0.7)"
          >
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
  isAnyAudioPlaying = false,
  currentPlayingUri
}: {
  audioUri: string;
  inputType?: 'audio' | 'text';
  autoPlayInputType?: 'audio' | 'text' | 'all';
  isLastBotMessage?: boolean;
  isAnyAudioPlaying?: boolean;
  currentPlayingUri?: string | null;
}) {
  // Determinar si este audio debe reproducirse automáticamente
  const shouldAutoPlay = isLastBotMessage && (
    autoPlayInputType === 'all' ||
    (autoPlayInputType === 'audio' && inputType === 'audio') ||
    (autoPlayInputType === 'text' && inputType === 'text')
  );

  // Hook personalizado para controlar reproducción específica de este audio
  const { isPlaying, isLoading, play } = useAudioPlayback(audioUri, shouldAutoPlay);

  // Función para detener todas las reproducciones
  const { stopAllPlayback } = useAudioPlaybackContext();

  // Bloquear todos los controles cuando hay audio reproduciendo para evitar eco
  const isBlocked = isAnyAudioPlaying;

  const handlePress = () => {
    if (!isPlaying) {
      play();
    }
  };

  return (
    <View style={styles.audioContainer}>
      <View style={styles.audioControls}>
        <TouchableOpacity
          style={[styles.audioButton, isBlocked && styles.audioButtonBlocked]}
          onPress={handlePress}
          disabled={isLoading || (isAnyAudioPlaying && !isPlaying)}
        >
          <IconSymbol
            name={(isPlaying || (isLastBotMessage && isAnyAudioPlaying && currentPlayingUri === audioUri)) ? 'volume.up.fill' : (isAnyAudioPlaying ? 'speaker.slash.fill' : 'play.fill')}
            size={20}
            color="white"
          />
          <ThemedText
            style={styles.audioButtonText}
            lightColor="#000000"
            darkColor="#FFFFFF"
          >
            {(isPlaying || (isLastBotMessage && isAnyAudioPlaying)) ? 'Reproduciendo' : (isAnyAudioPlaying ? 'Reproducir' : (isLoading ? 'Cargando...' : 'Reproducir'))}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.stopButton, (currentPlayingUri !== audioUri) && styles.audioButtonBlocked]}
          onPress={async () => await stopAllPlayback()}
          disabled={isLoading || currentPlayingUri !== audioUri}
        >
          <IconSymbol
            name="stop.fill"
            size={20}
            color="white"
          />
          <ThemedText
            style={styles.audioButtonText}
            lightColor="#000000"
            darkColor="#FFFFFF"
          >
            Detener
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  userMessage: {
    borderBottomRightRadius: 4,
  },
  botMessage: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 18,
  },
  timestampText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  audioContainer: {
    padding: 4,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  audioControls: {
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
  },
  audioButtonBlocked: {
    opacity: 0.5,
  },
  stopButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioButtonText: {
    fontSize: 14,
    marginLeft: 6,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 14,
    marginLeft: 8,
  },
});
