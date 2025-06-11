const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UploadSessionService {
  constructor() {
    this.sessions = [];
  }

  async createUploadSession(sessionData) {
    await delay(200);
    
    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      totalFiles: sessionData.totalFiles,
      totalSize: sessionData.totalSize,
      uploadedFiles: 0,
      uploadedSize: 0,
      startTime: sessionData.startTime,
      endTime: null,
      status: 'active',
      createdAt: Date.now()
    };

    this.sessions.push(session);
    return { ...session };
  }

  async updateUploadSession(id, updates) {
    await delay(200);
    
    const sessionIndex = this.sessions.findIndex(s => s.id === id);
    if (sessionIndex === -1) {
      throw new Error('Upload session not found');
    }

    this.sessions[sessionIndex] = {
      ...this.sessions[sessionIndex],
      ...updates,
      updatedAt: Date.now()
    };

    return { ...this.sessions[sessionIndex] };
  }

  async completeUploadSession(id, completionData) {
    await delay(200);
    
    const sessionIndex = this.sessions.findIndex(s => s.id === id);
    if (sessionIndex === -1) {
      throw new Error('Upload session not found');
    }

    this.sessions[sessionIndex] = {
      ...this.sessions[sessionIndex],
      ...completionData,
      status: 'completed',
      completedAt: Date.now()
    };

    return { ...this.sessions[sessionIndex] };
  }

  async getById(id) {
    await delay(200);
    const session = this.sessions.find(s => s.id === id);
    return session ? { ...session } : null;
  }

  async getAll() {
    await delay(200);
    return [...this.sessions];
  }

  async getActiveSessions() {
    await delay(200);
    return this.sessions.filter(s => s.status === 'active').map(s => ({ ...s }));
  }

  async delete(id) {
    await delay(200);
    const index = this.sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      const deleted = this.sessions.splice(index, 1)[0];
      return { ...deleted };
    }
    return null;
  }
}

export const uploadSessionService = new UploadSessionService();