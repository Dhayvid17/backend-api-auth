import express from "express";
import { connectToDb } from './db.js';
import { config } from "dotenv";
import BookRouter from './routes/Books.js';

//Initialize Express and Middleware
const app = express();
app.use(express.json());

config();

const port = process.env.PORT || 3000;



//Database connection
const startServer = async () => {

    try {
        await connectToDb();
        app.listen(port, () => {
            console.log(`App running on port ${port}`);
        });
    } catch (err) {
        console.error('Failed to connect to Database and start server', err);
        process.exit(1);
    }
};

startServer();


//ROUTE TO GET ALL BOOKS
app.use('/books', BookRouter);


export default app;

