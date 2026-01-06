export interface ApiResponse {
  question: string;
  raw_answer: string;
  answer?: string;
  audio_url: string;
  audio_format: string;
  session_id: string;
}
