import { toast } from 'react-toastify';

class UploadSessionService {
  constructor() {
    this.apperClient = null;
    this.initClient();
  }

  initClient() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    if (!this.apperClient) this.initClient();
    
    try {
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'total_files', 'total_size', 
          'uploaded_files', 'uploaded_size', 'start_time', 'end_time', 
          'status', 'created_at', 'completed_at', 'updated_at'
        ]
      };
      
      const response = await this.apperClient.fetchRecords('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching upload sessions:", error);
      toast.error("Failed to load upload sessions");
      return [];
    }
  }

  async getById(id) {
    if (!this.apperClient) this.initClient();
    
    try {
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'total_files', 'total_size', 
          'uploaded_files', 'uploaded_size', 'start_time', 'end_time', 
          'status', 'created_at', 'completed_at', 'updated_at'
        ]
      };
      
      const response = await this.apperClient.getRecordById('upload_session', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching upload session with ID ${id}:`, error);
      toast.error("Failed to load upload session");
      return null;
    }
  }

  async createUploadSession(sessionData) {
    if (!this.apperClient) this.initClient();
    
    try {
      // Only include Updateable fields
      const record = {
        Name: `Upload Session ${Date.now()}`,
        total_files: sessionData.totalFiles,
        total_size: sessionData.totalSize,
        uploaded_files: 0,
        uploaded_size: 0,
        start_time: new Date(sessionData.startTime).toISOString(),
        end_time: null,
        status: 'active',
        created_at: new Date().toISOString()
      };
      
      const params = {
        records: [record]
      };
      
      const response = await this.apperClient.createRecord('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${failedRecords}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          const sessionData = successfulRecords[0].data;
          // Return data in expected format for compatibility
          return {
            id: sessionData.Id,
            totalFiles: sessionData.total_files,
            totalSize: sessionData.total_size,
            uploadedFiles: sessionData.uploaded_files,
            uploadedSize: sessionData.uploaded_size,
            startTime: new Date(sessionData.start_time).getTime(),
            endTime: sessionData.end_time ? new Date(sessionData.end_time).getTime() : null,
            status: sessionData.status,
            createdAt: new Date(sessionData.created_at).getTime()
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating upload session:", error);
      toast.error("Failed to create upload session");
      return null;
    }
  }

  async updateUploadSession(id, updates) {
    if (!this.apperClient) this.initClient();
    
    try {
      // Only include Updateable fields plus Id
      const record = {
        Id: parseInt(id),
        ...(updates.uploadedFiles !== undefined && { uploaded_files: updates.uploadedFiles }),
        ...(updates.uploadedSize !== undefined && { uploaded_size: updates.uploadedSize }),
        ...(updates.endTime && { end_time: new Date(updates.endTime).toISOString() }),
        ...(updates.status && { status: updates.status }),
        updated_at: new Date().toISOString()
      };
      
      const params = {
        records: [record]
      };
      
      const response = await this.apperClient.updateRecord('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const sessionData = successfulUpdates[0].data;
          return {
            id: sessionData.Id,
            totalFiles: sessionData.total_files,
            totalSize: sessionData.total_size,
            uploadedFiles: sessionData.uploaded_files,
            uploadedSize: sessionData.uploaded_size,
            startTime: new Date(sessionData.start_time).getTime(),
            endTime: sessionData.end_time ? new Date(sessionData.end_time).getTime() : null,
            status: sessionData.status,
            updatedAt: new Date(sessionData.updated_at).getTime()
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating upload session:", error);
      toast.error("Failed to update upload session");
      return null;
    }
  }

  async completeUploadSession(id, completionData) {
    if (!this.apperClient) this.initClient();
    
    try {
      // Only include Updateable fields plus Id
      const record = {
        Id: parseInt(id),
        ...(completionData.uploadedFiles !== undefined && { uploaded_files: completionData.uploadedFiles }),
        ...(completionData.uploadedSize !== undefined && { uploaded_size: completionData.uploadedSize }),
        ...(completionData.endTime && { end_time: new Date(completionData.endTime).toISOString() }),
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const params = {
        records: [record]
      };
      
      const response = await this.apperClient.updateRecord('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to complete ${failedUpdates.length} records:${failedUpdates}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          const sessionData = successfulUpdates[0].data;
          return {
            id: sessionData.Id,
            totalFiles: sessionData.total_files,
            totalSize: sessionData.total_size,
            uploadedFiles: sessionData.uploaded_files,
            uploadedSize: sessionData.uploaded_size,
            startTime: new Date(sessionData.start_time).getTime(),
            endTime: new Date(sessionData.end_time).getTime(),
            status: sessionData.status,
            completedAt: new Date(sessionData.completed_at).getTime()
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error completing upload session:", error);
      toast.error("Failed to complete upload session");
      return null;
    }
  }

  async getActiveSessions() {
    if (!this.apperClient) this.initClient();
    
    try {
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'total_files', 'total_size', 
          'uploaded_files', 'uploaded_size', 'start_time', 'end_time', 
          'status', 'created_at', 'completed_at', 'updated_at'
        ],
        where: [
          {
            fieldName: "status",
            operator: "ExactMatch",
            values: ["active"]
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching active upload sessions:", error);
      toast.error("Failed to load active sessions");
      return [];
    }
  }

  async delete(id) {
    if (!this.apperClient) this.initClient();
    
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('upload_session', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${failedDeletions}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting upload session:", error);
      toast.error("Failed to delete upload session");
      return false;
    }
  }
}

export const uploadSessionService = new UploadSessionService();