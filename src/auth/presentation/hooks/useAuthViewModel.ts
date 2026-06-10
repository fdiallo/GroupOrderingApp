// src/auth/presentation/hooks/useAuthViewModel.ts
import { useState, useEffect } from 'react';
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl';
import { UserEntity } from '../../../core/types';

const authRepo = new AuthRepositoryImpl();

export const useAuthViewModel = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authRepo.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e: string, p: string) => authRepo.signIn(e, p);
  const handleSignUp = async (e: string, p: string) => authRepo.signUp(e, p);
  const handleLogout = async () => authRepo.signOut();

  return { user, loading, handleLogin, handleSignUp, handleLogout };
};
