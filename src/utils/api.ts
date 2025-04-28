import { auth } from '../config/firebase';

export const getAuthToken = async (forceRefresh = false): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No current user found');
    return null;
  }

  try {
    const token = await user.getIdToken(forceRefresh);
    console.log('Token retrieved successfully');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  try {
    // Try to get a fresh token first
    let token = await getAuthToken(true);
    
    // If that fails, try to get the cached token
    if (!token) {
      token = await getAuthToken();
    }

    if (!token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    console.log('Making authenticated request to:', url);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If the token is expired, try to refresh it and retry the request
    if (response.status === 401) {
      console.log('Token expired, attempting to refresh...');
      const newToken = await getAuthToken(true);
      
      if (newToken) {
        const newHeaders = {
          ...headers,
          'Authorization': `Bearer ${newToken}`,
        };
        
        const retryResponse = await fetch(url, {
          ...options,
          headers: newHeaders,
        });
        
        if (retryResponse.ok) {
          return retryResponse;
        }
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('API request failed:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Error in authenticatedFetch:', error);
    throw error;
  }
}; 