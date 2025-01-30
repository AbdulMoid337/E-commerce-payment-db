import mongoose from "mongoose";

const connection = { };

async function dbConnect() {
    if (connection.isConnected) {
        console.log("Already Connected to Database");
        return;
    }
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined");
        }
        const db = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        connection.isConnected = db.connections[0].readyState;
        console.log("DB Connected Successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}

export default dbConnect;
