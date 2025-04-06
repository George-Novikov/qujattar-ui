const API_BASE_URL = 'http://localhost:7100/api/v1';

export interface User {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role: 'USER' | 'ADMIN';
  settings?: UserSettings;
}

export interface UserSettings {
  theme: string;
  colorScheme: string;
  locale: string;
  defaultExportFormat: string;
  autoSave: boolean;
}

export const userService = {
  // Login user
  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    try {
      // Mocked API response for development
      const mockResponse = {
        user: {
          id: 123,
          username,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          role: 'USER' as const,
          settings: {
            theme: 'LIGHT',
            colorScheme: '#4C9AFF',
            locale: 'en-US',
            defaultExportFormat: 'JSON',
            autoSave: true
          }
        },
        token: 'mock-jwt-token'
      };
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Store the token in localStorage
      localStorage.setItem('authToken', mockResponse.token);
      
      return mockResponse;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ username, password }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Login failed: ${response.statusText}`);
      // }
      // 
      // const data = await response.json();
      // localStorage.setItem('authToken', data.token);
      // 
      // return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  // Logout user
  logout(): void {
    localStorage.removeItem('authToken');
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
  
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      return null;
    }
    
    try {
      // Mocked API response for development
      const mockUser: User = {
        id: 123,
        username: 'john.doe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'USER',
        settings: {
          theme: 'LIGHT',
          colorScheme: '#4C9AFF',
          locale: 'en-US',
          defaultExportFormat: 'JSON',
          autoSave: true
        }
      };
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockUser;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/users/current`, {
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
      // 
      // if (!response.ok) {
      //   if (response.status === 401) {
      //     // Token expired or invalid, clear it
      //     localStorage.removeItem('authToken');
      //     return null;
      //   }
      //   throw new Error(`Error fetching current user: ${response.statusText}`);
      // }
      // 
      // return await response.json();
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },
  
  // Get user by ID
  async getUser(id: number): Promise<User> {
    try {
      // Mocked API response for development
      const mockUser: User = {
        id,
        username: 'user' + id,
        firstName: 'User',
        lastName: String(id),
        email: `user${id}@example.com`,
        role: 'USER'
      };
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockUser;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/users?id=${id}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Error fetching user: ${response.statusText}`);
      // }
      // 
      // return await response.json();
    } catch (error) {
      console.error(`Failed to get user with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Search users
  async searchUsers(params: { firstNameContains?: string }): Promise<User[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.firstNameContains) {
        queryParams.append('firstNameContains', params.firstNameContains);
      }
      
      // Mocked API response for development
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'user1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          role: 'USER'
        },
        {
          id: 2,
          username: 'user2',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@example.com',
          role: 'USER'
        }
      ];
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockUsers;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/users/search?${queryParams}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Error searching users: ${response.statusText}`);
      // }
      // 
      // return await response.json();
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  },
  
  // Update user settings
  async updateSettings(settings: UserSettings): Promise<UserSettings> {
    try {
      // Mocked API response for development
      const mockSettings: UserSettings = {
        ...settings
      };
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockSettings;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/settings`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //   },
      //   body: JSON.stringify(settings),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Error updating settings: ${response.statusText}`);
      // }
      // 
      // return await response.json();
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }
};