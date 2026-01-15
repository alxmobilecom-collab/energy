
export enum Language {
  RU = 'RU',
  EN = 'EN',
  ES = 'ES',
  HI = 'HI'
}

export enum UserRole {
  CLIENT = 'CLIENT',
  AGENT = 'AGENT',
  ADMIN = 'ADMIN'
}

export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
  TRY = 'TRY'
}

export enum PaymentMethod {
  CARD = 'CARD',
  CRYPTO = 'CRYPTO'
}

export interface User {
  id: string;
  email: string;
  telegramId?: string;
  role: UserRole;
  tokens: number;
  locale: Language;
}

export interface TestOption {
  id: string;
  text: Record<Language, string>;
  weight: number;
}

export interface Question {
  id: string;
  text: Record<Language, string>;
  options: TestOption[];
}

export interface TestDefinition {
  id: string;
  type: 'energy' | 'flexibility' | 'food' | 'fitness' | 'social';
  title: Record<Language, string>;
  description: Record<Language, string>;
  priceTokens: number;
  questions: Question[];
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  score: number;
  report: string;
  createdAt: string;
}

export interface TokenOrder {
  id: string;
  userId: string;
  amount: number;
  tokens: number;
  status: 'pending' | 'completed';
  createdAt: string;
}
