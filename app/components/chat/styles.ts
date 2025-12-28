import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  // chat-conversation.tsx (conversación)
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
    borderRadius: 6,
    borderWidth: 1,
  },
  userMessage: {
    borderBottomRightRadius: 4,
    maxWidth: '100%',
    paddingHorizontal: 15,
  },
  botMessage: {
    borderBottomLeftRadius: 4,
    maxWidth: '100%',
    paddingHorizontal: 15,
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

  // audio.tsx (controles de audio)
  audioContainer: {
    padding: 4,
    marginTop: 8,
    borderRadius: 12,
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
    borderRadius: 8,
  },
  audioButtonBlocked: {
    opacity: 0.5,
  },
  stopButton: {
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioButtonText: {
    fontSize: 14,
    marginLeft: 6,
  },

  // input.tsx (entrada de texto)
  inputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputWrapper: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minHeight: 44,
    maxHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    paddingRight: 50,
  },
  sendButton: {
    position: 'absolute',
    borderWidth: 0,
    borderRadius: 8,
    right: 3,
    top: 3,
    height: 40,
    width: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'transparent',
  },
});
