export type ChatRole = "user" | "assistant" | "system";

export type ChatNextAction = "ASK" | "SUGGEST_STOP" | "RECOMMEND";
export type ChatSessionStatus =
  | "INTERVIEWING"
  | "READY_TO_RECOMMEND"
  | "STOPPED"
  | "RECOMMENDED";

export interface ChatRecommendation {
  itemId: number | string;
  category: string;
  name?: string;
  reason: string;
}

export interface ChatCtaButton {
  label: string;
  action: string;
}

export interface ChatCta {
  primary?: ChatCtaButton;
  secondary?: ChatCtaButton;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  nextAction?: ChatNextAction;
  sessionStatus?: ChatSessionStatus;
  recommendations?: ChatRecommendation[];
  cta?: ChatCta;
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
  firebaseUid: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface CreateChatSessionResponse {
  sessionId: number;
}

export interface SendChatMessageRequest {
  sessionId: number;
  message: string;
}

export interface SendChatMessageResponse {
  assistantContent: string;
  nextAction: ChatNextAction;
  sessionStatus: ChatSessionStatus;
  cta?: ChatCta;
  recommendations?: ChatRecommendation[];
  assistantMessageId?: number;
}
