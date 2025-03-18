'use client';

import React, { useState, useEffect } from 'react';
import { getLeagues, getTeams, predictMatch, checkApiHealth, getMockData } from '@/lib/api';
import { format } from 'date-fns';

export default function PredictionsPage() {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchDate, setMatchDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  // Check API health when component mounts
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await checkApiHealth();
        setApiStatus(health.status);
        
        // If API is healthy, load leagues
        if (health.status === 'healthy') {
          loadLeagues();
        } else {
          // Use mock data if API is unavailable
          setLeagues(getMockData('leagues'));
        }
      } catch (error) {
        console.error("Error checking API health:", error);
        setApiStatus('unhealthy');
        setLeagues(getMockData('leagues'));
      }
    };
    
    checkHealth();
  }, []);

  // Load teams when league changes
  useEffect(() => {
    if (selectedLeague) {
      loadTeams(selectedLeague);
    }
  }, [selectedLeague]);

  const loadLeagues = async () => {
    try {
      const data = await getLeagues();
      setLeagues(data);
      if (data.length > 0) {
        setSelectedLeague(data[0].id);
      }
    } catch (error) {
      console.error("Error loading leagues:", error);
      setError("Failed to load leagues. Using sample data instead.");
      // Fallback to mock data
      const mockLeagues = getMockData('leagues');
      setLeagues(mockLeagues);
      if (mockLeagues.length > 0) {
        setSelectedLeague(mockLeagues[0].id);
      }
    }
  };

  const loadTeams = async (league) => {
    try {
      if (apiStatus === 'healthy') {
        const data = await getTeams(league);
        setTeams(data);
      } else {
        // Use mock data if API is unavailable
        setTeams(getMockData('teams').filter(team => team.league === league));
      }
    } catch (error) {
      console.error("Error loading teams:", error);
      setError("Failed to load teams. Using sample data instead.");
      // Fallback to mock data
      setTeams(getMockData('teams').filter(team => team.league === league));
    }
  };

  const handleLeagueChange = (e) => {
    setSelectedLeague(e.target.value);
    setHomeTeam('');
    setAwayTeam('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Validate inputs
      if (!selectedLeague || !homeTeam || !awayTeam) {
        throw new Error("Please select a league, home team, and away team");
      }

      if (homeTeam === awayTeam) {
        throw new Error("Home team and away team cannot be the same");
      }

      let result;
      
      if (apiStatus === 'healthy') {
        // Call the actual API
        result = await predictMatch(homeTeam, awayTeam, selectedLeague, matchDate);
      } else {
        // Generate mock prediction if API is unavailable
        result = generateMockPrediction(homeTeam, awayTeam, selectedLeague);
      }
      
      setPrediction(result);
    } catch (error) {
      console.error("Prediction error:", error);
      setError(error.message || "An error occurred while making the prediction");
      
      // Generate mock prediction for demonstration
      if (apiStatus !== 'healthy') {
        const mockResult = generateMockPrediction(homeTeam, awayTeam, selectedLeague);
        setPrediction(mockResult);
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate mock prediction for development/demo purposes
  const generateMockPrediction = (homeTeam, awayTeam, league) => {
    const homeWinProb = Math.random() * 0.5 + 0.25;
    const drawProb = Math.random() * 0.3 + 0.15;
    const awayWinProb = 1 - homeWinProb - drawProb;
    
    const homeGoals = Math.floor(Math.random() * 3);
    const awayGoals = Math.floor(Math.random() * 3);
    
    return {
      match_id: `mock-${Date.now()}`,
      home_team: homeTeam,
      away_team: awayTeam,
      league: league,
      match_date: matchDate,
      probabilities: {
        home_win: homeWinProb.toFixed(4),
        draw: drawProb.toFixed(4),
        away_win: awayWinProb.toFixed(4)
      },
      predicted_result: homeWinProb > drawProb && homeWinProb > awayWinProb 
        ? 'HOME_WIN' 
        : awayWinProb > homeWinProb && awayWinProb > drawProb 
          ? 'AWAY_WIN' 
          : 'DRAW',
      predicted_score: {
        home: homeGoals,
        away: awayGoals
      },
      confidence: (Math.random() * 0.3 + 0.6).toFixed(4),
      insights: [
        `${homeTeam} has strong home form recently.`,
        `${awayTeam} has struggled in away matches this season.`,
        'Historical head-to-head matches favor the home team.',
        'Weather conditions are favorable for high-scoring game.'
      ],
      key_factors: [
        'Recent form',
        'Home advantage',
        'Head-to-head record',
        'Squad availability'
      ],
      timestamp: new Date().toISOString(),
      is_mock: true
    };
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6">Match Prediction</h1>
        
        {apiStatus === 'unhealthy' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  The Colab API is currently unavailable. Using mock data for demonstration purposes.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="league" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              League
            </label>
            <select
              id="league"
              value={selectedLeague}
              onChange={handleLeagueChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            >
              <option value="">Select a league</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name} ({league.country})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="homeTeam" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Home Team
              </label>
              <select
                id="homeTeam"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                disabled={!selectedLeague || teams.length === 0}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
              >
                <option value="">Select home team</option>
                {teams.map((team) => (
                  <option key={`home-${team.id}`} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="awayTeam" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Away Team
              </label>
              <select
                id="awayTeam"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                disabled={!selectedLeague || teams.length === 0}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
              >
                <option value="">Select away team</option>
                {teams.map((team) => (
                  <option key={`away-${team.id}`} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="matchDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Match Date
            </label>
            <input
              type="date"
              id="matchDate"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || !selectedLeague || !homeTeam || !awayTeam}
              className="bg-primary-600 text-white py-2 px-8 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Predicting...' : 'Predict Match'}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {prediction && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="bg-primary-700 text-white py-4 px-6">
            <h2 className="text-xl font-bold">Prediction Results</h2>
            {prediction.is_mock && (
              <span className="bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded ml-2">
                MOCK DATA
              </span>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="text-center md:text-left mb-4 md:mb-0">
                <h3 className="text-xl font-bold">{prediction.home_team}</h3>
                <p className="text-gray-500 dark:text-gray-400">Home Team</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{prediction.predicted_score.home}</div>
                </div>
                <div className="text-xl">vs</div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{prediction.predicted_score.away}</div>
                </div>
              </div>
              
              <div className="text-center md:text-right mt-4 md:mt-0">
                <h3 className="text-xl font-bold">{prediction.away_team}</h3>
                <p className="text-gray-500 dark:text-gray-400">Away Team</p>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
              <h4 className="text-lg font-semibold mb-2">Prediction Outcome</h4>
              <div className="flex justify-between">
                <div className="text-center flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Home Win</div>
                  <div className="text-lg font-medium">{(parseFloat(prediction.probabilities.home_win) * 100).toFixed(1)}%</div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full mt-1">
                    <div 
                      className="h-2 bg-primary-500 rounded-full" 
                      style={{ width: `${parseFloat(prediction.probabilities.home_win) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center flex-1 mx-2">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Draw</div>
                  <div className="text-lg font-medium">{(parseFloat(prediction.probabilities.draw) * 100).toFixed(1)}%</div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full mt-1">
                    <div 
                      className="h-2 bg-yellow-500 rounded-full" 
                      style={{ width: `${parseFloat(prediction.probabilities.draw) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Away Win</div>
                  <div className="text-lg font-medium">{(parseFloat(prediction.probabilities.away_win) * 100).toFixed(1)}%</div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full mt-1">
                    <div 
                      className="h-2 bg-secondary-500 rounded-full" 
                      style={{ width: `${parseFloat(prediction.probabilities.away_win) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">Key Insights</h4>
                <ul className="space-y-2">
                  {prediction.insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-2">Key Factors</h4>
                <ul className="space-y-2">
                  {prediction.key_factors.map((factor, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="h-5 w-5 text-primary-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                      </svg>
                      <span>{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Model Confidence</span>
                  <div className="text-lg font-medium">{(parseFloat(prediction.confidence) * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Prediction Time</span>
                  <div className="text-sm">{new Date(prediction.timestamp).toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}