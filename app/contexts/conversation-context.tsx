import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from 'react-native';
import { useApi } from '@/hooks/use-backend-api';

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  audioUri?: string;
  timestamp: Date;
  inputType?: 'audio' | 'text';
}

interface ConversationContextType {
  messages: Message[];
  currentSessionId: string | null;
  isProcessing: boolean;
  showInstruction: boolean;
  addMessage: (message: Message) => void;
  handleRecordingComplete: (audioUri: string) => Promise<void>;
  handleTextSubmit: (text: string) => Promise<void>;
  getLastInteraction: () => Message[];
  setShowInstruction: (show: boolean) => void;
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

export const ConversationProvider: React.FC<ConversationProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showInstruction, setShowInstruction] = useState(true);
  const { sendAudio, sendText, isProcessing } = useApi();

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

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
      setShowInstruction(false); // Ocultar instrucción después del primer mensaje

      // Agregar respuesta del bot
      const botMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: result.data.answer,
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
      setShowInstruction(false); // Ocultar instrucción después del primer mensaje

      // Enviar al backend
      const result = await sendText(text, currentSessionId);

      // Guardar session_id si es la primera respuesta
      if (!currentSessionId && result.data.session_id) {
        setCurrentSessionId(result.data.session_id);
      }

      // Agregar respuesta del bot
      const botMessage: Message = {
        id: generateId(),
        type: 'bot',
        content: result.data.answer,
        audioUri: result.audioUri,
        timestamp: new Date(),
        inputType: 'text',
      };
      addMessage(botMessage);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      Alert.alert('Error', `No se pudo enviar el mensaje: ${message}`);
    }
  };

  const getLastInteraction = (): Message[] => {
    // Retornar los últimos 2 mensajes (usuario + bot) si existen
    const lastTwo = messages.slice(-2);
    // Asegurarse de que sea una interacción completa (usuario seguido de bot)
    if (lastTwo.length === 2 && lastTwo[0].type === 'user' && lastTwo[1].type === 'bot') {
      return lastTwo;
    }
    // Si no hay interacción completa, retornar los últimos mensajes disponibles
    return lastTwo;
  };

  const value: ConversationContextType = {
    messages,
    currentSessionId,
    isProcessing,
    showInstruction,
    addMessage,
    handleRecordingComplete,
    handleTextSubmit,
    getLastInteraction,
    setShowInstruction,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};
