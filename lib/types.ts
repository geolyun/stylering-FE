export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  nextAction?: ChatNextAction;
  sessionStatus?: string;
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
  uid: string;
  createdAt: string;
}

export interface ChatRecommendation {
  title: string;
  category: string;
  reason: string;
}

export type ChatNextAction = "ASK" | "SUGGEST_STOP" | "RECOMMEND";

export interface ChatCtaItem {
  label?: string;
  action?: string;
}

export interface ChatCta {
  primary?: ChatCtaItem;
  secondary?: ChatCtaItem;
}

export interface CreateChatSessionResponse {
  sessionId: string | number;
}

export interface SendChatMessageRequest {
  sessionId: string | number;
  message: string;
}

export interface SendChatMessageResponse {
  id?: string | number;
  userMessageId?: number;
  assistantMessageId?: number;
  sessionId?: string | number;
  content?: string;
  message?: string;
  text?: string;
  assistantContent?: string;
  recommendation?: ChatRecommendation | null;
}

export interface ChatApiResponse {
  assistantContent: string;
  nextAction: ChatNextAction;
  sessionStatus: string;
  recommendations?: ChatRecommendation[];
  cta?: ChatCta;
  assistantMessageId?: number | string;
}
