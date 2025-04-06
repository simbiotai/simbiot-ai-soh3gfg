export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  name?: string;
  createdAt: string;
  isBanned?: boolean;
}

export interface ApiKey {
  id: string;
  userId: string;
  exchangeName: string;
  apiKey: string;
  apiSecret: string;
  status: 'connected' | 'failed' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  banUser: (userId: string) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
}

export interface ApiKeyState {
  apiKeys: ApiKey[];
  isLoading: boolean;
  error: string | null;
  addApiKey: (exchangeName: string, apiKey: string, apiSecret: string, offlineMode?: boolean) => Promise<ApiKey | void>;
  deleteApiKey: (id: string) => Promise<boolean | void>;
  fetchApiKeys: () => Promise<ApiKey[] | void>;
  clearError: () => void;
}

export interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export type Language = 'en' | 'ru' | 'de';

export interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export type TicketStatus = 'active' | 'viewed' | 'closed';

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'admin';
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  messages: TicketMessage[];
  unreadCount: number;
}

export interface TicketState {
  tickets: Ticket[];
  activeTicket: Ticket | null;
  isLoading: boolean;
  error: string | null;
  hasUnreadMessages: boolean;
  createTicket: (subject: string, message: string, imageUrl?: string) => Promise<void>;
  sendMessage: (ticketId: string, content: string, imageUrl?: string) => Promise<void>;
  fetchTickets: () => Promise<void>;
  fetchTicket: (ticketId: string) => Promise<void>;
  setActiveTicket: (ticket: Ticket | null) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  markTicketAsRead: (ticketId: string) => Promise<void>;
  clearError: () => void;
}