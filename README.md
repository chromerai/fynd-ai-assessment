# Fynd AI Intern Assessment 

## What's Included
This repository contains a complete implementation of both Task 1 and Task 2 for the Fynd AI Intern Assessment.
### Task 1: Rating Prediction via Prompting ✅ 

- Jupyter notebook with 3 different prompting approaches
- Evaluation on 200 Yelp reviews
- Comparison table and detailed analysis
- Saved results in CSV format

### Task 2: Two-Dashboard AI Feedback System ✅ 

- User Dashboard: Public-facing review submission
- Admin Dashboard: Internal analytics and AI insights
- Backend API: Server-side LLM calls with MongoDB persistence
- Full Deployment: Ready for Vercel + Render

## Live Demo URLs

- [User Dashboard]( https://fynd-ai-frontend.vercel.app/)
- [Admin Dashboard](https://fynd-ai-frontend.vercel.app/admin)
- [Backend API](https://fynd-ai-backend-em0i.onrender.com/api/health)

Admin Dashboard can take a few seconds (~ 1min) to spin up due to *Render Cold Starts: 30-60 second delay after 15 min idle*
Solution: Paid tier ($7/mo) OR cron job, a ping or a health-check to keep alive( already have that api endpoint need to setup a timer that can match the rhythm) or auto refresh!

```
┌─────────────────┐
│  User Dashboard │  (React - Vercel)
│   Submit Review │
└────────┬────────┘
         │
         │ HTTPS
         ▼
┌─────────────────┐
│   Backend API   │  (Node.js + Express - Render)
│   - Validation  │
│   - LLM Calls   │  ◄─── Google Gemini API
│   - Data Store  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  MongoDB Atlas  │  (Cloud Database)
│   Reviews Data  │
└─────────────────┘
         ▲
         │
┌─────────────────┐
│ Admin Dashboard │  (React - Vercel)
│   Analytics     │
│   AI Insights   │
└─────────────────┘
```

## Technologies Used

### Frontend

- React - UI library
- Vite - Build tool (fast, modern)
- React Router - Client-side routing
- TailwindCSS - Custom styling (no UI libraries for flexibility)

### Backend

- Node.js - Runtime environment
- Express.js - Web framework
- MongoDB + Mongoose - Database and ODM
- Google Gemini API - LLM integration
- CORS - Cross-origin resource sharing

### Deployment

- Vercel - Frontend hosting (both dashboards)
- Render - Backend hosting (API server)
- MongoDB Atlas - Database hosting (free tier)