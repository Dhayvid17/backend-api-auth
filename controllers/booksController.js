import mongoose from 'mongoose';
import Book from '../models/bookModel.js';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';


const jwtSecret = process.env.JWT_SECRET

//GET ALL BOOKS
const getBooks = async (req, res) => {

    try {
        const books = await Book.find().sort({ author: 1 });
        console.log('Fetched books...');
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch books' });
    }
};

// GET A SINGLE BOOK
const getBook = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ error: 'Not a valid document' })
    }

    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(400).json({ error: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch book' })
    }
};

// CREATE A NEW BOOK
const createBook = async (req, res) => {
    const { title, author, pages, genre, rating } = req.body;

    if (!title || !author || !pages || !genre || !rating) {
        return res.status(400).json({ error: 'Please fill all fields' });
    }

    try {
        const newBook = new Book({ title, author, pages, genre, rating });
        await newBook.save();
        console.log('Book created...');
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Could not add new Book' });
    }
};

// UPDATE A BOOK
const updateBook = async (req, res) => {
    const { title, author, pages, genre, rating } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ error: 'Not a valid Document' });
    }

    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, pages, genre, rating },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(400).json({ error: 'Could not update Book' });
        }
        res.status(201).json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update Book' })
    }
};

// DELETE A BOOK
const deleteBook = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ error: 'Not a valid Document' });
    }

    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(400).json({ error: 'Book not found' });
        }
        res.status(201).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Could not delete Book' });
    }
};

// REGISTER A USER
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    // Validate username and password
    if (!username || !password) {
        return res.status(404).json({ error: 'All fields must be filled' });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(404).json({ error: 'Password must be at least 8 characters' });
    }

    try {
        // Check if the Username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password
        const harshedPassword = await bcrypt.hash(password, 10);

        // Create a new User
        const newUser = new User({ username, password: harshedPassword });
        await newUser.save();

        console.log({ message: 'User registered successfully' });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error({ error: 'Internal server error' });
        res.status(500).json({ error: 'Internal server error' });
    }
};

//LOGIN EXISTING USER
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Validate username and password
    if (!username || !password) {
        return res.status(404).json({ error: 'All fields must be filled' });
    }

    try {
        
        //Find the User by Username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid Credentials' });
        }

        //Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ error: 'Invalid Credentials' });
        }

        // Create a token
        const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
        console.log({ message: 'User logged in successfully' });
        res.status(200).json({ token });
    } catch (error) {
        console.error({ error: 'Internal server error' });
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    registerUser,
    loginUser
}