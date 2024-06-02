const fetch = require("node-fetch");

exports.createMondayChat = async () => {
    const createBoardQuery = `
    mutation {
      create_board (board_name: "Chats", board_kind: public) {
        id
      }
    }`;

    try {
        const createBoardResponse = await fetch("https://api.monday.com/v2", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.MONDAY_KEY
            },
            body: JSON.stringify({ query: createBoardQuery })
        });

        const createBoardData = await createBoardResponse.json();
        const boardId = createBoardData.data.create_board.id;

        return boardId
    } catch (err) {
        throw new Error(`Error getting chat context: ${err.message}`);
    }
};

exports.addColumn = async (boardId, title, columnType) => {
    const query = `
    mutation {
      create_column (board_id: ${boardId}, title: "${title}", column_type: ${columnType}) {
        id
      }
    }`;
    const response = await fetch("https://api.monday.com/v2", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': process.env.MONDAY_KEY
        },
        body: JSON.stringify({ query })
    });
    const data = await response.json();
    return data.data.create_column.id;
},

exports.createItem = async(query) => {
    fetch ("https://api.monday.com/v2", {
    method: 'post',
    headers: {
        'Content-Type': 'application/json',
        'Authorization' : process.env.MONDAY_KEY
    },
    body: JSON.stringify({
        query : query
    })
    })
    .then(res => res.json())
    .then(res => console.log(JSON.stringify(res, null, 2)));
}

exports.getMondayChatItemQuery = async(sender, message, board_id) => {
    return `mutation {
      create_item (
        board_id: ${board_id}, 
        item_name: "Message", 
        column_values: \"{\\\"sender__1\\\":\\\"${sender}\\\", \\\"message__1\\\":\\\"${message}\\\"}\"
      ) { 
        id 
      }
    }`;
}

exports.getMondaySenderQuery = async(sender, board_id) => {
    return `mutation { create_item (board_id: ${board_id}, item_name: \"Message\", column_values: \"{\\\"sender__1\\\":\\\"${sender}\\\"}\") { id }}`;
}

exports.getMondayMessageQuery = async(message, board_id) => {
    return `mutation { create_item (board_id: ${board_id}, item_name: \"Message\", column_values: \"{\\\"message__1\\\":\\\"${message}\\\"}\") { id }}`;
}

exports.fillMondayColumns = async (sender, message, board_id) => {

    const senderColumnId = 'sender__1';
    const messageColumnId = 'message__1';


    const escapedMessage = message.replace(/\n/g, "\\n");
    const columnValues = JSON.stringify({
        [senderColumnId]: sender,
        [messageColumnId]: escapedMessage
    }).replace(/"/g, '\\"');

    const query = `
    mutation {
      create_item (
        board_id: ${board_id}, 
        item_name: "Message", 
        column_values: "${columnValues}"
      ) { 
        id 
      }
    }`;

    try {
        const response = await fetch("https://api.monday.com/v2", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.MONDAY_KEY
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
