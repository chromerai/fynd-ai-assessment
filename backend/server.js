import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import { generateUserResponse, generateAdminSummary, generateRecommendedActions } from './utils/aiHelper.js';
import dotenv from 'dotenv'
import Review from './models/Review.js';

dotenv.config({ path: '../.env' })
const PORT = process.env.PORT

const app = express();

app.use(cors())
app.use(express.json())

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
mongoose.connect(process.env.MONGODB_URI, clientOptions)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(' MongoDB Connection Error:', err));

// API ENDPOINTS

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Backend API is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { name, email, rating, reviewText } = req.body;

    // Basic validation

        if (!name || name.trim().length === 0) {
    return res.status(400).json({ 
        error: 'Empty name',
        message: 'Name cannot be empty'
    });
    }

    if (!email || !email.includes('@')) {
    return res.status(400).json({ 
        error: 'Invalid email',
        message: 'Please provide a valid email'
    });
    }
    if (!rating || !reviewText) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Both rating and reviewText are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: 'Invalid rating',
        message: 'Rating must be between 1 and 5'
      });
    }

    if (reviewText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Empty review',
        message: 'Review text cannot be empty'
      });
    }

    // Generate AI responses in parallel
    const [aiResponse, aiSummary, aiRecommendedActions] = await Promise.all([
      generateUserResponse(rating, reviewText),
      generateAdminSummary(rating, reviewText),
      generateRecommendedActions(rating, reviewText)
    ]);

    // Save to database
    const review = new Review({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        rating,
        reviewText: reviewText.trim(),
        aiResponse,
        aiSummary,
        aiRecommendedActions
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        id: review._id,
        aiResponse,
        rating,
        createdAt: review.createdAt
      }
    });

  } catch (error) {
    console.error('Submit Review Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process review'
    });
  }
});

// Get All Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const { limit = 100, sortBy = 'createdAt', order = 'desc' } = req.query;

    const reviews = await Review.find()
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(parseInt(limit))
      .lean();

    // Calculate stats
    const stats = {
      total: reviews.length,
      averageRating: reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0,
      ratingDistribution: {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
      }
    };

    res.json({
      success: true,
      data: reviews,
      stats
    });

  } catch (error) {
    console.error('Get Reviews Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch reviews'
    });
  }
});

// Get Single Review
app.get('/api/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('Get Review Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch review'
    });
  }
});

// Delete Review
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    
    if (!review) {
      return res.status(404).json({ 
        error: 'Not found',
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete Review Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to delete review'
    });
  }
});

// ERROR HANDLING
// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    message: 'API endpoint not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Backend API Server Running`);
  console.log(`📍 Listening at Port: ${PORT}`);
  console.log(`${'='.repeat(60)}`);
});

