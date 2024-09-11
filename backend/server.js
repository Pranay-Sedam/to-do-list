

import express from 'express';
import cors from 'cors';
import connectDB from './db.js'; 
import taskRoutes from './routes/taskRoutes.js'; 

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// CORS configuration
const allowedOrigins = ['http://localhost:5173']; 

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Middleware
app.use(express.json());

// Routes
app.use('/tasks', taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
