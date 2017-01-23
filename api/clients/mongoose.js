import mongoose from 'mongoose';

// DB singleton instance stored as promise.
let instance = null;

export function createMongooseClient(uri) {
  if (!instance) {
    instance = new Promise((resolve, reject) => {
      // Initialize database connection.
      mongoose.connect(uri);
      const db = mongoose.connection;
      db.on('error', error => reject(error));
      db.once('open', () => resolve(mongoose));
    });
  }

  return instance;
}
