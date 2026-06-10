// src/auth/data/repositories/AuthRepositoryImpl.ts
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { UserEntity } from '../../../core/types';
import { auth, db } from '../../../core/config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  onAuthStateChanged as fbOnAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore';

export class AuthRepositoryImpl implements IAuthRepository {
  onAuthStateChanged(callback: (user: UserEntity | null) => void): () => void {
    return fbOnAuthStateChanged(auth, (user) => {
      if (user) {
        callback({ id: user.uid, email: user.email ?? '' });
      } else {
        callback(null);
      }
    });
  }

  async signUp(email: string, password: string): Promise<UserEntity> {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const user: UserEntity = { id: cred.user.uid, email };
    await setDoc(doc(db, 'users', user.id), user);
    return user;
  }

  async signIn(email: string, password: string): Promise<UserEntity> {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { id: cred.user.uid, email: cred.user.email ?? '' };
  }

  async signOut(): Promise<void> {
    await fbSignOut(auth);
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const q = query(collection(db, 'users'), where('email', '==', email.toLowerCase().trim()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docData = snap.docs[0];
    return { id: docData.id, email: docData.data().email };
  }
}
