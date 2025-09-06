const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/products/all - Get all products for the public marketplace
router.get('/all', async (req, res) => {
    try {
        const products = await pool.query(
            `SELECT p.id, p.title, p.price, p.image_url, p.category, u.username as seller_name 
             FROM products p JOIN users u ON p.seller_id = u.id 
             ORDER BY p.created_at DESC`
        );
        res.json(products.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// GET /api/products/search - Search for products by title or description
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ msg: 'Search query is required.' });
        }

        const searchResults = await pool.query(
            `SELECT p.id, p.title, p.price, p.image_url, u.username as seller_name 
             FROM products p JOIN users u ON p.seller_id = u.id 
             WHERE p.title ILIKE $1 OR p.description ILIKE $1
             ORDER BY p.created_at DESC`,
            [`%${q}%`] // ILIKE is case-insensitive, % is a wildcard
        );

        res.json(searchResults.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// GET /api/products/:id - Get a single product by ID (must be after /search)
router.get('/:id', async (req, res) => {
    try {
        const product = await pool.query(
            `SELECT p.*, u.username as seller_name 
             FROM products p JOIN users u ON p.seller_id = u.id 
             WHERE p.id = $1`, [req.params.id]);

        if (product.rows.length === 0) {
            return res.status(404).json({ msg: "Product not found." });
        }
        res.json(product.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// --- Protected Routes (Require Authentication) ---

// GET /api/products - Get all products for the logged-in seller
router.get('/', auth, async (req, res) => {
    try {
        const sellerProducts = await pool.query("SELECT * FROM products WHERE seller_id = $1 ORDER BY created_at DESC", [req.user.id]);
        res.json(sellerProducts.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// POST /api/products - Create a new product
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, category, price, image_url } = req.body;
        const newProduct = await pool.query(
            "INSERT INTO products (title, description, category, price, seller_id, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [title, description, category, price, req.user.id, image_url]
        );
        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// PUT /api/products/:id - Update a product
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, price, image_url } = req.body;
        const updateProduct = await pool.query(
            "UPDATE products SET title = $1, description = $2, category = $3, price = $4, image_url = $5 WHERE id = $6 AND seller_id = $7 RETURNING *",
            [title, description, category, price, image_url, id, req.user.id]
        );
        if (updateProduct.rows.length === 0) {
            return res.status(404).json({ msg: "Product not found or user not authorized." });
        }
        res.json(updateProduct.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteOp = await pool.query("DELETE FROM products WHERE id = $1 AND seller_id = $2", [id, req.user.id]);
        if (deleteOp.rowCount === 0) {
            return res.status(404).json({ msg: "Product not found or you don't have permission." });
        }
        res.json({ msg: "Product was deleted." });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

