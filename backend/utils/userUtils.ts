import { User } from '../models/User';
import { DecodedIdToken } from 'firebase-admin/auth';

export async function findOrCreateUser(firebaseUser: DecodedIdToken) {
  try {
    console.log('Finding or creating user for Firebase UID:', firebaseUser.uid);
    
    // First try to find the user
    let user = await User.findOne({ firebaseUid: firebaseUser.uid });
    
    if (user) {
      console.log('Existing user found:', user._id);
      return user;
    }

    // If user doesn't exist, create a new one
    const displayName = firebaseUser.name?.trim() || 
                       firebaseUser.email?.split('@')[0]?.trim() || 
                       'Anonymous User';

    const userData = {
      firebaseUid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: displayName,
      photoURL: firebaseUser.picture || '',
      diaryEntries: [],
      gratitudeEntries: [],
      chatHistory: []
    };

    console.log('Creating new user with data:', {
      ...userData,
      displayName // Log the displayName separately to verify it
    });
    
    try {
      user = await User.create(userData);
      console.log('User created successfully:', {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName
      });
      return user;
    } catch (createError) {
      console.error('Error creating user:', {
        error: createError,
        userData: {
          ...userData,
          displayName
        }
      });
      throw createError;
    }
  } catch (error) {
    console.error('Error in findOrCreateUser:', {
      error,
      firebaseUser: {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name
      }
    });
    throw error;
  }
} 