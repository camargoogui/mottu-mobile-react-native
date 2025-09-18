import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  User,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export const AuthService = {
  // Registrar novo usuário
  async register(email: string, password: string, displayName: string): Promise<AuthUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Atualizar o perfil com o nome
      await updateProfile(user, {
        displayName: displayName
      });
      
      // Salvar dados do usuário no AsyncStorage para persistência
      await this.saveUserToStorage({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Fazer login
  async login(email: string, password: string): Promise<AuthUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Salvar dados do usuário no AsyncStorage para persistência
      await this.saveUserToStorage({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
      
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  },

  // Fazer logout
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      // Remover dados do usuário do AsyncStorage
      await AsyncStorage.removeItem('user');
    } catch (error: any) {
      throw new Error('Erro ao fazer logout');
    }
  },

  // Obter usuário atual
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  // Converter User do Firebase para AuthUser
  convertToAuthUser(user: User): AuthUser {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName
    };
  },

  // Salvar dados do usuário no AsyncStorage
  async saveUserToStorage(user: AuthUser): Promise<void> {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.warn('Erro ao salvar usuário no storage:', error);
    }
  },

  // Carregar dados do usuário do AsyncStorage
  async loadUserFromStorage(): Promise<AuthUser | null> {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.warn('Erro ao carregar usuário do storage:', error);
      return null;
    }
  },

  // Mapear códigos de erro do Firebase para mensagens em português
  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este email já está sendo usado por outra conta';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet';
      default:
        return 'Erro inesperado. Tente novamente';
    }
  }
};
