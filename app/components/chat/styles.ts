import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  // chat-conversation.tsx (conversación)
  container: {
    flex: 1,
    width: '100%',
    paddingTop: 95, // Compensar TopBar absoluta
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 100,
    width: '100%',
  },
  messageWrapper: {
    marginBottom: 12,
    width: '100%',
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
    width: '100%',
  },
  botMessageWrapper: {
    alignItems: 'flex-start',
    width: '100%',
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
  audioStopButton: {
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
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
    paddingRight: 90,
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
    zIndex: 10,
  },
  sendButtonDisabled: {
    backgroundColor: 'transparent',
  },
  recordButton: {
    position: 'absolute',
    left: 3,
    top: 3,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  jarvisStopButton: {
    position: 'absolute',
    right: 50,
    top: 3,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 8,
  },
  externalButton: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
