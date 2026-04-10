const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        "passwordHash" VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS matrimony_profiles (
        id VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        "passwordHash" VARCHAR(255) NOT NULL,
        "firstName" VARCHAR(255),
        "lastName" VARCHAR(255),
        phone VARCHAR(50),
        "profileData" JSONB,
        "profilePhoto" VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        "paymentStatus" VARCHAR(50) DEFAULT 'unpaid',
        "transactionId" VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS it_training_enquiries (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        course VARCHAR(255) NOT NULL,
        experience VARCHAR(100),
        message TEXT,
        status VARCHAR(50) DEFAULT 'new',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS real_estate_listings (
        id VARCHAR(255) PRIMARY KEY,
        "sellerId" VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        price VARCHAR(100),
        location VARCHAR(255),
        category VARCHAR(100),
        type VARCHAR(100),
        size VARCHAR(100),
        description TEXT,
        contact VARCHAR(100),
        seller VARCHAR(255),
        img TEXT,
        "documentName" VARCHAR(255),
        document TEXT,
        status VARCHAR(50) DEFAULT 'available',
        date VARCHAR(255),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS abroad_enquiries (
        id VARCHAR(255) PRIMARY KEY,
        "firstName" VARCHAR(100),
        "lastName" VARCHAR(100),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        country VARCHAR(255),
        "preferredDate" VARCHAR(100),
        "preferredTime" VARCHAR(100),
        message TEXT,
        status VARCHAR(50) DEFAULT 'new',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS groceries_products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255),
        category VARCHAR(100),
        mrp DECIMAL(10, 2),
        selling_price DECIMAL(10, 2),
        discount_percent DECIMAL(5, 2),
        weight VARCHAR(50),
        stock INTEGER DEFAULT 0,
        description TEXT,
        image_url TEXT,
        status VARCHAR(50) DEFAULT 'in-stock',
        tags TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create default admin user securely
    const bcrypt = require('bcryptjs');
    const adminHash = bcrypt.hashSync('Admin@123', 10);
    await client.query(`
      INSERT INTO users (id, name, email, "passwordHash", role)
      VALUES ('admin-001', 'Admin', 'admin@srikanishka.com', $1, 'admin')
      ON CONFLICT (email) DO NOTHING;
    `, [adminHash]);

    console.log('Database tables initialized successfully.');
  } catch (err) {
    console.error('Error initializing database tables:', err);
  } finally {
    client.release();
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDB,
  pool
};
