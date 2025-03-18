# Soccer Prediction System API for Next.js Integration
# Add this code to your Google Colab notebook

# Install required packages
!pip install flask flask-cors pyngrok

# Import libraries
from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import pickle
import pandas as pd
from pyngrok import ngrok
import sys
import threading
import time

# Add these imports if you already have your prediction system modules
# from soccer_prediction_system import SoccerMatchPredictor, DataLoader, FeatureEngineering

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# =====================================================
# REPLACE THIS SECTION WITH YOUR MODEL LOADING CODE
# This is just a placeholder for demonstration
# =====================================================

class MockPredictor:
    """Mock predictor class to simulate the real prediction system"""
    def __init__(self):
        self.model_loaded = True
        self.leagues = [
            {"id": "PL", "name": "Premier League", "country": "England"},
            {"id": "LL", "name": "La Liga", "country": "Spain"},
            {"id": "BL", "name": "Bundesliga", "country": "Germany"},
            {"id": "SA", "name": "Serie A", "country": "Italy"},
            {"id": "L1", "name": "Ligue 1", "country": "France"}
        ]
        self.teams = {
            "PL": [
                {"id": 1, "name": "Manchester United", "league": "PL"},
                {"id": 2, "name": "Liverpool", "league": "PL"},
                {"id": 3, "name": "Arsenal", "league": "PL"},
                {"id": 4, "name": "Chelsea", "league": "PL"},
                {"id": 5, "name": "Manchester City", "league": "PL"}
            ],
            "LL": [
                {"id": 6, "name": "Real Madrid", "league": "LL"},
                {"id": 7, "name": "Barcelona", "league": "LL"},
                {"id": 8, "name": "Atletico Madrid", "league": "LL"},
                {"id": 9, "name": "Sevilla", "league": "LL"},
                {"id": 10, "name": "Valencia", "league": "LL"}
            ],
            "BL": [
                {"id": 11, "name": "Bayern Munich", "league": "BL"},
                {"id": 12, "name": "Borussia Dortmund", "league": "BL"},
                {"id": 13, "name": "RB Leipzig", "league": "BL"},
                {"id": 14, "name": "Bayer Leverkusen", "league": "BL"},
                {"id": 15, "name": "Wolfsburg", "league": "BL"}
            ],
            "SA": [
                {"id": 16, "name": "Juventus", "league": "SA"},
                {"id": 17, "name": "Inter Milan", "league": "SA"},
                {"id": 18, "name": "AC Milan", "league": "SA"},
                {"id": 19, "name": "Roma", "league": "SA"},
                {"id": 20, "name": "Napoli", "league": "SA"}
            ],
            "L1": [
                {"id": 21, "name": "PSG", "league": "L1"},
                {"id": 22, "name": "Lyon", "league": "L1"},
                {"id": 23, "name": "Marseille", "league": "L1"},
                {"id": 24, "name": "Lille", "league": "L1"},
                {"id": 25, "name": "Monaco", "league": "L1"}
            ]
        }
        self.prediction_history = []
        
    def is_model_loaded(self):
        return self.model_loaded
    
    def predict_match(self, home_team, away_team, league, match_date=None):
        """Simulate match prediction"""
        import random
        from datetime import datetime
        
        home_win_prob = random.random() * 0.5 + 0.25
        draw_prob = random.random() * 0.3 + 0.15
        away_win_prob = 1 - home_win_prob - draw_prob
        
        home_goals = int(random.random() * 3)
        away_goals = int(random.random() * 3)
        
        prediction = {
            "match_id": f"mock-{int(time.time())}",
            "home_team": home_team,
            "away_team": away_team,
            "league": league,
            "match_date": match_date or datetime.now().strftime("%Y-%m-%d"),
            "probabilities": {
                "home_win": round(home_win_prob, 4),
                "draw": round(draw_prob, 4),
                "away_win": round(away_win_prob, 4)
            },
            "predicted_result": "HOME_WIN" if home_win_prob > draw_prob and home_win_prob > away_win_prob else 
                               "AWAY_WIN" if away_win_prob > home_win_prob and away_win_prob > draw_prob else 
                               "DRAW",
            "predicted_score": {
                "home": home_goals,
                "away": away_goals
            },
            "confidence": round(random.random() * 0.3 + 0.6, 4),
            "insights": [
                f"{home_team} has strong home form recently.",
                f"{away_team} has struggled in away matches this season.",
                "Historical head-to-head matches favor the home team.",
                "Weather conditions are favorable for high-scoring game."
            ],
            "key_factors": [
                "Recent form",
                "Home advantage",
                "Head-to-head record",
                "Squad availability"
            ],
            "timestamp": datetime.now().isoformat(),
        }
        
        self.prediction_history.append(prediction)
        return prediction
    
    def get_available_leagues(self):
        return self.leagues
    
    def get_teams_by_league(self, league):
        return self.teams.get(league, [])
    
    def get_upcoming_matches(self, league=None, days=7):
        """Simulate upcoming matches"""
        import random
        from datetime import datetime, timedelta
        
        matches = []
        league_list = [league] if league else list(self.teams.keys())
        
        for l in league_list:
            teams = self.teams.get(l, [])
            team_count = len(teams)
            
            if team_count < 2:
                continue
                
            # Generate 2-3 matches per league
            num_matches = random.randint(2, 3)
            for i in range(num_matches):
                home_idx = random.randint(0, team_count - 1)
                away_idx = random.randint(0, team_count - 1)
                
                # Ensure home and away teams are different
                while home_idx == away_idx:
                    away_idx = random.randint(0, team_count - 1)
                
                match_date = (datetime.now() + timedelta(days=random.randint(1, days))).strftime("%Y-%m-%d")
                match_time = f"{random.randint(12, 21)}:{random.choice(['00', '15', '30', '45'])}"
                
                matches.append({
                    "id": f"fixture-{int(time.time())}-{i}",
                    "home_team": teams[home_idx]["name"],
                    "away_team": teams[away_idx]["name"],
                    "league": l,
                    "date": match_date,
                    "time": match_time
                })
                
        return matches
    
    def load_prediction_history(self):
        return self.prediction_history
    
    def save_prediction(self, prediction):
        self.prediction_history.append(prediction)
    
    def save_batch_predictions(self, predictions):
        self.prediction_history.extend(predictions)

