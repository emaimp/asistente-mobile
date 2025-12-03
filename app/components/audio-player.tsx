import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAudioPlayback } from '@/hooks/use-audio-playback';

interface AudioPlayerProps {
  uri: string | null;
}

export default function AudioPlayer({ uri }: AudioPlayerProps) {
  const { isPlaying, duration, position, playPause, stop, formatTime } = useAudioPlayback(uri);

  if (!uri) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAudioText}>No hay audio para reproducir</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Audio Recibido</Text>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={playPause}>
          <Text style={styles.buttonText}>{isPlaying ? 'Pausar' : 'Reproducir'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={stop}>
          <Text style={styles.buttonText}>Detener</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.timeText}>
        {formatTime(position)} / {formatTime(duration)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  controls: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#34C759',
    padding: 10,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  noAudioText: {
    fontSize: 16,
    color: '#999',
  },
});
