
const User = require('../models/userModel');
const openai = require('../openai')
const mondayService = require('../services/monday.service');

const createNewChat = async (userId, initialMessage, chatResponse) => {
    const newChat = {
      messages: [{ message: initialMessage, sender: 'user' },
                 { message: chatResponse, sender: 'assistant'}
      ],
    };

    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { chats: newChat } },
      { new: true, upsert: true }
    );
  
    if (!user) throw new Error('User not found');
  
    return user.chats[user.chats.length - 1];
  };

  const updateCurrentChat = async (userId, chatId, userQuestion, chatResponse) => {

    const messages = [{ message: userQuestion, sender: 'user' },
                      { message: chatResponse, sender: 'assistant'}]  

    const user = await User.findOneAndUpdate(
      { _id: userId, 'chats._id': chatId },
      { $push: { 'chats.$.messages': messages } },
      { new: true }
    );
  
    if (!user) throw new Error('User or chat not found');
  
    return user.chats.id(chatId);
  };

  const getApiResponse = async(messages) =>  {
    const completion = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo',
      });
  
      return completion.choices[0].message;
  }

  const getChatContext = async (userId, chatId) => {
    try {
      const user = await User.findById(userId).select('chats');
      if (!user) throw new Error('User not found');
  
      const chat = user.chats.id(chatId);
      if (!chat) throw new Error('Chat not found');
  
      const messages = chat.messages.map(msg => ({
        role: msg.sender,
        content: msg.message,
      }));
  
      return messages;
    } catch (err) {
      throw new Error(`Error getting chat context: ${err.message}`);
    }
  };

  exports.makeQuestion = async (req, res) => {
    try {
      const userId = req.user._id;
      const userQuestion = req.body.question;
      const currentChatId = req.cookies ? req.cookies.currentChatId : null;
      let chat;
      let chatResponse;

      const mondayChatId = await mondayService.createMondayChat(req, res);
      const collumns = await mondayService.createMondayChatColumns(mondayChatId);
  
      if (!currentChatId) {
        console.log(userQuestion);
        // Criar um novo chat se o cookie não existir
        chatResponse = await getApiResponse([{ content: userQuestion, role: 'user' }]);
        chat = await createNewChat(userId, userQuestion, chatResponse.content);
        res.cookie('currentChatId', chat._id, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true });
  
      } else {
        // Adicionar resposta do chatbot ao chat existente
        const messages = await getChatContext(userId, currentChatId);
        chatResponse = await getApiResponse(messages);
        chat = await updateCurrentChat(userId, currentChatId, userQuestion, chatResponse.content);
      }
  
      res.status(200).json({
        status: 'success',
        data: {
          answer: chatResponse.content,
          sender: chatResponse.role
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
