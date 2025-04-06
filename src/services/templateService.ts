import { Template } from '../models/Template';

const API_BASE_URL = 'http://localhost:7100/api/v1';

export const templateService = {
  // Create a new template
  async createTemplate(template: Template): Promise<Template> {
    try {
      // Mocked API response for development
      const mockResponse = {
        ...template,
        id: Math.floor(Math.random() * 1000)
      };
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResponse;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/templates`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(template),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Error creating template: ${response.statusText}`);
      // }
      // 
      // return await response.json();
    } catch (error) {
      console.error('Failed to create template:', error);
      throw error;
    }
  },
  
  // Get template by ID
  async getTemplate(id: number): Promise<Template> {
    try {
      // Mocked API response for development
      const mockResponse: Template = {
        id,
        props: {
          title: 'Sample Template',
          orientation: 'VERTICAL',
          format: 'A4',
          snapToGrid: false,
          access: 'PUBLIC',
          background: '#FFFFFF'
        },
        columns: [
          {
            order: 0,
            props: {
              height: 100,
              width: 100,
              x: 50,
              y: 50
            },
            rows: [
              {
                order: 0,
                props: {
                  height: 20,
                  width: 100,
                  x: 50,
                  y: 10
                },
                elements: [
                  {
                    id: 'text-1',
                    order: 0,
                    type: 'text',
                    values: ['Sample Text'],
                    props: {
                      color: '#000000',
                      horizontalAlignment: 'center',
                      verticalAlignment: 'center',
                      font: 'Roboto',
                      fontSize: '16'
                    }
                  }
                ]
              }
            ]
          }
        ]
      };
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResponse;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/templates?id=${id}`);
      // 
      // if (!response.ok) {
      //   throw new Error(`Error fetching template: ${response.statusText}`);
      // }
      // 
      // return await response.json();
    } catch (error) {
      console.error(`Failed to get template with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Search templates
  async searchTemplates(params: { titleContains?: string; userID?: number }): Promise<Template[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.titleContains) {
        queryParams.append('titleContains', params.titleContains);
      }
      
      if (params.userID) {
        queryParams.append('userID', params.userID.toString());
      }
      
      // Mocked API response for development
      const mockResponse: Template[] = [
        {
          id: 1,
          props: {
            title: 'Template 1',
            orientation: 'VERTICAL',
            format: 'A4',
            snapToGrid: false,
            access: 'PUBLIC'
          },
          columns: []
        },
        {
          id: 2,
          props: {
            title: 'Template 2',
            orientation: 'LANDSCAPE',
            format: 'A4',
            snapToGrid: true,
            access: 'PRIVATE'
          },
          columns: []
        }
      ];
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockResponse;
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/templates/search?${queryParams}`);
      // 
      // if (!response.ok) {
      //   throw new Error(`Error searching templates: ${response.statusText}`);
      // }
      // 
      // return await response.json();
    } catch (error) {
      console.error('Failed to search templates:', error);
      throw error;
    }
  },
  
  // Delete template
  async deleteTemplate(id: number): Promise<void> {
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Actual API call (commented out until backend is ready)
      // const response = await fetch(`${API_BASE_URL}/templates?id=${id}`, {
      //   method: 'DELETE',
      // });
      // 
      // if (!response.ok) {
      //   throw new Error(`Error deleting template: ${response.statusText}`);
      // }
    } catch (error) {
      console.error(`Failed to delete template with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Export template to different formats
  async exportTemplate(template: Template, format: 'JSON' | 'ODT' | 'DOC'): Promise<Blob> {
    try {
      if (format === 'JSON') {
        // For JSON format, we can simply stringify the template
        const jsonString = JSON.stringify(template, null, 2);
        return new Blob([jsonString], { type: 'application/json' });
      } else {
        // For other formats, we would typically call a backend endpoint
        // Mocked Blob for development
        const mockBlob = new Blob(['Mocked document content'], { 
          type: format === 'ODT' ? 'application/vnd.oasis.opendocument.text' : 'application/msword' 
        });
        
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockBlob;
        
        // Actual API call (commented out until backend is ready)
        // const response = await fetch(`${API_BASE_URL}/convert`, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     template,
        //     outputFormat: format
        //   }),
        // });
        // 
        // if (!response.ok) {
        //   throw new Error(`Error exporting template: ${response.statusText}`);
        // }
        // 
        // return await response.blob();
      }
    } catch (error) {
      console.error(`Failed to export template to ${format}:`, error);
      throw error;
    }
  },
  
  // Import template from file
  async importTemplate(file: File): Promise<Template> {
    try {
      if (file.type === 'application/json') {
        // For JSON files, parse directly
        const text = await file.text();
        return JSON.parse(text) as Template;
      } else {
        // For other formats, we would call a backend endpoint
        // Mocked response for development
        const mockTemplate: Template = {
          props: {
            title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
            orientation: 'VERTICAL',
            format: 'A4',
            snapToGrid: false,
            access: 'PRIVATE'
          },
          columns: []
        };
        
        // Simulating API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return mockTemplate;
        
        // Actual API call (commented out until backend is ready)
        // const formData = new FormData();
        // formData.append('file', file);
        // 
        // const response = await fetch(`${API_BASE_URL}/convert`, {
        //   method: 'POST',
        //   body: formData,
        // });
        // 
        // if (!response.ok) {
        //   throw new Error(`Error importing template: ${response.statusText}`);
        // }
        // 
        // return await response.json();
      }
    } catch (error) {
      console.error('Failed to import template:', error);
      throw error;
    }
  }
};