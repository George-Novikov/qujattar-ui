const API_BASE_URL = 'http://localhost:7100/api/v1';

export interface Resource {
  id: number;
  title: string;
  type: 'IMAGE' | 'DOCUMENT' | 'OTHER';
  url: string;
  thumbnailUrl?: string;
  createdBy: number;
  createdAt: string;
}

export const resourceService = {
  // Upload a resource
  async uploadResource(file: File, title?: string): Promise<Resource> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (title) {
        formData.append('title', title);
      }
      
      // Mocked API response for development
      const mockResource: Resource = {
        id: Math.floor(Math.random() * 1000),
        title: title || file.name,
        type: file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT',
        url: URL.createObjectURL(file),
        createdBy: 123, // Mock user ID
        createdAt: new Date().toISOString()
      };
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResource;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/resources`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //   },
      //   body: formData,
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Error uploading resource: ${response.statusText}`);
      // }
      // 
      // return await response.json();
    } catch (error) {
      console.error('Failed to upload resource:', error);
      throw error;
    }
  },
  
  // Get resource by ID
  async getResource(id: number): Promise<Resource> {
    try {
      // Mocked API response for development
      const mockResource: Resource = {
        id,
        title: `Resource ${id}`,
        type: 'IMAGE',
        url: `http://localhost:7100/api/v1/resources?id=${id}`,
        createdBy: 123,
        createdAt: new Date().toISOString()
      };
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResource;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/resources?id=${id}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Error fetching resource: ${response.statusText}`);
      // }
      // 
      // return await response.json();
    } catch (error) {
      console.error(`Failed to get resource with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Search resources
  async searchResources(params: { titleContains?: string; userID?: number }): Promise<Resource[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.titleContains) {
        queryParams.append('titleContains', params.titleContains);
      }
      
      if (params.userID) {
        queryParams.append('userID', params.userID.toString());
      }
      
      // Mocked API response for development
      const mockResources: Resource[] = [
        {
          id: 1,
          title: 'Resource 1',
          type: 'IMAGE',
          url: 'http://localhost:7100/api/v1/resources?id=1',
          createdBy: 123,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Resource 2',
          type: 'DOCUMENT',
          url: 'http://localhost:7100/api/v1/resources?id=2',
          createdBy: 123,
          createdAt: new Date().toISOString()
        }
      ];
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResources;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/resources/search?${queryParams}`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Error searching resources: ${response.statusText}`);
      // }
      // 
      // return await response.json();
    } catch (error) {
      console.error('Failed to search resources:', error);
      throw error;
    }
  },
  
  // Delete resource
  async deleteResource(id: number): Promise<void> {
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/resources?id=${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      //   },
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Error deleting resource: ${response.statusText}`);
      // }
    } catch (error) {
      console.error(`Failed to delete resource with ID ${id}:`, error);
      throw error;
    }
  }
};