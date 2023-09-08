const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "postgres://zhangzp349:KLAs3WuMot9y@ep-fragrant-glade-20662482-pooler.us-east-2.aws.neon.tech/neondb",
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = pool;