# Initialize predictor
# Replace this with your actual predictor initialization
# predictor = SoccerMatchPredictor()
# predictor.load_model('/content/drive/MyDrive/Soccer_Prediction_System/models/saved_models/ensemble_20250308191858')

# For demonstration, use the mock predictor
predictor = MockPredictor()

# =====================================================
# API ROUTES
# =====================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({
        'status': 'healthy', 
        'model_loaded': predictor.is_model_loaded(),
        'timestamp': time.time()
    })

@app.route('/api/predict', methods=['POST'])
def predict_match():
    """
    Predict the outcome of a match
    Expected JSON format:
    {
        "home_team": "Team A",
        "away_team": "Team B",
        "league": "PL",
        "date": "2025-03-20"
    }
    """
    try:
        data = request.json
        
        # Validate request data
        required_fields = ['home_team', 'away_team', 'league']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Make prediction
        prediction = predictor.predict_match(
            home_team=data['home_team'],
            away_team=data['away_team'],
            league=data['league'],
            match_date=data.get('date', None)
        )
        
        # Save prediction to history if needed
        predictor.save_prediction(prediction)
        
        return jsonify(prediction)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/leagues', methods=['GET'])
def get_leagues():
    """Get all available leagues"""
    try:
        leagues = predictor.get_available_leagues()
        return jsonify(leagues)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/teams', methods=['GET'])
def get_teams():
    """Get teams for a specific league"""
    league = request.args.get('league', 'PL')
    try:
        teams = predictor.get_teams_by_league(league)
        return jsonify(teams)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upcoming', methods=['GET'])
def get_upcoming_matches():
    """Get upcoming matches"""
    league = request.args.get('league', None)
    days = int(request.args.get('days', 7))
    try:
        matches = predictor.get_upcoming_matches(league=league, days=days)
        return jsonify(matches)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history', methods=['GET'])
def get_prediction_history():
    """Get prediction history"""
    try:
        history = predictor.load_prediction_history()
        return jsonify(history)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/batch-predict', methods=['POST'])
def batch_predict():
    """
    Make predictions for multiple matches
    Expected JSON format:
    {
        "matches": [
            {
                "home_team": "Team A",
                "away_team": "Team B",
                "league": "PL",
                "date": "2025-03-20"
            },
            ...
        ]
    }
    """
    try:
        data = request.json
        if 'matches' not in data or not isinstance(data['matches'], list):
            return jsonify({'error': 'Invalid request format'}), 400
        
        predictions = []
        for match in data['matches']:
            prediction = predictor.predict_match(
                home_team=match['home_team'],
                away_team=match['away_team'],
                league=match['league'],
                match_date=match.get('date', None)
            )
            predictions.append(prediction)
        
        # Save batch predictions
        predictor.save_batch_predictions(predictions)
        
        return jsonify(predictions)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Function to start ngrok and display the public URL
def start_ngrok(port):
    # Uncomment the line below and add your ngrok auth token
    # ngrok.set_auth_token("YOUR_NGROK_AUTH_TOKEN")
    
    public_url = ngrok.connect(port).public_url
    print(f"\n\n✅ Soccer Prediction API is running!")
    print(f"🌐 Public URL: {public_url}")
    print(f"📡 API endpoint: {public_url}/api")
    print(f"🔍 Health check: {public_url}/api/health")
    print("\n📋 Available endpoints:")
    print("  - GET  /api/health         - Check API health")
    print("  - GET  /api/leagues        - Get all leagues")
    print("  - GET  /api/teams?league=PL - Get teams for a league")
    print("  - GET  /api/upcoming       - Get upcoming matches")
    print("  - GET  /api/history        - Get prediction history")
    print("  - POST /api/predict        - Predict a single match")
    print("  - POST /api/batch-predict  - Predict multiple matches")
    print("\n⚠️ Important: Copy the API endpoint URL to your Next.js app's settings page!")
    
    # Save URL to a variable that can be accessed from other cells
    global api_url
    api_url = f"{public_url}/api"
    
    return public_url

# Create a function to run the Flask app in a thread
def run_flask_app():
    app.run(port=5000)

# Function to start the API server
def start_api_server():
    # Start Flask app in a thread
    flask_thread = threading.Thread(target=run_flask_app)
    flask_thread.daemon = True
    flask_thread.start()
    
    # Give Flask a moment to start
    time.sleep(2)
    
    # Start ngrok
    public_url = start_ngrok(5000)
    
    return public_url

# Start the API server when this script is run
if __name__ == '__main__' or 'google.colab' in sys.modules:
    api_url = start_api_server()
