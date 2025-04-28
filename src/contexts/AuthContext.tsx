import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getIdToken,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { createUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Export the hook as a named export
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh token
  const refreshToken = async (user: User) => {
    try {
      const newToken = await user.getIdToken(true);
      setToken(newToken);
      localStorage.setItem('authToken', newToken);
      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const token = await refreshToken(user);
          
          // Create user in database if they don't exist
          try {
            console.log('Attempting to create/find user in database...');
            const userData = await createUser();
            console.log('User created/found in database:', userData);
          } catch (error) {
            console.error('Error creating user in database:', error);
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          setToken(null);
          localStorage.removeItem('authToken');
        }
      } else {
        setToken(null);
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign in...');
      const result = await signInWithPopup(auth, googleProvider);
      const token = await refreshToken(result.user);
      
      // Create user in database after successful sign in
      try {
        console.log('Creating user in database after sign in...');
        const userData = await createUser();
        console.log('User created in database:', userData);
      } catch (error) {
        console.error('Error creating user in database:', error);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setToken(null);
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    token,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 