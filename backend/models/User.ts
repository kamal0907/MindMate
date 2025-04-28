import mongoose from 'mongoose';

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
      required: true
    },
    intensity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
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
    required: true
  },
  photoURL: String,
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
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add validation for diary entries
userSchema.path('diaryEntries').validate(function(entries: any[]) {
  return entries.every(entry => 
    entry.content && 
    entry.date && 
    entry.emotions.every(emotion => 
      emotion.type && 
      emotion.intensity >= 1 && 
      emotion.intensity <= 10
    )
  );
}, 'Invalid diary entry format');

export const User = mongoose.model('User', userSchema); 