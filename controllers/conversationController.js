const dotenv = require('dotenv');
const { OpenAI } = require('openai');
// const User = require('../models/userModel');

dotenv.config({ path: './config.env' });

const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });

exports.makeQuestion = async (req, res) => {
  console.log(req.body.question);
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: `${req.body.question}` }],
    model: 'gpt-3.5-turbo',
  });

  console.log(completion.choices[0]);

  res.status(200).json({
    status: 'sucess',
    data: {
      answer: completion.choices[0],
    },
  });
};

exports.testRoute = async (req, res) => {
  try {
    res.status(200).json({
      status: 'sucess',
      data: {
        user: req.user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};
