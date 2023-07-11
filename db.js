const pg = require('pg');
const tableName = 'users_revenue';
const userIdField = 'user_id'
const userIdType = 'VARCHAR(20)';
const revenueField = 'revenue'
const revenueType = 'INTEGER'

const config = {
    user: 'yonishay',
    database: 'yonishay',
    password: '',
    port: 5432,
};
const pool = new pg.Pool(config);

async function createTable() {

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ${userIdField}  ${userIdType} PRIMARY KEY,
        ${revenueField}  ${userIdType} 
      );
    `;
    let client;
    try {
        client = await pool.connect();
        await client.query(createTableQuery);
        console.log(`Table created or already exists: ${tableName}`);
    } catch (error) {
        console.error('Error creating table:', error);
        throw error;
    } finally {
        if (client)
            client.release();
    }
}


async function processBatch(data) {
      const valuesClause = data
      .map(({ userId, revenue }) => `('${userId}', ${revenue})`)
      .join(', ');
    const query = `
      INSERT INTO ${tableName} (${userIdField}, ${revenueField})
      VALUES ${valuesClause}
      ON CONFLICT (${userIdField})
      DO UPDATE SET ${revenueField} = ${tableName}.${revenueField} + EXCLUDED.${revenueField};
    `;
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');
        await client.query(query);
        await client.query('COMMIT');
        
        
        console.log('Data upserted successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error upserting data:', error);
        throw error;
    } finally {
        if (client)
            client.release();
    }
    
}

async function getByUserId(userId) {
    const query = `SELECT * FROM ${tableName} WHERE ${userIdField} = $1`;
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(query, [userId]);
        const rows = result.rows;
        if (rows.length === 0) {
            console.log(`No data found in table ${tableName} with ${userIdField} = ${userId}`);
            return null;
        }
        return rows[0];

    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    } finally {
        if (client)
            client.release();
    }
}

module.exports = {
    createTable,
    processBatch,
    getByUserId,
};