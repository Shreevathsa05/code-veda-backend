import cors from 'cors';
import express from 'express';
import { ReportAnalyzer } from './src/OtherAiModels.js';
// dotenv.config();

import { ReportModel } from './src/mongodb/ReportAnalyzerSchema.js';
import './src/mongodb/connection.js';
import { EventsModel, HireModel, ApplicationModel } from './src/mongodb/CommunityEvents.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));


// Mongo


// Video ---------------------------------------------------------------------------------------------------------------
// CREATE
app.post('/mongo/report-analyzer', async (req, res) => {
  try {
    const report = new ReportModel(req.body);
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ ALL
app.get('/mongo/report-analyzer', async (req, res) => {
  try {
    const reports = await ReportModel.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ ONE by ID
app.get('/mongo/report-analyzer/:id', async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE by ID
app.put('/mongo/report-analyzer/:id', async (req, res) => {
  try {
    const report = await ReportModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!report) return res.status(404).json({ message: 'Not found' });
    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE (delete report by ID)
app.delete('/mongo/report-analyzer/:id', async (req, res) => {
  try {
    const report = await ReportModel.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET last 20 report entries
app.get('/mongo/report-analyzer/recent', async (req, res) => {
  try {
    const latestReports = await ReportModel.find()
      .sort({ createdAt: -1 })    // Sort by creation date descending (newest first)
      .limit(20);                 // Limit to 20 results
    res.json(latestReports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Events---------------------------------------------------------------------------------------------------------------
// CREATE
app.post('/events', async (req, res) => {
  try {
    const event = new EventsModel(req.body);
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ (future events only)
app.get('/events', async (req, res) => {
  try {
    const now = new Date();
    const events = await EventsModel.find({ date: { $gt: now } }).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID
app.get('/events/:id', async (req, res) => {
  try {
    const event = await EventsModel.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/events/:id', async (req, res) => {
  try {
    const updated = await EventsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete('/events/:id', async (req, res) => {
  try {
    await EventsModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth-----------------------------------------------------------------------------------------------------------------
import { UserModel } from './src/mongodb/DummyAuth.js';
app.post('/signup', async (req, res) => {
  try {
    const { name, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ name });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }
const savedUser = await newUser.save();
    // Create and save user
    const newUser = new UserModel({
      id: savedUser._id,
      name,
      password: password,
      credits:0,
      badges:['']
    });

    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/login/:name/:password', async (req, res) => {
  try {
    const { name, password } = req.params;

    const user = await UserModel.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ⚠️ Right now you’re storing plain text passwords.
    // Replace with bcrypt.compare() later.
    const isMatch = (password === user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        location: user.location, // optional but useful
        credits: user.credits,
        badges: user.badges
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Local Alerts---------------------------------------------------------------------------------------------------------
import {LocalAlerts} from './src/mongodb/LocalAlerts.js'
// CREATE
app.post('/local-alerts', async (req, res) => {
  try {
    const alert = new LocalAlerts(req.body);
    const savedAlert = await alert.save();
    res.status(201).json(savedAlert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ (all future alerts only)
app.get('/local-alerts', async (req, res) => {
  try {
    const now = new Date();
    const alerts = await LocalAlerts.find({ date: { $gte: now } }).sort({ date: 1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID
app.get('/local-alerts/:id', async (req, res) => {
  try {
    const alert = await LocalAlerts.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Local alert not found' });
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/local-alerts/:id', async (req, res) => {
  try {
    const updatedAlert = await LocalAlerts.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAlert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete('/local-alerts/:id', async (req, res) => {
  try {
    await LocalAlerts.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI endpoints---------------------------------------------------------------------------------------------------------
// Video
app.post('/api/detect', async (req, res) => {
  try {
    
    const b64_video = req.body.video;
    const response = JSON.parse(await getRes(b64_video))
    console.log(await response)
    if (response.status != 'safe') {
      const hazardResponse = new HazardDetectionResponseModel( await response)
      
      console.log(await hazardResponse.save());
    }
    
    res.send(await response);
  } catch (error) {
    console.log(error)
    res.send("Error");
  }
})

// image
app.post('/api/report', async (req, res) => {
  try {
    const b64_image = req.body.image;

    const response = JSON.parse(await ReportAnalyzer(b64_image,req.body.title,req.body.description,req.body.phone,req.body.location));

console.log(await response)

      const hazardResponse = new HazardDetectionResponseModel( await response)
      
      console.log(await hazardResponse.save());    

    res.send(await response);
  } catch (error) {
    console.log(error)
    res.send("Error");
  }
});

// Hire-----------------------------------------------------------------------------------------------------------------
// CREATE
app.post('/hire', async (req, res) => {
  try {
    const hire = new HireModel(req.body);
    const saved = await hire.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ (future hires only)
app.get('/hire', async (req, res) => {
  try {
    const now = new Date();
    // const hires = await HireModel.find({ last_date: { $gt: now } }).sort({ last_date: 1 });
    // Corrected code
    const hires = await HireModel.find({ lastDate: { $gt: now } });
    res.json(hires);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ by ID
app.get('/hire/:id', async (req, res) => {
  try {
    const hire = await HireModel.findById(req.params.id);
    if (!hire) return res.status(404).json({ message: 'Hire not found' });
    res.json(hire);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/hire/:id', async (req, res) => {
  try {
    const updated = await HireModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete('/hire/:id', async (req, res) => {
  try {
    await HireModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Applications API
// --------------------

// CREATE Application (user applies to a hire post)
app.post('/applications', async (req, res) => {
  try {
    const application = new ApplicationModel(req.body);
    const saved = await application.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all applications for a specific hire post
app.get('/applications/hire/:hireId', async (req, res) => {
  try {
    const applications = await ApplicationModel.find({ hire: req.params.hireId })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ a single application (by ID)
app.get('/applications/:id', async (req, res) => {
  try {
    const application = await ApplicationModel.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE application status (generic)
app.put('/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // expected: "pending" | "accepted" | "rejected" | "withdrawn"
    const updated = await ApplicationModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// QUICK STATUS CHANGE (ACCEPT)
app.put('/applications/:id/accept', async (req, res) => {
  try {
    const updated = await ApplicationModel.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// QUICK STATUS CHANGE (REJECT)
app.put('/applications/:id/reject', async (req, res) => {
  try {
    const updated = await ApplicationModel.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// QUICK STATUS CHANGE (WITHDRAW)
app.put('/applications/:id/withdraw', async (req, res) => {
  try {
    const updated = await ApplicationModel.findByIdAndUpdate(
      req.params.id,
      { status: 'withdrawn' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Application not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE application
app.delete('/applications/:id', async (req, res) => {
  try {
    const deleted = await ApplicationModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'))