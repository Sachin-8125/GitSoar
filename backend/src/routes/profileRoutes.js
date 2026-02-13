import { Router } from 'express';
import {
  analyzeProfile,
  getAnalysis,
  getStatus,
  getExampleProfiles
} from '../controllers/profileController.js';

const router = Router();

// Main analysis endpoint
router.post('/analyze', analyzeProfile);

// Get cached analysis
router.get('/analysis/:username', getAnalysis);

// API status
router.get('/status', getStatus);

// Example profiles
router.get('/examples', getExampleProfiles);

export default router;