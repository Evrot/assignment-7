// database/setup.js
require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize and connect to SQLite database
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(process.env.DB_STORAGE), // e.g., 'database/music_library.db'
  logging: false,
});

// Define Track model
const Track = sequelize.define('Track', {
  trackId: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  songTitle: { type: DataTypes.STRING, allowNull: false },
  artistName: { type: DataTypes.STRING, allowNull: false },
  albumName: { type: DataTypes.STRING, allowNull: false },
  genre: { type: DataTypes.STRING, allowNull: false },
  duration: DataTypes.INTEGER,
  releaseYear: DataTypes.INTEGER,
}, {
  tableName: 'tracks',
  timestamps: false,
});

// Function to setup database and ensure tables exist
async function setupDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connected to SQLite.");

    // Sync models to create tables if they don't exist
    await sequelize.sync();
    console.log("Tables ensured.");
  } catch (err) {
    console.error("Error initializing DB:", err);
  }
}

// Export the model and sequelize instance
module.exports = { Track, sequelize, setupDatabase };
