-- Drop existing tables to start fresh
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;

-- Create the 'users' table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'products' table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    seller_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_seller
      FOREIGN KEY(seller_id) 
	  REFERENCES users(id)
	  ON DELETE CASCADE
);

-- Insert sample users
INSERT INTO users (username, email, password_hash) VALUES
('EcoSeller', 'seller@example.com', 'some_secure_hash'),
('GreenThumb', 'green@example.com', 'another_secure_hash');

-- Insert 12 sample products
INSERT INTO products (title, description, category, price, seller_id, image_url) VALUES
('Bamboo Toothbrush Set', 'A set of four biodegradable bamboo toothbrushes. A perfect swap to reduce plastic waste in your daily routine.', 'Apparel', 12.99, 1, 'https://images.unsplash.com/photo-1583244273392-74b48074f587?q=80&w=2970&auto=format&fit=crop'),
('Reusable Beeswax Food Wraps', 'Eco-friendly alternative to plastic wrap. Keep your food fresh with these washable and reusable wraps.', 'Furniture', 18.50, 1, 'https://images.unsplash.com/photo-1599664223843-77262514a27a?q=80&w=2970&auto=format&fit=crop'),
('Solar-Powered Phone Charger', 'Charge your devices on the go with this compact and efficient solar-powered charger. Perfect for hiking and travel.', 'Electronics', 35.00, 2, 'https://images.unsplash.com/photo-1599622524316-2e5a4057a627?q=80&w=2970&auto=format&fit=crop'),
('Recycled Glass Tumblers', 'Set of four beautiful tumblers made from 100% recycled glass. Dishwasher safe and built to last.', 'Furniture', 25.00, 2, 'https://images.unsplash.com/photo-1616100239282-b7e4a5b8e9f2?q=80&w=2970&auto=format&fit=crop'),
('Organic Cotton Tote Bag', 'A stylish and durable tote bag made from certified organic cotton. Ideal for groceries, books, or daily essentials.', 'Apparel', 15.00, 1, 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=2970&auto=format&fit=crop'),
('Stainless Steel Water Bottle', 'Ditch plastic for good with this insulated stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12.', 'Apparel', 22.00, 2, 'https://images.unsplash.com/photo-1602143407151-2474f436a23b?q=80&w=2787&auto=format&fit=crop'),
('Handmade Bar Soap', 'Artisanal soap made with natural ingredients and essential oils. Comes in plastic-free packaging.', 'Apparel', 8.00, 1, 'https://images.unsplash.com/photo-1600950335869-7d0ca3021f1e?q=80&w=2970&auto=format&fit=crop'),
('Compostable Phone Case', 'A protective and stylish phone case made from plant-based materials. Fully compostable at the end of its life.', 'Electronics', 20.00, 2, 'https://images.unsplash.com/photo-1616428312948-522e6b5b5c1c?q=80&w=2970&auto=format&fit=crop'),
('Natural Cork Yoga Mat', 'A non-slip, antimicrobial yoga mat made from sustainably harvested cork. Perfect for any practice.', 'Apparel', 45.00, 1, 'https://images.unsplash.com/photo-1588339122131-297c6d7014e3?q=80&w=2970&auto=format&fit=crop'),
('Energy-Efficient Smart Bulb', 'An LED smart bulb that saves energy and can be controlled from your phone. Set schedules and change colors.', 'Electronics', 18.00, 2, 'https://images.unsplash.com/photo-1493612276358-7141750ac69a?q=80&w=2970&auto=format&fit=crop'),
('Recycled Paper Journal', 'A beautiful journal made from 100% recycled paper. Perfect for notes, sketches, or your next big idea.', 'Books', 14.00, 1, 'https://images.unsplash.com/photo-1456735180827-a069f1a2b4a5?q=80&w=2970&auto=format&fit=crop'),
('Linen Kitchen Towels', 'Set of two highly absorbent and durable kitchen towels made from natural linen.', 'Furniture', 19.50, 2, 'https://images.unsplash.com/photo-1601639961111-e613b5a1955c?q=80&w=2970&auto=format&fit=crop');

