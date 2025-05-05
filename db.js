const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.postgresql://dbpractica2_user:MPvHcGRV9nVZz1cBflPlZ9vACe86aApy@dpg-d0cgu06mcj7s738f5310-a.oregon-postgres.render.com/dbpractica2,
});

module.exports = pool;
