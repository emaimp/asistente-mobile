import { useAudioRecorder, useAudioRecorderState, RecordingPresets, AudioModule, setAudioModeAsync } from 'expo-audio';
import { useEffect, useState } from 'react';

export function useAudioRecording(onRecordingComplete: (uri: string) => void) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const isRecording = recorderState.isRecording || false;

  useEffect(() => {
    const getPermissions = async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      setHasPermission(status.granted);
      if (!status.granted) {
        alert('Se necesitan permisos para grabar audio');
      }
    };
    getPermissions();

    // Configuración básica de audio
    setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
  }, []);

  const startRecording = async () => {
    if (!hasPermission) return;

    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (err) {
      console.error('Error al iniciar grabación:', err);
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      // Obtener el URI del recorder directamente
      const uri = (recorder as any).uri || recorderState.url;
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
