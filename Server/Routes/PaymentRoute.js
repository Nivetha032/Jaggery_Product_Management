import express from 'express';
import con from '../utils/db.js';

const router = express.Router();

// Route to process a new payment
router.post('/process', (req, res) => {
    // Extract payment data from the request body
    const { name, email, address, phone, paymentMethod, items } = req.body;

    // SQL query to insert the payment data
    const sql = `
        INSERT INTO payment (name, email, address, phone, payment_method, items)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Convert items data to a JSON string for storage
    const values = [name, email, address, phone, paymentMethod, JSON.stringify(items)];

    // Use a try-catch block to handle potential errors
    try {
        con.query(sql, values, (err, result) => {
            if (err) {
                console.error('Query error:', err);
                // Return a clear and descriptive error message to the client
                return res.status(500).json({ success: false, message: 'An error occurred while processing your payment. Please try again later.' });
            }
            // Return a successful response with the payment ID
            return res.status(201).json({ success: true, paymentId: result.insertId });
        });
    } catch (error) {
        // Handle any other unexpected errors
        console.error('Unexpected error:', error);
        return res.status(500).json({ success: false, message: 'An unexpected error occurred. Please try again later.' });
    }
});

export { router as paymentRouter };
