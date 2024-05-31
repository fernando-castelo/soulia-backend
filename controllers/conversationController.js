const dotenv = require('dotenv');
const { OpenAI } = require('openai');
const User = require('../models/userModel');

dotenv.config({ path: './config.env' });

const openai = new OpenAI({ apiKey: process.env.OPEN_API_KEY });

const createNewChat = async (userId, initialMessage) => {
    const newChat = {
      messages: [{ message: initialMessage, sender: 'user' }],
    };
  
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { chats: newChat } },
      { new: true, upsert: true }
    );
  
    if (!user) throw new Error('User not found');
  
    return user.chats[user.chats.length - 1];
  };

  const updateCurrentChat = async (userId, chatId, newMessage) => {

    const user = await User.findOneAndUpdate(
      { _id: userId, 'chats._id': chatId },
      { $push: { 'chats.$.messages': newMessage } },
      { new: true }
    );
  
    if (!user) throw new Error('User or chat not found');
  
    return user.chats.id(chatId);
  };

  exports.makeQuestion = async (req, res) => {
    try {
      const userId = req.user._id;
      const userQuestion = req.body.question;
      const currentChatId = req.cookies ? req.cookies.currentChatId : null;
  
      console.log(userQuestion);
  
      const completion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: userQuestion }],
        model: 'gpt-3.5-turbo',
      });
  
      const chatResponse = completion.choices[0].message;
  
      console.log(chatResponse);
  
      let chat;
  
      if (!currentChatId) {
        // Criar um novo chat se o cookie não existir
        chat = await createNewChat(userId, userQuestion);
        res.cookie('currentChatId', chat._id, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
  
      } else {
        // Adicionar resposta do chatbot ao chat existente
        chat = await updateCurrentChat(userId, currentChatId, {
          message: chatResponse.content,
          sender: chatResponse.role,
        });
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          answer: chatResponse,
        },
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message,
      });
    }
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
