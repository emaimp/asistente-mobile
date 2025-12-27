import React, { useRef, useEffect } from 'react';
import { View, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { useAudioPlaybackContext } from '@/contexts/audio-playback-context';
import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLanguage } from '@/contexts/language-context';
import { AudioMessagePlayer } from './chat/audio';
import { Message, ConversationViewProps } from './chat/types';
import { styles } from './chat/styles';
import Markdown from 'react-native-markdown-display';

/*
 * Componente principal para mostrar la vista de la conversación/chat.
 * Renderiza mensajes entre usuario y bot con controles de audio.
*/
export default function ConversationView({ messages, autoPlayInputType }: ConversationViewProps) {
  // Colores dinámicos basados en género
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  const { t } = useLanguage();

  // Estilos para Markdown según el tema
  const markdownStyles = {
    body: {
      color: textColor,
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
      backgroundColor: backgroundColor + '4D',
      color: textColor,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
    code_block: {
      backgroundColor: backgroundColor + '4D',
      color: textColor,
      padding: 8,
      borderRadius: 4,
      fontFamily: 'monospace',
      marginVertical: 4,
    },
    fence: {
      backgroundColor: backgroundColor + '4D',
      color: textColor,
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
            { borderColor: isUser ? textColor : tintColor }
          ]}
        >
          {item.isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={textColor} />
              <ThemedText
                style={styles.loadingText}
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
