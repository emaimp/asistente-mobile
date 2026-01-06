import React, { useRef, useEffect } from 'react';
import { View, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { useConversationContext } from '@/contexts/conversation-context';
import { ThemedText } from '@/components/ui/theme/themed-text';
import { ThemedView } from '@/components/ui/theme/themed-view';
import { useThemeColor } from '@/hooks/theme/use-theme-color';
import { useLanguage } from '@/contexts/language-context';
import { AudioMessagePlayer } from './chat/audio';
import { styles } from './chat/styles';
import Markdown from 'react-native-markdown-display';

/*
 * Componente simplificado para mostrar la conversación.
 * Renderiza mensajes de texto plano con controles de audio básicos.
*/
export default function ConversationView() {
  const { messages } = useConversationContext();
  const { t } = useLanguage();

  // Colores dinámicos
  const textColor = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

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

  // Refs para scroll
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

  // Renderiza cada mensaje
  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isUser = item.type === 'user';

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
          <>
            <Markdown style={markdownStyles}>
              {item.content}
            </Markdown>

            {item.type === 'bot' && item.audioUri && (
              <AudioMessagePlayer
                audioUri={item.audioUri}
              />
            )}

            {item.isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={textColor} />
                <ThemedText style={styles.loadingText}>
                  {item.inputType === 'audio' ? t('chat.processing') : t('chat.thinking')}
                </ThemedText>
              </View>
            )}
          </>

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

  // Para pocos mensajes, usar ScrollView
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
