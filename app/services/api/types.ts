// Communication types
export interface ApiResponse {
  question: string;
  raw_answer: string;
  answer?: string;
  audio_url: string;
  audio_format: string;
  session_id: string;
}

// Auth types
export interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  profile_photo: string;
  created_at: string;
  updated_at: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  access_token: string;
  token_type: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}
