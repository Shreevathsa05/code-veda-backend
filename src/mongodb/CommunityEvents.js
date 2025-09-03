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
    type: Date,         
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // who posted this hire opportunity
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'cancelled'],
    default: 'open'
  }
}, { timestamps: true });

export const HireModel = mongoose.model('CommunityHire', communityHireSchema);

// --------------------
// Application Schema
// --------------------
const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // user applying
    required: true
  },
  hire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityHire', // the hire post being applied to
    required: true
  },
  coverLetter: {
    type: String
  },
  resumeLink: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  }
}, { timestamps: true });

export const ApplicationModel = mongoose.model('Application', applicationSchema);
