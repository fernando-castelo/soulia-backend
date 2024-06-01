const dotenv = require('dotenv');
const { OpenAI } = require('openai');

dotenv.config({ path: './config.env' });

const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });

module.exports = openai;