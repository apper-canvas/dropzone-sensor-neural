const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FileService {
  constructor() {
    this.files = [];
  }

  async uploadFile(fileItem) {
    await delay(300);
    
    // Simulate upload process
    const uploadedFile = {
      id: fileItem.id,
      name: fileItem.name,
      size: fileItem.size,
      type: fileItem.type,
      lastModified: fileItem.lastModified,
      uploadProgress: 100,
      status: 'completed',
      error: null,
      preview: fileItem.preview,
      uploadedAt: Date.now()
    };

    this.files.push(uploadedFile);
    return { ...uploadedFile };
  }

  async getAll() {
    await delay(200);
    return [...this.files];
  }

  async getById(id) {
    await delay(200);
    const file = this.files.find(f => f.id === id);
    return file ? { ...file } : null;
  }

  async delete(id) {
    await delay(200);
    const index = this.files.findIndex(f => f.id === id);
    if (index !== -1) {
      const deleted = this.files.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }

  async validateFile(file) {
    await delay(100);
    
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

  async clearAll() {
    await delay(200);
    this.files = [];
    return { success: true };
  }
}

export const fileService = new FileService();