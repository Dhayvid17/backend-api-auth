import mongoose from 'mongoose';
import { config } from "dotenv";
// const dbUri = 'mongodb+srv://dhayvid17:Iloveyou77@cluster0.c0cgraj.mongodb.net/dhayvid17?retryWrites=true&w=majority&appName=Cluster0';
config();

const dbUri = process.env.DB_URI;

const connectToDb = async () => {

    try {
        await mongoose.connect(dbUri);
        console.log('Connected to database');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export { connectToDb };
























// , { useNewUrlParser: true, useUnifiedTopology: true }