const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

const envKey = process.env.GOOGLE_PRIVATE_KEY;
const jsonKey = JSON.parse(
  fs.readFileSync('src/config/google-service.json'),
).private_key;

console.log(
  'ENV key === JSON key:',
  envKey.replace(/\\n/g, '\n').trim() === jsonKey.trim(),
);
