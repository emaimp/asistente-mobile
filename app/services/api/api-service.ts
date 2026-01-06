import { BaseApi } from './base';
import { ConfigApi } from './config';
import { CommunicationApi } from './communication';
import { ApiResponse } from './types';

// Servicio principal de API que extiende BaseApi y delega a módulos especializados
export class ApiService extends BaseApi {
  private configApi: ConfigApi;
  private communicationApi: CommunicationApi;

  // Constructor que inicializa las subclases con la URL base
  constructor(baseUrl?: string) {
    super(baseUrl);
    this.configApi = new ConfigApi(this.baseUrl);
    this.communicationApi = new CommunicationApi(this.baseUrl);
  }

  // Sobrescribir setBaseUrl para actualizar sub-APIs
  setBaseUrl(url: string) {
    super.setBaseUrl(url);
    this.configApi = new ConfigApi(url);
    this.communicationApi = new CommunicationApi(url);
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
}

// Instancia singleton del servicio
export const apiService = new ApiService();
