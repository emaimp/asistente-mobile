import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
