/**
 * matrimony.repository.js
 * Uses Neon PostgreSQL database via db.js.
 */

const db = require('../config/db');

async function findAll() {
  const { rows } = await db.query('SELECT * FROM matrimony_profiles');
  return rows;
}

async function findById(id) {
  const { rows } = await db.query('SELECT * FROM matrimony_profiles WHERE id = $1', [id]);
  return rows[0] || null;
}

async function findActive() {
  const { rows } = await db.query('SELECT * FROM matrimony_profiles WHERE status = $1', ['active']);
  return rows;
}

async function create(profile) {
  const {
    id, userId, email, passwordHash, firstName, lastName,
    phone, profileData, profilePhoto, status, paymentStatus,
    transactionId, createdAt, updatedAt
  } = profile;

  await db.query(
    `INSERT INTO matrimony_profiles (
      id, "userId", email, "passwordHash", "firstName", "lastName",
      phone, "profileData", "profilePhoto", status, "paymentStatus",
      "transactionId", "createdAt", "updatedAt"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      id, userId, email, passwordHash, firstName, lastName,
      phone, profileData, profilePhoto, status, paymentStatus,
      transactionId, createdAt, updatedAt
    ]
  );
  return profile;
}

async function updateById(id, updates) {
  // Dynamically build UPDATE query
  const keys = Object.keys(updates);
  if (keys.length === 0) return await findById(id);

  const setParams = [];
  const queryValues = [];
  let paramIndex = 1;

  for (const key of keys) {
    // Quote camelCase keys correctly
    const columnName = key === 'userId' || key === 'passwordHash' || key === 'firstName' || key === 'lastName' || 
                       key === 'profileData' || key === 'profilePhoto' || key === 'paymentStatus' || 
                       key === 'transactionId' || key === 'createdAt' || key === 'updatedAt' 
                       ? `"${key}"` : key;
    setParams.push(`${columnName} = $${paramIndex}`);
    queryValues.push(updates[key]);
    paramIndex++;
  }

  // Always update updatedAt
  setParams.push(`"updatedAt" = $${paramIndex}`);
  queryValues.push(new Date().toISOString());
  paramIndex++;

  queryValues.push(id);
  const queryText = `UPDATE matrimony_profiles SET ${setParams.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

  const { rows } = await db.query(queryText, queryValues);
  return rows[0] || null;
}

async function findByUserId(userId) {
  const { rows } = await db.query('SELECT * FROM matrimony_profiles WHERE "userId" = $1', [userId]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const { rows } = await db.query('SELECT * FROM matrimony_profiles WHERE email = $1', [email]);
  return rows[0] || null;
}

async function deleteById(id) {
  const { rowCount } = await db.query('DELETE FROM matrimony_profiles WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { findAll, findById, findActive, create, updateById, findByUserId, findByEmail, deleteById };
