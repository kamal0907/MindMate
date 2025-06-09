import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { auth } from './config/firebase-admin';
import { User } from './models/User';
import { AuthMiddleware, AuthenticatedHandler } from './types';
import { findOrCreateUser } from './utils/userUtils';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Request logging middleware - only in development
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
  });
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files in production
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
  });
  next();
});

// Middleware to verify Firebase token
const verifyToken: AuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('No authorization header');
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      console.error('No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decodedToken = await auth.verifyIdToken(token);
      console.log('Token verified successfully:', {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name
      });
      
      req.user = decodedToken;
      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      return res.status(401).json({ 
        error: 'Invalid token',
        message: verifyError instanceof Error ? verifyError.message : 'Token verification failed'
      });
    }
  } catch (error) {
    console.error('Error in token verification:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Add these interfaces at the top of the file, after the imports
interface DatabaseError extends Error {
  code?: number;
  keyPattern?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
}

interface Emotion {
  type: string;
  intensity: number;
}

// Routes
const createUser: AuthenticatedHandler = async (req, res) => {
  try {
    if (!req.user) {
      console.error('No user data in request');
      return res.status(401).json({ error: 'No user data' });
    }

    console.log('Creating/finding user with Firebase data:', {
      uid: req.user.uid,
      email: req.user.email,
      name: req.user.name,
      picture: req.user.picture
    });

    try {
      const user = await findOrCreateUser(req.user);
      
      if (!user) {
        console.error('Failed to create or find user');
        return res.status(500).json({ error: 'Failed to process user account' });
      }

      console.log('User processed successfully:', {
        id: user._id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName
      });

      return res.json(user);
    } catch (dbError: unknown) {
      console.error('Database error:', dbError);
      
      if (dbError && typeof dbError === 'object') {
        const error = dbError as DatabaseError;
        
        if (error.code === 11000) {
          return res.status(409).json({ 
            error: 'User already exists',
            details: error.keyPattern
          });
        }
        
        if (error.name === 'ValidationError') {
          return res.status(400).json({ 
            error: 'Validation error',
            details: error.errors ? Object.values(error.errors).map(err => err.message) : undefined
          });
        }
      }
      
      return res.status(500).json({ 
        error: 'Database error',
        message: dbError instanceof Error ? dbError.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error('Error in createUser:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get user data
const getUserData: AuthenticatedHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No user data' });
    }

    const { uid, email } = req.user;
    
    // Validate required fields
    if (!uid || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          uid: !uid ? 'Firebase UID is required' : null,
          email: !email ? 'Email is required' : null
        }
      });
    }

    console.log('Fetching user data for:', uid);
    
    try {
      let user = await User.findOne({ firebaseUid: uid });
      
      if (!user) {
        console.log('User not found, creating new user');
        console.log('Firebase user data:', {
          uid: req.user.uid,
          email: req.user.email,
          name: req.user.name,
          picture: req.user.picture
        });

        try {
          // Create user data with all fields explicitly set
          const userData = {
            firebaseUid: req.user.uid,
            email: req.user.email || '',
            displayName: req.user.name || req.user.email?.split('@')[0] || 'Anonymous User',
            photoURL: req.user.picture || '',
            diaryEntries: [],
            gratitudeEntries: [],
            chatHistory: []
          };

          console.log('Attempting to create user with data:', JSON.stringify(userData, null, 2));

          // Create the user
          user = await User.create(userData);
          console.log('User created successfully:', {
            id: user._id,
            firebaseUid: user.firebaseUid,
            email: user.email,
            displayName: user.displayName
          });
        } catch (createError: unknown) {
          console.error('Detailed error creating user:', {
            error: createError,
            errorName: createError instanceof Error ? createError.name : 'Unknown',
            errorMessage: createError instanceof Error ? createError.message : 'Unknown error',
            errorStack: createError instanceof Error ? createError.stack : undefined,
            userData: {
              uid: req.user.uid,
              email: req.user.email,
              displayName: req.user.name || req.user.email?.split('@')[0] || 'Anonymous User'
            }
          });
          return res.status(500).json({ 
            error: 'Failed to create user',
            message: 'Could not create user account',
            details: createError instanceof Error ? createError.message : 'Unknown error'
          });
        }
      }
      
      res.json(user);
    } catch (dbError: unknown) {
      console.error('Database error:', dbError);
      
      if (dbError && typeof dbError === 'object') {
        const error = dbError as DatabaseError;
        
        if (error.code === 11000) {
          return res.status(409).json({ 
            error: 'User already exists',
            details: error.keyPattern
          });
        }
        
        if (error.name === 'ValidationError') {
          return res.status(400).json({ 
            error: 'Validation error',
            details: error.errors ? Object.values(error.errors).map(err => err.message) : undefined
          });
        }
      }
      
      throw dbError;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all diary entries
const getDiaryEntries: AuthenticatedHandler = async (req, res) => {
  try {
    console.log('getDiaryEntries - Starting request');
    
    if (!req.user) {
      console.error('getDiaryEntries - No user data in request');
      return res.status(401).json({ error: 'No user data' });
    }

    console.log('getDiaryEntries - User data:', {
      uid: req.user.uid,
      email: req.user.email,
      displayName: req.user.displayName
    });

    // Find or create user
    let user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      console.log('getDiaryEntries - User not found, creating new user');
      try {
        user = await User.create({
          firebaseUid: req.user.uid,
          email: req.user.email || '',
          displayName: req.user.displayName || 'Anonymous User',
          photoURL: req.user.photoURL || '',
          diaryEntries: [],
          gratitudeEntries: [],
          chatHistory: []
        });
        console.log('getDiaryEntries - New user created:', user._id);
        return res.json([]); // Return empty array for new user
      } catch (createError) {
        console.error('getDiaryEntries - Error creating user:', createError);
        return res.status(500).json({ 
          error: 'Failed to create user',
          details: createError instanceof Error ? createError.message : 'Unknown error'
        });
      }
    }

    // Return formatted entries
    const formattedEntries = user.diaryEntries.map(entry => {
      const entryObj = entry.toObject ? entry.toObject() : entry;
      return {
        id: entryObj.id,
        content: entryObj.content,
        date: new Date(entryObj.date).toISOString(),
        emotions: entryObj.emotions.map((emotion: Emotion) => ({
          type: emotion.type,
          intensity: emotion.intensity
        })),
        isPublic: entryObj.isPublic
      };
    });

    console.log('getDiaryEntries - Success:', {
      userId: user._id,
      entryCount: formattedEntries.length,
      entries: formattedEntries
    });

    return res.json(formattedEntries);
  } catch (error) {
    console.error('getDiaryEntries - Unexpected error:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Add diary entry
const addDiaryEntry: AuthenticatedHandler = async (req, res) => {
  try {
    console.log('Starting addDiaryEntry handler');
    
    if (!req.user) {
      console.error('No user data in request');
      return res.status(401).json({ error: 'No user data' });
    }

    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      console.error('Invalid request body:', req.body);
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { content, emotions = [], isPublic = false } = req.body;

    // Basic validation
    if (!content || typeof content !== 'string') {
      console.error('Invalid content:', content);
      return res.status(400).json({ error: 'Content is required and must be a string' });
    }

    // Validate emotions array
    if (!Array.isArray(emotions)) {
      console.error('Invalid emotions format:', emotions);
      return res.status(400).json({ error: 'Emotions must be an array' });
    }

    // Find or create user using the utility function
    const user = await findOrCreateUser(req.user);
    
    if (!user) {
      console.error('Failed to find or create user');
      return res.status(500).json({ error: 'Failed to process user account' });
    }

    // Create new diary entry
    const newEntry = {
      id: Date.now().toString(),
      content,
      emotions: emotions.map((emotion: { type?: string; intensity?: number }) => ({
        type: emotion.type || 'neutral',
        intensity: typeof emotion.intensity === 'number' 
          ? Math.max(1, Math.min(10, emotion.intensity)) 
          : 5
      })),
      date: new Date(),
      isPublic: Boolean(isPublic)
    };

    // Add entry to user's diary
    user.diaryEntries.push(newEntry);
    await user.save();

    // Format the response
    const formattedEntry = {
      id: newEntry.id,
      content: newEntry.content,
      date: newEntry.date.toISOString(),
      emotions: newEntry.emotions,
      isPublic: newEntry.isPublic
    };

    return res.json({
      success: true,
      message: 'Diary entry saved successfully',
      entry: formattedEntry
    });
  } catch (error) {
    console.error('Error in addDiaryEntry:', error);
    return res.status(500).json({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all gratitude entries
const getGratitudeEntries: AuthenticatedHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No user data' });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.gratitudeEntries);
  } catch (error) {
    console.error('Error fetching gratitude entries:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add gratitude entry
const addGratitudeEntry: AuthenticatedHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No user data' });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newEntry = {
      ...req.body,
      id: Date.now().toString(),
      date: new Date()
    };

    user.gratitudeEntries.push(newEntry);
    await user.save();
    
    res.json(user.gratitudeEntries);
  } catch (error) {
    console.error('Error adding gratitude entry:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get chat history
const getChatHistory: AuthenticatedHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No user data' });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Add chat message
const addChatMessage: AuthenticatedHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'No user data' });
    }

    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newMessage = {
      ...req.body,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    user.chatHistory.push(newMessage);
    await user.save();
    
    res.json(user.chatHistory);
  } catch (error) {
    console.error('Error adding chat message:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Register routes
app.post('/api/users', verifyToken, createUser);
app.get('/api/users/me', verifyToken, getUserData);
app.get('/api/users/diary', verifyToken, getDiaryEntries);
app.post('/api/users/diary', verifyToken, addDiaryEntry);
app.get('/api/users/gratitude', verifyToken, getGratitudeEntries);
app.post('/api/users/gratitude', verifyToken, addGratitudeEntry);
app.get('/api/users/chat', verifyToken, getChatHistory);
app.post('/api/users/chat', verifyToken, addChatMessage);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 