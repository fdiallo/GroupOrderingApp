// src/auth/domain/repositories/IAuthRepository.ts
import { UserEntity } from '../../../core/types';

export interface IAuthRepository {
  onAuthStateChanged(callback: (user: UserEntity | null) => void): () => void;
  signUp(email: string, password: string): Promise<UserEntity>;
  signIn(email: string, password: string): Promise<UserEntity>;
  signOut(): Promise<void>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
}
