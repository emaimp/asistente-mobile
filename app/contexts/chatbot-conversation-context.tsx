import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { useApi } from '@/hooks/use-api-interaction';

// Estructura de un mensaje en la conversación
export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  audioUri?: string;
  timestamp: Date;
  inputType?: 'audio' | 'text';
  isLoading?: boolean; // Indica si es un mensaje de carga
}

// API que provee el contexto de conversación
interface ConversationContextType {
  messages: Message[]; // Lista de todos los mensajes
  isProcessing: boolean; // Si hay una request al backend en curso
  handleRecordingComplete: (audioUri: string) => Promise<void>; // Procesa grabación de audio
  handleTextSubmit: (text: string) => Promise<void>; // Procesa texto enviado
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within a ConversationProvider');
  }
  return context;
};

interface ConversationProviderProps {
  children: ReactNode;
}

/*
 * Provider que gestiona el estado de conversaciones con el chatbot.
 * Centraliza la lógica de procesamiento de audio y texto, y gestión de mensajes.
*/
export const ConversationProvider: React.FC<ConversationProviderProps> = ({ children }) => {
  // Lista de mensajes de la conversación
  const [messages, setMessages] = useState<Message[]>([]);

  // ID de sesión del backend (mantiene conversaciones conectadas)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // ID del mensaje de carga actual
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);

  // Hook de API para comunicación con el backend
  const { sendAudio, sendText, isProcessing } = useApi();

  // Genera IDs únicos para mensajes
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Agrega mensaje a la lista
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  // Procesa grabación de audio: envía al backend, agrega mensajes de user/bot
  const handleRecordingComplete = async (audioUri: string) => {
    try {
      // Enviar al backend primero para obtener la transcripción
      const result = await sendAudio(audioUri, currentSessionId);

      // Guardar session_id si es la primera respuesta
      if (!currentSessionId && result.data.session_id) {
        setCurrentSessionId(result.data.session_id);
      }

      // Agregar mensaje del usuario (solo texto transcrito)
      const userMessage: Message = {
        id: generateId(),
        type: 'user',
        content: result.data.question, // Mostrar la pregunta transcrita
        timestamp: new Date(),
        inputType: 'audio',
      };
      addMessage(userMessage);

      // Agregar respuesta del bot
      const botMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: result.data.raw_answer,
        audioUri: result.audioUri,
        timestamp: new Date(),
        inputType: 'audio',
      };
      addMessage(botMessage);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo procesar el audio: ${message}`);
    }
  };

  const handleTextSubmit = async (text: string) => {
    try {
      // Agregar mensaje del usuario inmediatamente
      const userMessage: Message = {
        id: generateId(),
        type: 'user',
        content: text,
        timestamp: new Date(),
        inputType: 'text',
      };
      addMessage(userMessage);

      // Agregar mensaje de carga del bot
      const loadingId = generateId();
      const loadingMessage: Message = {
        id: loadingId,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      };
      addMessage(loadingMessage);
      setLoadingMessageId(loadingId);

      // Enviar al backend
      const result = await sendText(text, currentSessionId);

      // Guardar session_id si es la primera respuesta
      if (!currentSessionId && result.data.session_id) {
        setCurrentSessionId(result.data.session_id);
      }

      // Reemplazar mensaje de carga con respuesta real del bot
      setMessages(prev =>
        prev.map(msg =>
          msg.id === loadingId
            ? {
                ...msg,
                content: result.data.raw_answer,
                audioUri: result.audioUri,
                isLoading: false,
              }
            : msg
        )
      );
      setLoadingMessageId(null);

    } catch (error) {
      // En caso de error, remover mensaje de carga
      if (loadingMessageId) {
        setMessages(prev => prev.filter(msg => msg.id !== loadingMessageId));
        setLoadingMessageId(null);
      }
      const message = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo enviar el mensaje: ${message}`);
    }
  };

  const value: ConversationContextType = {
    messages,
    isProcessing,
    handleRecordingComplete,
    handleTextSubmit,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};
