import { toast } from 'react-toastify';

class FileService {
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
          'ModifiedOn', 'ModifiedBy', 'size', 'type', 'last_modified',
          'upload_progress', 'status', 'error', 'preview', 'uploaded_at'
        ]
      };
      
      const response = await this.apperClient.fetchRecords('file_item', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files");
      return [];
    }
  }

  async getById(id) {
    if (!this.apperClient) this.initClient();
    
    try {
      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'size', 'type', 'last_modified',
          'upload_progress', 'status', 'error', 'preview', 'uploaded_at'
        ]
      };
      
      const response = await this.apperClient.getRecordById('file_item', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching file with ID ${id}:`, error);
      toast.error("Failed to load file");
      return null;
    }
  }

  async create(fileItem) {
    if (!this.apperClient) this.initClient();
    
    try {
      // Only include Updateable fields
      const record = {
        Name: fileItem.name,
        size: fileItem.size,
        type: fileItem.type,
        last_modified: new Date(fileItem.lastModified).toISOString(),
        upload_progress: fileItem.uploadProgress || 0,
        status: fileItem.status || 'pending',
        error: fileItem.error || null,
        preview: fileItem.preview || null,
        uploaded_at: fileItem.uploadedAt ? new Date(fileItem.uploadedAt).toISOString() : null
      };
      
      const params = {
        records: [record]
      };
      
      const response = await this.apperClient.createRecord('file_item', params);
      
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
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error creating file:", error);
      toast.error("Failed to create file");
      return null;
    }
  }

  async update(id, updateData) {
    if (!this.apperClient) this.initClient();
    
    try {
      // Only include Updateable fields plus Id
      const record = {
        Id: parseInt(id),
        ...(updateData.name && { Name: updateData.name }),
        ...(updateData.size !== undefined && { size: updateData.size }),
        ...(updateData.type && { type: updateData.type }),
        ...(updateData.lastModified && { last_modified: new Date(updateData.lastModified).toISOString() }),
        ...(updateData.uploadProgress !== undefined && { upload_progress: updateData.uploadProgress }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.error !== undefined && { error: updateData.error }),
        ...(updateData.preview !== undefined && { preview: updateData.preview }),
        ...(updateData.uploadedAt && { uploaded_at: new Date(updateData.uploadedAt).toISOString() })
      };
      
      const params = {
        records: [record]
      };
      
      const response = await this.apperClient.updateRecord('file_item', params);
      
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
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
      
      return null;
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error("Failed to update file");
      return null;
    }
  }

  async delete(id) {
    if (!this.apperClient) this.initClient();
    
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('file_item', params);
      
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
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
      return false;
    }
  }

  async validateFile(file) {
    const acceptedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'text/csv',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!acceptedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not supported`
      };
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      return {
        valid: false,
        error: 'File size must be less than 50MB'
      };
    }

    return { valid: true, error: null };
  }

  // Legacy method for compatibility with existing upload flow
  async uploadFile(fileItem) {
    return await this.create({
      name: fileItem.name,
      size: fileItem.size,
      type: fileItem.type,
      lastModified: fileItem.lastModified,
      uploadProgress: 100,
      status: 'completed',
      error: null,
      preview: fileItem.preview,
      uploadedAt: Date.now()
    });
  }
}

export const fileService = new FileService();