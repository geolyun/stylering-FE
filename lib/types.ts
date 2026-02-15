export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  recommendation?: ChatRecommendation;
}

export interface AuthUser {
  uid: string;
  email: string | null;
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface MeResponse {
  uid: string;
  createdAt: string;
}

export interface ChatRecommendation {
  title: string;
  category: string;
  reason: string;
}

export interface CreateChatSessionResponse {
  sessionId: string;
}

export interface SendChatMessageRequest {
  sessionId: string;
  message: string;
}

export interface SendChatMessageResponse {
  id?: string;
  content?: string;
  message?: string;
  text?: string;
  recommendation?: ChatRecommendation | null;
}
