import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';

export function useAudioRecording(onRecordingComplete: (uri: string) => void) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        alert('Se necesitan permisos para grabar audio');
      }
    };
    getPermissions();

    // Configuración básica de audio
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  const startRecording = async () => {
    if (!hasPermission) return;

    try {
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Error al iniciar grabación:', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    setIsRecording(false);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) {
        onRecordingComplete(uri);
      }
    } catch (err) {
      console.error('Error al detener grabación:', err);
    }
  };

  return {
    isRecording,
    hasPermission,
    startRecording,
    stopRecording,
  };
}
