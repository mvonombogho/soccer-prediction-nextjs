# Google Colab Integration for Soccer Prediction System

This guide explains how to connect your Next.js frontend application with the Soccer Prediction System running on Google Colab. This integration allows you to leverage Colab's computational resources for machine learning while providing a modern, responsive web interface through Next.js.

## How the Integration Works

The integration follows this architecture:

1. **Google Colab** - Runs the prediction system with all the machine learning models
2. **Flask API** - A lightweight API server running within Colab
3. **ngrok** - Creates a secure tunnel to expose the Flask API to the internet
4. **Next.js Frontend** - Communicates with the API to display predictions and visualizations

```
┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│                │      │                │      │                │
│   Next.js      │◄────►│   ngrok        │◄────►│  Flask API     │◄────┐
│   Frontend     │      │   Tunnel       │      │  (Colab)       │     │
│                │      │                │      │                │     │
└────────────────┘      └────────────────┘      └────────────────┘     │
                                                                        │
                                                                        ▼
                                                               ┌────────────────┐
                                                               │  ML Models     │
                                                               │  & Data        │
                                                               │  (Colab)       │
                                                               └────────────────┘
```

## Setup Instructions

### Prerequisites

- Google account with access to Google Colab
- Google Drive with your Soccer Prediction System notebook
- Node.js and npm installed for running the Next.js app
- ngrok account (free tier is sufficient)

### Step 1: Set Up Your Colab Environment

1. Open your Soccer Prediction System notebook in Google Colab
2. Make sure your Soccer Prediction System code is working correctly
3. Mount your Google Drive to access your dataset and models:

```python
from google.colab import drive
drive.mount('/content/drive')
```

4. Navigate to the directory containing your Soccer Prediction System:

```python
%cd /content/drive/MyDrive/Soccer_Prediction_System
```

### Step 2: Add the API Server Code to Your Notebook

1. Copy the entire content from `colab_api_setup.py` in this repository
2. Create a new code cell in your Colab notebook and paste the code
3. Modify the predictor initialization to use your actual prediction system:

```python
# Replace this:
predictor = MockPredictor()

# With your actual predictor:
predictor = SoccerMatchPredictor()
predictor.load_model('/content/drive/MyDrive/Soccer_Prediction_System/models/saved_models/ensemble_20250308191858')
```

4. If you have an ngrok auth token, uncomment and add it to the `start_ngrok` function:

```python
ngrok.set_auth_token("YOUR_NGROK_AUTH_TOKEN")
```

### Step 3: Start the API Server

1. Run the cell with the API server code
2. After execution, you should see output like:

```
✅ Soccer Prediction API is running!
🌐 Public URL: https://a1b2c3d4e5f6.ngrok.io
📡 API endpoint: https://a1b2c3d4e5f6.ngrok.io/api
🔍 Health check: https://a1b2c3d4e5f6.ngrok.io/api/health
```

3. **Copy the API endpoint URL** - you'll need this for your Next.js app

### Step 4: Configure Your Next.js App

1. Start your Next.js development server:

```bash
npm install
npm run dev
```

2. Open the app in your browser (typically at http://localhost:3000)
3. Navigate to the Settings page
4. Paste the API endpoint URL from Colab into the "Colab API URL" field
5. Click "Save Settings" and then "Test Connection"
6. If successful, you should see a green "Connected" status

## Keeping the Integration Working

### Colab Session Timeouts

Google Colab sessions time out after idle periods (typically 60-90 minutes if you're not actively using the notebook). When this happens:

1. Rerun the API server code cell in your Colab notebook
2. Copy the new ngrok URL (it will change each time)
3. Update the URL in your Next.js app settings

### Extending Colab Session Time

To keep your Colab session running longer:

1. In your browser console on the Colab tab, you can paste this JavaScript code:

```javascript
function ClickConnect(){
  console.log("Clicking connect button");
  document.querySelector("colab-connect-button").shadowRoot.querySelector("#connect").click()
}
setInterval(ClickConnect, 60000)
```

2. This will automatically click the "Connect" button if your session disconnects, but it's not a permanent solution.

### Alternative: Production Deployment

For a production environment, consider:

1. Deploying your ML models to a proper cloud service (AWS, GCP, Azure)
2. Setting up a permanent API server instead of using Colab
3. Connecting your Next.js app to that permanent API

## Troubleshooting

### Common Issues

1. **API Connection Failed**: Check if your Colab notebook is still running. Rerun the API server cell.

2. **Ngrok Session Expired**: Free ngrok sessions expire after a few hours. Rerun the API server cell to get a new URL.

3. **CORS Errors**: If you see CORS errors in the browser console, make sure the Flask-CORS package is properly configured.

4. **Model Not Found**: Check your model path in the Colab notebook. Make sure it points to the correct location.

5. **Slow Responses**: Colab has limited resources. Consider optimizing your code or using a dedicated server for production.

### Testing the API Directly

You can test if the API is responding correctly without the Next.js app:

1. Open the health check URL in your browser: `https://your-ngrok-url.ngrok.io/api/health`
2. You should see a JSON response with `{"status": "healthy", ...}`

## API Endpoints Reference

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/health` | GET | Check API health | None | `{"status": "healthy", "model_loaded": true}` |
| `/api/leagues` | GET | Get all leagues | None | Array of league objects |
| `/api/teams` | GET | Get teams by league | Query param: `league` | Array of team objects |
| `/api/upcoming` | GET | Get upcoming matches | Query params: `league`, `days` | Array of match objects |
| `/api/predict` | POST | Predict single match | `{"home_team": "Team A", "away_team": "Team B", "league": "PL"}` | Prediction object |
| `/api/batch-predict` | POST | Predict multiple matches | `{"matches": [{...}, {...}]}` | Array of prediction objects |
| `/api/history` | GET | Get prediction history | None | Array of prediction objects |
