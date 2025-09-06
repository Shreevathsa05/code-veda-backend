import mongoose from 'mongoose';

// --------------------
// Community Events Schema
// --------------------
const communityEventsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  eventType: {
    type: String, // e.g. "workshop", "meetup", "hackathon"
    required: false
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // links to your UserModel
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, { timestamps: true });

export const EventsModel = mongoose.model('CommunityEvent', communityEventsSchema);

// --------------------
// Community Hire Schema
// --------------------
const communityHireSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  lastDate: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  salary: {
    type: Number
  },
  imageUrl: {
    type: String
  },
  poster: {
    // type: mongoose.Schema.Types.ObjectId,
    type:String,
    // ref: 'User', // who posted this hire opportunity
    required: false
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'cancelled'],
    default: 'open'
  }
}, { timestamps: true });

export const HireModel = mongoose.model('CommunityHire', communityHireSchema);

// --------------------
// Application Schema (for local hires, no user account needed)
// --------------------
const applicationSchema = new mongoose.Schema({
  hire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityHire',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: false
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  message: {
    type: String, // short note like "I can work evenings" or "5 years plumber experience"
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  }
}, { timestamps: true });

export const ApplicationModel = mongoose.model('Application', applicationSchema);