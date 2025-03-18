'use client';

import React, { useState, useEffect } from 'react';
import { 
  saveApiUrl, 
  getApiUrl, 
  checkApiAvailability, 
  colabSetupInstructions, 
  colabTroubleshootingTips
} from '@/lib/colab-integration';
import { checkApiHealth } from '@/lib/api';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState('');
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // 'success', 'error', 'warning'
  const [showInstructions, setShowInstructions] = useState(false);
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);

  // Load saved API URL on component mount
  useEffect(() => {
    const savedUrl = getApiUrl();
    if (savedUrl) {
      setApiUrl(savedUrl);
      checkConnection(savedUrl);
    }
  }, []);

  const checkConnection = async (url) => {
    setIsChecking(true);
    setStatusMessage('Checking connection...');
    setStatusType('info');

    try {
      // Add /api at the end if not already present
      const apiEndpoint = url.endsWith('/api') ? url : `${url}/api`;
      const testUrl = apiEndpoint + '/health';
      
      const response = await fetch(testUrl);
      const health = await response.json();
      
      if (health.status === 'healthy') {
        setIsApiConnected(true);
        setStatusMessage('Connected successfully to Colab API!');
        setStatusType('success');
      } else {
        setIsApiConnected(false);
        setStatusMessage('API is available but not healthy. The model might not be ready.');
        setStatusType('warning');
      }
    } catch (error) {
      setIsApiConnected(false);
      setStatusMessage(`Connection failed: ${error.message}`);
      setStatusType('error');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveSettings = () => {
    if (!apiUrl.trim()) {
      setStatusMessage('Please enter a valid API URL');
      setStatusType('error');
      return;
    }

    // Add /api at the end if not already present
    const formattedUrl = apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
    
    saveApiUrl(formattedUrl);
    checkConnection(formattedUrl);
  };

  const handleTestConnection = () => {
    checkConnection(apiUrl);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">API Connection Settings</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Connect your Next.js application to the Colab backend running the Soccer Prediction System.
        </p>

        <div className="space-y-6">
          <div>
            <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Colab API URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="apiUrl"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://your-ngrok-url.ngrok.io/api"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter the ngrok URL from your Colab notebook with "/api" at the end
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleSaveSettings}
              disabled={isChecking}
              className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              Save Settings
            </button>
            <button
              onClick={handleTestConnection}
              disabled={isChecking || !apiUrl.trim()}
              className="bg-secondary-200 text-secondary-800 py-2 px-4 rounded-md hover:bg-secondary-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50"
            >
              Test Connection
            </button>
          </div>

          {statusMessage && (
            <div className={`p-4 rounded-md ${
              statusType === 'success' ? 'bg-green-50 text-green-800 border-green-400' :
              statusType === 'error' ? 'bg-red-50 text-red-800 border-red-400' :
              statusType === 'warning' ? 'bg-yellow-50 text-yellow-800 border-yellow-400' :
              'bg-blue-50 text-blue-800 border-blue-400'
            } border-l-4`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {statusType === 'success' && (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  {statusType === 'error' && (
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                  {statusType === 'warning' && (
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  {statusType === 'info' && (
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm">{statusMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Connection Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isChecking ? 'bg-blue-100 text-blue-800' : 
                isApiConnected ? 'bg-green-100 text-green-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {isChecking ? 'Checking...' : isApiConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {isApiConnected 
                ? 'Your Next.js app is successfully connected to the Colab backend.'
                : 'Your app is currently not connected to the Colab backend.'}
            </p>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowInstructions(!showInstructions)}>
          <h2 className="text-2xl font-bold">Colab Setup Instructions</h2>
          <svg 
            className={`h-6 w-6 transform ${showInstructions ? 'rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        
        {showInstructions && (
          <div className="mt-6 space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              Follow these steps to set up the integration between your Next.js app and Google Colab:
            </p>
            <ol className="space-y-4">
              {colabSetupInstructions.map((instruction, index) => (
                <li key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{instruction.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{instruction.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Troubleshooting */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowTroubleshooting(!showTroubleshooting)}>
          <h2 className="text-2xl font-bold">Troubleshooting</h2>
          <svg 
            className={`h-6 w-6 transform ${showTroubleshooting ? 'rotate-180' : ''}`} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
        
        {showTroubleshooting && (
          <div className="mt-6 space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              If you encounter issues with the Colab connection, here are some common problems and solutions:
            </p>
            <div className="space-y-4">
              {colabTroubleshootingTips.map((tip, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
                  <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">{tip.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{tip.description}</p>
                  <div className="mt-2 text-primary-600 dark:text-primary-400">
                    <strong>Solution:</strong> {tip.solution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}