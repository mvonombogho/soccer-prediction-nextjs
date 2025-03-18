# Soccer Match Prediction System - Next.js Frontend

This is the Next.js frontend for the Soccer Match Prediction System that integrates with a Google Colab backend where the machine learning models run.

## Architecture

The application follows a distributed architecture:

- **Frontend**: Next.js web application providing UI for predictions and visualizations
- **Backend**: Python-based prediction engine running on Google Colab
- **Integration**: API endpoints exposed from Colab via ngrok

## Features

- Match prediction interface
- Historical prediction analysis
- League and team statistics
- Visualizations of prediction accuracy
- Team performance metrics

## Setup Instructions

### Prerequisites

- Node.js 18+
- Google Colab account (for the backend)
- ngrok account (for exposing Colab API)

### Installation

1. Clone this repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file with the required environment variables (see below)
4. Start the development server with `npm run dev`

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```
NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok.io/api
```

This URL will be generated when you run the Colab notebook.

## Colab Integration

The Next.js frontend communicates with the prediction models running in Google Colab via API endpoints. To set this up:

1. Open the Colab notebook containing the prediction system
2. Run the API server cells that expose the endpoints through ngrok
3. Copy the generated ngrok URL and set it as the `NEXT_PUBLIC_API_URL` in your environment variables

## Development

- Run the development server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
