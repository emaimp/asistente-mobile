import { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, User } from './types';

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

  // Método para iniciar sesión
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
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

      const responseData: LoginResponse = await response.json();
      console.log('Usuario autenticado');
      return responseData;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error('Timeout al iniciar sesión');
      } else {
        console.error('Error al iniciar sesión:', error);
        throw error;
      }
    }
  }

  // Método para obtener el perfil del usuario autenticado
  async getMe(token: string): Promise<User> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos de timeout

      const response = await fetch(`${this.baseUrl}/api/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error del servidor: ${response.status} ${response.statusText}`);
      }

      const responseData: User = await response.json();
      console.log('Perfil de usuario obtenido:', responseData.username);
      return responseData;
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw new Error('Timeout al obtener perfil');
      } else {
        console.error('Error al obtener perfil:', error);
        throw error;
      }
    }
  }
}
