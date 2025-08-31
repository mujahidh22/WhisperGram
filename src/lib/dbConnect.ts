import mongoose from 'mongoose'

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    try {
        //check if we already have connection to the database.If yes then no need to establish connection again
        if (connection.isConnected) {
            console.log('Already connected to the database')
            return;
        }

        // Attempt to connect to the database if not already connected to db
        const db = await mongoose.connect(process.env.MONGO_URI || '', {})
        connection.isConnected = db.connections[0].readyState
        console.log('Database connected successfully');
    }
    catch (error) {
        console.error('Database connection failed:', error);
        // Graceful exit in case of a connection error
        process.exit(1);
    }
}

export default dbConnect;