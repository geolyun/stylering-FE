export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
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
