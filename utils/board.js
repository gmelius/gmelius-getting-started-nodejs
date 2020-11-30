const { fetchResource } = require('./authentication');

async function getBoard (accessToken) {
  const boards = await fetchResource(accessToken, '/public/v1/auth/boards');
  if (boards.length === 0) throw new Error('User has no board');
  
  const board = boards[0]; // display first board
  const columns = await fetchResource(accessToken, `/public/v1/auth/boards/${board.kanban_board_id}/columns`);
  const cardLists = await Promise.all(columns.map((column) => {
    return fetchResource(accessToken, `/public/v1/auth/boards/columns/${column.column_id}/cards`).then(data => data.list);
  }));
  const cards = format(cardLists)
  return { board, columns, cards };
}

// format cards data
function format (cardsLists) {
  // initialize array
  const ncolumns = cardsLists.length;
  const nrow = Math.max(...cardsLists.map(cards => cards.length));
  const matrix = [];
  for (let i = 0; i < nrow; i++) {
      matrix[i] = new Array(ncolumns);
  }
  // fill
  for (let j = 0; j < ncolumns; j++) {
    const cards = cardsLists[j];
    for (let i = 0; i < cards.length; i++) {
      matrix[i][j] = cards[i].subject;
    }
  }
  // return
  return matrix;
}

module.exports = {
  getBoard
};