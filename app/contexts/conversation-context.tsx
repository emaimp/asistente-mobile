import React, { createContext, useContext, ReactNode } from 'react';
import { useConversation, Message } from '@/hooks/use-conversation';

/**
 * Contexto para manejar conversación con el backend.
 * Proporciona estado y acciones para la conversación.
 */
interface ConversationContextType {
  /** Lista de mensajes en la conversación */
  messages: Message[];

  /** Indica si hay una solicitud en proceso */
  isProcessing: boolean;

  /** Envía un mensaje de texto al backend */
  sendTextMessage: (text: string) => Promise<void>;

  /** Envía un mensaje de audio al backend */
  sendAudioMessage: (audioUri: string) => Promise<void>;

  /** Limpia toda la conversación */
  clearConversation: () => void;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

/**
 * Hook para acceder al contexto de conversación.
 * Debe usarse dentro de un ConversationProvider.
 */
export const useConversationContext = () => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversationContext must be used within ConversationProvider');
  }
  return context;
};

/**
 * Props para el provider de conversación
 */
interface ConversationProviderProps {
  children: ReactNode;
}

/**
 * Provider que envuelve componentes que necesitan acceso a la conversación.
 * Centraliza el estado y lógica de la conversación.
 */
export const ConversationProvider: React.FC<ConversationProviderProps> = ({ children }) => {
  const conversationLogic = useConversation();

  const value: ConversationContextType = {
    messages: conversationLogic.messages,
    isProcessing: conversationLogic.isProcessing,
    sendTextMessage: conversationLogic.sendTextMessage,
    sendAudioMessage: conversationLogic.sendAudioMessage,
    clearConversation: conversationLogic.clearConversation,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
};
