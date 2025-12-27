// Estructura de datos para representar un mensaje en la conversación
export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  audioUri?: string; // URL del audio generado por el bot
  timestamp: Date;
  inputType?: 'audio' | 'text'; // Cómo se generó el mensaje del usuario
  isLoading?: boolean; // Indica si es un mensaje de carga
}

// Props que recibe el componente ConversationView
export interface ConversationViewProps {
  messages: Message[]; // Array de mensajes a mostrar
  autoPlayInputType?: 'audio' | 'text' | 'all'; // Tipo de entrada que activa auto-play
}
