import { BaseApi } from './base';
import { ConfigApi } from './config';
import { CommunicationApi } from './communication';
import { ApiResponse, RegisterRequest, RegisterResponse } from './types';
import { AuthApi } from './auth';

// Servicio principal de API que extiende BaseApi y delega a módulos especializados
export class ApiService extends BaseApi {
  private configApi: ConfigApi;
  private communicationApi: CommunicationApi;
  private authApi: AuthApi;

  // Constructor que inicializa las subclases con la URL base
  constructor(baseUrl?: string) {
    super(baseUrl);
    this.configApi = new ConfigApi(this.baseUrl);
    this.communicationApi = new CommunicationApi(this.baseUrl);
    this.authApi = new AuthApi(this.baseUrl);
  }

  // Sobrescribir setBaseUrl para actualizar sub-APIs
  setBaseUrl(url: string) {
    super.setBaseUrl(url);
    this.configApi = new ConfigApi(url);
    this.communicationApi = new CommunicationApi(url);
    this.authApi = new AuthApi(url);
  }

  // Métodos delegados //

  // Establecer modelo en el backend
  async setModel(modelName: string): Promise<boolean> {
    return this.configApi.setModel(modelName);
  }

  // Establecer voz en el backend
  async setVoice(voiceName: string): Promise<boolean> {
    return this.configApi.setVoice(voiceName);
  }

  // Establecer idioma en el backend
  async setLanguage(languageCode: string): Promise<boolean> {
    return this.configApi.setLanguage(languageCode);
  }

  // Método unificado para enviar audio o texto al backend
  async ask(options: {
    audioUri?: string;
    text?: string;
    sessionId?: string | null;
    model?: string;
  }): Promise<ApiResponse> {
    return this.communicationApi.ask(options);
  }

  // Registrar un nuevo usuario
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.authApi.register(data);
  }
}

// Instancia singleton del servicio
export const apiService = new ApiService();
