import mongoose from 'mongoose'


const mongodb = async (mongoURL) => {
    mongoose.connect(mongoURL)
    // Mongoose maintains a default connection object representing the MongoDB connection.
    const db = mongoose.connection;

    // Define event listeners for database connection

    db.on('connected', () => {
        console.log('Connected to MongoDB server');
    });

    db.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    db.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });
}
// Export the database connection
export default mongodb

