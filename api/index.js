const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('../server/routes/auth');
const taskRoutes = require('../server/routes/tasks');
const hackathonRoutes = require('../server/routes/hackathons');
const organizationRoutes = require('../server/routes/organizations');

const app = express();

// CORS configuration
const allowedOrigins = [
  'https://advanced-todo-psvgetbr1-mohits-projects-65735d3a.vercel.app',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MongoDB connection with connection pooling for serverless
let cachedConnection = null;

async function connectToDatabase() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow-pro', {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedConnection = connection;
    console.log('MongoDB connected');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/hackathons', hackathonRoutes);
app.use('/api/organizations', organizationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ 
    message: 'TaskFlow Pro API', 
    version: '1.0.0',
    endpoints: [
      '/api/health',
      '/api/auth/*',
      '/api/tasks/*',
      '/api/hackathons/*',
      '/api/organizations/*'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found', path: req.originalUrl });
});

// Serverless function handler
module.exports = async (req, res) => {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Handle the request
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      error: 'Database connection failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
