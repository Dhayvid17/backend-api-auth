import express, { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.js';
import { getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    registerUser,
    loginUser
 } from '../controllers/booksController.js';

const router = express.Router();


// ROUTE TO GET ALL BOOKS
router.get('/', getBooks);

//ROUTE TO GET A SINGLE BOOK
router.get('/:id', getBook);


//ROUTE TO CREATE A NEW BOOK
router.post('/', authenticateToken, createBook);

//ROUTE TO UPDATE A BOOK
router.patch('/:id', authenticateToken, updateBook);

//ROUTE TO DELETE BOOK
router.delete('/:id', authenticateToken, deleteBook);

//ROUTE TO REGISTER USER
router.post('/register', registerUser);

//ROUTE TO LOGIN EXISTING USER
router.post('/login', loginUser);


export default router;