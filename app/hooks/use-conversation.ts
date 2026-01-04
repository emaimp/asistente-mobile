import { useState, useCallback } from 'react';
import { useApi } from '@/hooks/api/use-api-interaction';
import { useLanguage } from '@/contexts/language-context';

/**
 * Hook personalizado para manejar conversación con el backend.
 * Gestiona envío de texto y audio, recepción de respuestas con audio opcional.
 */
export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { sendText, sendAudio } = useApi();
  const { t } = useLanguage();

  /**
   * Genera un ID único para mensajes
   */
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Agrega un mensaje a la conversación
   */
  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, [generateMessageId]);

  /**
   * Envía texto al backend y maneja la respuesta
   */
  const sendTextMessage = useCallback(async (text: string) => {
    if (!text.trim() || isProcessing) return;

    try {
      setIsProcessing(true);

      // Agregar mensaje del usuario inmediatamente
      addMessage({
        type: 'user',
        content: text.trim(),
        inputType: 'text',
      });

      // Agregar mensaje del bot con loading
      const botMessageId = addMessage({
        type: 'bot',
        content: '',
        inputType: 'text',
        isLoading: true,
      });

      // Enviar al backend
      const result = await sendText(text.trim(), sessionId);

      // Guardar session_id si es la primera respuesta
      if (!sessionId && result.data.session_id) {
        setSessionId(result.data.session_id);
      }

      // Actualizar mensaje del bot con la respuesta real
      setMessages(prev => prev.map(msg =>
        msg.id === botMessageId
          ? {
              ...msg,
              content: result.data.raw_answer || 'Respuesta vacía',
              audioUri: result.audioUri,
              isLoading: false,
            }
          : msg
      ));

    } catch (error) {
      console.error('Error sending text message:', error);

      // Actualizar mensaje del bot con error
      setMessages(prev => prev.map(msg =>
        msg.isLoading
          ? {
              ...msg,
              content: t('chat.errorMessage'),
              isLoading: false,
            }
          : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, sendText, sessionId, isProcessing, t]);

  /**
   * Envía audio al backend y maneja la respuesta con transcripción
   */
  const sendAudioMessage = useCallback(async (audioUri: string) => {
    if (!audioUri || isProcessing) return;

    try {
      setIsProcessing(true);

      // Enviar audio al backend
      const result = await sendAudio(audioUri, sessionId);

      // Guardar session_id si es la primera respuesta
      if (!sessionId && result.data.session_id) {
        setSessionId(result.data.session_id);
      }

      // Agregar mensaje del usuario con la transcripción
      addMessage({
        type: 'user',
        content: result.data.question, // Transcripción del audio
        inputType: 'audio',
      });

      // Agregar respuesta del bot
      addMessage({
        type: 'bot',
        content: result.data.raw_answer,
        audioUri: result.audioUri,
        inputType: 'audio',
      });

    } catch (error) {
      console.error('Error sending audio message:', error);

      // Agregar mensaje de error
      addMessage({
        type: 'bot',
        content: t('chat.errorAudio'),
        inputType: 'audio',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage, sendAudio, sessionId, isProcessing, t]);

  /**
   * Limpia la conversación
   */
  const clearConversation = useCallback(() => {
    setMessages([]);
    setSessionId(null);
  }, []);

  return {
    messages,
    isProcessing,
    sendTextMessage,
    sendAudioMessage,
    clearConversation,
  };
}

/**
 * Tipo para mensajes de conversación
 */
export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  audioUri?: string;
  inputType: 'text' | 'audio';
  timestamp: Date;
  isLoading?: boolean;
}
