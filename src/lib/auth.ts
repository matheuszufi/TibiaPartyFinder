import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './firebase';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Verificar se é o primeiro login do usuário
    const userDocRef = doc(db, 'userProfiles', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Primeiro login - criar perfil padrão
      await setDoc(userDocRef, {
        email: user.email,
        characterName: user.displayName || 'Personagem',
        level: '1',
        vocation: 'Sorcerer',
        world: 'Antica',
        isPremium: false,
        guild: '',
        createdAt: new Date(),
        lastLogin: new Date(),
        authProvider: 'google'
      });
    } else {
      // Login existente - atualizar último login
      await updateDoc(userDocRef, {
        lastLogin: new Date()
      });
    }
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Erro no login com Google:', error);
    
    // Tratamento de erros específicos
    if (error.code === 'auth/popup-blocked') {
      // Fallback para redirect se popup for bloqueado
      try {
        await signInWithRedirect(auth, googleProvider);
        return { success: true, redirect: true };
      } catch (redirectError) {
        return { success: false, error: 'Popup bloqueado e redirect falhou' };
      }
    }
    
    return { success: false, error: error.message };
  }
};

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      
      // Verificar se é o primeiro login do usuário
      const userDocRef = doc(db, 'userProfiles', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Primeiro login - criar perfil padrão
        await setDoc(userDocRef, {
          email: user.email,
          characterName: user.displayName || 'Personagem',
          level: '1',
          vocation: 'Sorcerer',
          world: 'Antica',
          isPremium: false,
          guild: '',
          createdAt: new Date(),
          lastLogin: new Date(),
          authProvider: 'google'
        });
      } else {
        // Login existente - atualizar último login
        await updateDoc(userDocRef, {
          lastLogin: new Date()
        });
      }
      
      return { success: true, user };
    }
    return { success: false, error: 'Nenhum resultado de redirect' };
  } catch (error: any) {
    console.error('Erro ao processar redirect:', error);
    return { success: false, error: error.message };
  }
};
