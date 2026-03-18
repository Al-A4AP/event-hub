export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  referralCode: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
