export interface Utilisateur {
  id: number;
  cin: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: UserRole;
  actif: boolean;
  doubleFacteurActif: boolean;
  dateCreation: string;
  dateModification?: string;
}

export type UserRole = 'ADMIN' | 'ELECTEUR' | 'OBSERVATEUR';

export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  cin: string;
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  confirmationMotDePasse: string;
  telephone?: string;
  doubleFacteurActif: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  expiresIn?: number;
  requiresTwoFactor?: boolean;
  user?: Utilisateur;
  // Backend may return user fields at top level (flat response)
  userId?: number;
  email?: string;
  nom?: string;
  prenom?: string;
  role?: UserRole;
  enabled?: boolean;
  doubleFacteurActif?: boolean;
  otpVerified?: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface Verify2FARequest {
  otpCode: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateUserRequest {
  cin: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  generateRandomPassword: boolean;
}

export interface UpdateRoleRequest {
  role: UserRole;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  byRole: Record<UserRole, number>;
}
