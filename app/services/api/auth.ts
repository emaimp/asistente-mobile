import { RegisterRequest, RegisterResponse } from './types';

export class AuthApi {
  constructor(private baseUrl: string) {}

  // Método para registrar un nuevo usuario
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error del servidor: ${response.status} ${response.statusText}`);
      }

      const responseData: RegisterResponse = await response.json();
      console.log('Usuario registrado:', responseData.user);
      return responseData;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error('Timeout al registrar usuario');
      } else {
        console.error('Error al registrar usuario:', error);
        throw error;
      }
    }
  }
}