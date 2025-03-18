/**
 * This module provides utilities for integrating with a Google Colab backend.
 * It handles API connection management and provides fallback mechanisms.
 */

import { checkApiHealth } from './api';

// Storage keys
const API_URL_KEY = 'soccer_prediction_api_url';
const API_HEALTH_KEY = 'soccer_prediction_api_health';
const API_LAST_CHECK_KEY = 'soccer_prediction_api_last_check';

/**
 * Save the API URL to local storage
 * @param {string} url - The API URL provided by ngrok
 */
export function saveApiUrl(url) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(API_URL_KEY, url);
    // Reset health check when URL changes
    window.localStorage.removeItem(API_HEALTH_KEY);
    window.localStorage.removeItem(API_LAST_CHECK_KEY);
  }
}

/**
 * Get the saved API URL from local storage
 * @returns {string|null} The saved API URL or null if not found
 */
export function getApiUrl() {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(API_URL_KEY);
  }
  return null;
}

/**
 * Check if the API is available and save the status to local storage
 * Only performs check if previous check is older than cacheTimeMs
 * @param {number} cacheTimeMs - Time in milliseconds to cache the health check (default: 5 minutes)
 * @returns {Promise<boolean>} True if API is healthy, false otherwise
 */
export async function checkApiAvailability(cacheTimeMs = 5 * 60 * 1000) {
  // Skip check on server-side
  if (typeof window === 'undefined') {
    return false;
  }

  const lastCheck = window.localStorage.getItem(API_LAST_CHECK_KEY);
  const cachedHealth = window.localStorage.getItem(API_HEALTH_KEY);
  
  const now = Date.now();
  
  // Use cached result if available and recent
  if (lastCheck && cachedHealth) {
    const timeSinceLastCheck = now - parseInt(lastCheck, 10);
    if (timeSinceLastCheck < cacheTimeMs) {
      return cachedHealth === 'healthy';
    }
  }
  
  try {
    const health = await checkApiHealth();
    const isHealthy = health.status === 'healthy';
    
    // Save results to local storage
    window.localStorage.setItem(API_HEALTH_KEY, isHealthy ? 'healthy' : 'unhealthy');
    window.localStorage.setItem(API_LAST_CHECK_KEY, now.toString());
    
    return isHealthy;
  } catch (error) {
    console.error('API health check failed:', error);
    
    // Save negative result to local storage
    window.localStorage.setItem(API_HEALTH_KEY, 'unhealthy');
    window.localStorage.setItem(API_LAST_CHECK_KEY, now.toString());
    
    return false;
  }
}

/**
 * Helper function to update the API URL in the .env.local file for Next.js
 * Note: This only works on the client-side as a helper for developers
 */
export function generateEnvFileContent(apiUrl) {
  if (!apiUrl) return null;
  
  return `NEXT_PUBLIC_API_URL=${apiUrl}`;
}

/**
 * Instructions for setting up the Colab integration
 * These can be displayed in the UI to help users connect to Colab
 */
export const colabSetupInstructions = [
  {
    title: 'Open Your Colab Notebook',
    description: 'Navigate to Google Colab and open your Soccer Prediction System notebook.'
  },
  {
    title: 'Set Up API Server',
    description: 'Run the API server setup cells in your notebook. This will initialize the necessary modules and start the Flask server.'
  },
  {
    title: 'Get Ngrok URL',
    description: 'After running the API server, you\'ll see an ngrok URL printed in the output. It will look something like "https://abc123.ngrok.io".'
  },
  {
    title: 'Copy API URL',
    description: 'Copy the ngrok URL and add "/api" at the end. For example: "https://abc123.ngrok.io/api".'
  },
  {
    title: 'Configure Next.js App',
    description: 'Paste the API URL in the settings of your Next.js app. This will connect your frontend to the Colab backend.'
  },
  {
    title: 'Keep Colab Running',
    description: 'Make sure your Colab notebook stays active while using the application. If Colab goes to sleep, the API will become unavailable.'
  }
];

/**
 * Troubleshooting tips for Colab integration issues
 */
export const colabTroubleshootingTips = [
  {
    title: 'API Connection Failed',
    description: 'If the API connection fails, check if your Colab notebook is still running. Colab sessions can time out after periods of inactivity.',
    solution: 'Restart your Colab notebook and run the API server cells again. Then update the API URL in your app settings.'
  },
  {
    title: 'Ngrok Session Expired',
    description: 'Ngrok free tier sessions expire after a few hours. If your connection suddenly stops working, this might be the reason.',
    solution: 'Run the API server cells in Colab again to get a new ngrok URL. Then update the API URL in your app settings.'
  },
  {
    title: 'Incorrect API URL',
    description: 'Make sure you\'ve copied the correct URL and added "/api" at the end.',
    solution: 'Double-check the ngrok URL from your Colab output and make sure it\'s properly formatted.'
  },
  {
    title: 'CORS Issues',
    description: 'If you see CORS errors in the browser console, the API server might not be configured correctly.',
    solution: 'Make sure the Flask-CORS package is properly configured in your Colab notebook.'
  },
  {
    title: 'Slow Response Times',
    description: 'If the API is responding very slowly, it could be due to Colab resource limitations or network latency.',
    solution: 'Consider using mock data for development and only connecting to Colab when necessary for actual predictions.'
  }
];