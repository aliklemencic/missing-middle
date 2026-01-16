/**
 * Custom error class for API errors
 */
class APIError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'APIError';
    this.status = status;
  }
}

/**
 * Fetch population data
 */
export async function fetchPopulationData(year1, year2, city) {
  try {
    const res = await fetch('/api/population', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year1,
        year2,
        city
      })
    });
    
    const data = await res.json();
    
    // Check if response is an error
    if (!res.ok) {
      throw new APIError(data.error || 'Failed to fetch population data', res.status);
    }
    
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    // Network errors, JSON parsing errors, etc.
    throw new APIError('Network error: Could not connect to server', 0);
  }
}

/**
 * Fetch housing data
 */
export async function fetchHousingData(year1, year2, city, city_change_absolute, city_change_percent) {
  try {
    const res = await fetch('/api/housing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        year1,
        year2,
        city,
        city_change_absolute,
        city_change_percent
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new APIError(data.error || 'Failed to fetch housing data', res.status);
    }
    
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Network error: Could not connect to server', 0);
  }
}
