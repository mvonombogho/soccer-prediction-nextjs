/**
 * API client for communicating with the Colab prediction backend
 */

// This would normally come from an environment variable
// For development, you'll get this URL from the ngrok output in your Colab notebook
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-ngrok-url.ngrok.io/api';

/**
 * Make a prediction for a single match
 */
export async function predictMatch(homeTeam, awayTeam, league, date = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        home_team: homeTeam,
        away_team: awayTeam,
        league,
        date,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to make prediction');
    }

    return await response.json();
  } catch (error) {
    console.error('Prediction error:', error);
    throw error;
  }
}

/**
 * Make batch predictions for multiple matches
 */
export async function batchPredict(matches) {
  try {
    const response = await fetch(`${API_BASE_URL}/batch-predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        matches,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to make batch predictions');
    }

    return await response.json();
  } catch (error) {
    console.error('Batch prediction error:', error);
    throw error;
  }
}

/**
 * Get all available leagues
 */
export async function getLeagues() {
  try {
    const response = await fetch(`${API_BASE_URL}/leagues`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch leagues');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching leagues:', error);
    throw error;
  }
}

/**
 * Get teams for a specific league
 */
export async function getTeams(league = 'PL') {
  try {
    const response = await fetch(`${API_BASE_URL}/teams?league=${league}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch teams');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
}

/**
 * Get upcoming matches
 */
export async function getUpcomingMatches(league = null, days = 7) {
  try {
    let url = `${API_BASE_URL}/upcoming?days=${days}`;
    if (league) {
      url += `&league=${league}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch upcoming matches');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    throw error;
  }
}

/**
 * Get prediction history
 */
export async function getPredictionHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/history`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch prediction history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    throw error;
  }
}

/**
 * Health check for the API
 */
export async function checkApiHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      return { status: 'unhealthy', error: 'API returned non-200 status' };
    }

    return await response.json();
  } catch (error) {
    console.error('API health check error:', error);
    return { status: 'unhealthy', error: error.message };
  }
}

/**
 * Get mock data when API is unavailable (for development)
 */
export function getMockData(dataType) {
  switch (dataType) {
    case 'leagues':
      return [
        { id: 'PL', name: 'Premier League', country: 'England' },
        { id: 'LL', name: 'La Liga', country: 'Spain' },
        { id: 'BL', name: 'Bundesliga', country: 'Germany' },
        { id: 'SA', name: 'Serie A', country: 'Italy' },
        { id: 'L1', name: 'Ligue 1', country: 'France' }
      ];
    
    case 'teams':
      return [
        { id: 1, name: 'Manchester United', league: 'PL' },
        { id: 2, name: 'Liverpool', league: 'PL' },
        { id: 3, name: 'Arsenal', league: 'PL' },
        { id: 4, name: 'Real Madrid', league: 'LL' },
        { id: 5, name: 'Barcelona', league: 'LL' }
      ];
    
    case 'upcoming':
      return [
        {
          id: 1,
          home_team: 'Manchester United',
          away_team: 'Liverpool',
          league: 'PL',
          date: '2025-03-25',
          time: '15:00'
        },
        {
          id: 2,
          home_team: 'Arsenal',
          away_team: 'Chelsea',
          league: 'PL',
          date: '2025-03-26',
          time: '19:45'
        },
        {
          id: 3,
          home_team: 'Barcelona',
          away_team: 'Real Madrid',
          league: 'LL',
          date: '2025-03-27',
          time: '20:00'
        }
      ];
    
    default:
      return null;
  }
}