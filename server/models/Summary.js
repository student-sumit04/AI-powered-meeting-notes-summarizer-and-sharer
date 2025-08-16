// Summary model for future database integration
// This can be used with MongoDB, PostgreSQL, or other databases

class Summary {
  constructor(data = {}) {
    this.id = data.id || null;
    this.transcript = data.transcript || '';
    this.summary = data.summary || '';
    this.customPrompt = data.customPrompt || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.userId = data.userId || null;
    this.isShared = data.isShared || false;
    this.recipients = data.recipients || [];
  }

  // Validation methods
  validate() {
    const errors = [];

    if (!this.transcript || this.transcript.trim().length === 0) {
      errors.push('Transcript is required');
    }

    if (!this.summary || this.summary.trim().length === 0) {
      errors.push('Summary is required');
    }

    if (this.transcript && this.transcript.length > 50000) {
      errors.push('Transcript is too long. Maximum 50,000 characters.');
    }

    return errors;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      transcript: this.transcript,
      summary: this.summary,
      customPrompt: this.customPrompt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      userId: this.userId,
      isShared: this.isShared,
      recipients: this.recipients
    };
  }

  // Create from plain object
  static fromJSON(data) {
    return new Summary(data);
  }
}

module.exports = Summary; 