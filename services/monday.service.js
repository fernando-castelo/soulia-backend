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

exports.createMondayChatColumns = async (boardId) => {

    try {
        let addColumnsQuery = `
        mutation {
          create_column (board_id: ${boardId}, title: "Message", column_type: text) {
            id
          }
        }`;

        let addColumnsResponse = await fetch("https://api.monday.com/v2", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.MONDAY_KEY
            },
            body: JSON.stringify({ query: addColumnsQuery })
        });

        addColumnsQuery = `  mutation {
            create_column (board_id: ${boardId}, title: "Sender", column_type: text) {
              id
            }
          }`;

        addColumnsResponse = await fetch("https://api.monday.com/v2", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.MONDAY_KEY
            },
            body: JSON.stringify({ query: addColumnsQuery })
        });

        const addColumnsData = await addColumnsResponse.json();

        return addColumnsData;
    } catch (error) {
        throw new Error(`Error getting chat context: ${err.message}`);
    }
}