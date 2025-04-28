import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { auth } from './config/firebase-admin';
import { User } from './models/User';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to verify Firebase token
const verifyToken = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/api/users', verifyToken, async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.user;
    console.log('Creating/finding user:', { uid, email, displayName });
    
    let user = await User.findOne({ firebaseUid: uid });
    
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        displayName,
        photoURL,
        diaryEntries: [],
        gratitudeEntries: [],
        chatHistory: []
      });
      console.log('Created new user:', user._id);
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error creating/finding user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user data
app.get('/api/users/me', verifyToken, async (req, res) => {
  try {
    console.log('Fetching user data for:', req.user.uid);
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      console.log('User not found, creating new user');
      const { uid, email, displayName, photoURL } = req.user;
      const newUser = await User.create({
        firebaseUid: uid,
        email,
        displayName,
        photoURL,
        diaryEntries: [],
        gratitudeEntries: [],
        chatHistory: []
      });
      return res.json(newUser);
    }
    
    console.log('Found user:', user._id);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all diary entries
app.get('/api/users/diary', verifyToken, async (req, res) => {
  try {
    console.log('Fetching diary entries for:', req.user.uid);
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      console.log('User not found, creating new user');
      const { uid, email, displayName, photoURL } = req.user;
      const newUser = await User.create({
        firebaseUid: uid,
        email,
        displayName,
        photoURL,
        diaryEntries: [],
        gratitudeEntries: [],
        chatHistory: []
      });
      return res.json(newUser.diaryEntries);
    }
    
    console.log('Found diary entries:', user.diaryEntries.length);
    res.json(user.diaryEntries);
  } catch (error) {
    console.error('Error fetching diary entries:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add diary entry
app.post('/api/users/diary', verifyToken, async (req, res) => {
  try {
    console.log('Adding diary entry for:', req.user.uid);
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!user) {
      console.log('User not found, creating new user');
      const { uid, email, displayName, photoURL } = req.user;
      const newUser = await User.create({
        firebaseUid: uid,
        email,
        displayName,
        photoURL,
        diaryEntries: [],
        gratitudeEntries: [],
        chatHistory: []
      });
      user = newUser;
    }

    const newEntry = {
      ...req.body,
      id: Date.now().toString(),
      date: new Date()
    };

    console.log('New diary entry:', newEntry);
    
    // Validate the entry
    if (!newEntry.content || !newEntry.emotions || !Array.isArray(newEntry.emotions)) {
      return res.status(400).json({ error: 'Invalid diary entry format' });
    }

    user.diaryEntries.push(newEntry);
    await user.save();
    
    console.log('Updated diary entries:', user.diaryEntries.length);
    res.json(user.diaryEntries);
  } catch (error) {
    console.error('Error adding diary entry:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Invalid diary entry format' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all gratitude entries
app.get('/api/users/gratitude', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.gratitudeEntries);
  } catch (error) {
    console.error('Error fetching gratitude entries:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add gratitude entry
app.post('/api/users/gratitude', verifyToken, async (req, res) => {
  try {
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
});

// Get chat history
app.get('/api/users/chat', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add chat message
app.post('/api/users/chat', verifyToken, async (req, res) => {
  try {
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
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 