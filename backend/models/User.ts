import mongoose from 'mongoose';

interface Emotion {
  type: string;
  intensity: number;
}

const diaryEntrySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  emotions: [{
    type: {
      type: String,
      required: true,
      enum: ['happy', 'sad', 'angry', 'anxious', 'calm', 'excited', 'grateful', 'hopeful', 'neutral']
    },
    intensity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 5
    }
  }],
  isPublic: {
    type: Boolean,
    required: true,
    default: false
  }
});

const gratitudeEntrySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const chatMessageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    default: function(this: { email?: string }) {
      return this.email?.split('@')[0] || 'Anonymous User';
    }
  },
  photoURL: {
    type: String,
    default: ''
  },
  diaryEntries: [diaryEntrySchema],
  gratitudeEntries: [gratitudeEntrySchema],
  chatHistory: [chatMessageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  validateBeforeSave: true
});

// Pre-validate middleware to ensure displayName is never empty
userSchema.pre('validate', function(next) {
  if (!this.displayName || this.displayName.trim() === '') {
    this.displayName = this.email?.split('@')[0] || 'Anonymous User';
  }
  next();
});

// Pre-save middleware to ensure displayName is never empty
userSchema.pre('save', function(next) {
  if (!this.displayName || this.displayName.trim() === '') {
    this.displayName = this.email?.split('@')[0] || 'Anonymous User';
  }
  this.updatedAt = new Date();
  next();
});

// Add validation for diary entries
userSchema.path('diaryEntries').validate(function(entries: any[]) {
  return entries.every(entry => 
    entry.content && 
    entry.date && 
    entry.emotions.every((emotion: Emotion) => 
      emotion.type && 
      emotion.intensity >= 1 && 
      emotion.intensity <= 10
    )
  );
}, 'Invalid diary entry format');

export const User = mongoose.model('User', userSchema); 