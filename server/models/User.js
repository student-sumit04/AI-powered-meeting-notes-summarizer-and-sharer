// User model for future authentication integration
// This can be used with MongoDB, PostgreSQL, or other databases

class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.name = data.name || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
    this.lastLogin = data.lastLogin || null;
  }

  // Validation methods
  validate() {
    const errors = [];

    if (!this.email || this.email.trim().length === 0) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        errors.push('Invalid email format');
      }
    }

    if (this.name && this.name.length > 100) {
      errors.push('Name is too long. Maximum 100 characters.');
    }

    return errors;
  }

  // Convert to plain object (excluding sensitive data)
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive,
      lastLogin: this.lastLogin
    };
  }

  // Create from plain object
  static fromJSON(data) {
    return new User(data);
  }
}

module.exports = User; 