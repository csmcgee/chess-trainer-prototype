import { useState, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
// @todo: can we change this from 'require' to 'import' for nextjs
const { Chess } = require('chess.js');
import axios from 'axios';

function HomePage() {
  const [game, setGame] = useState(new Chess());

  useEffect(async () => {
    if (game.turn() == 'b') {
      const response = await axios.post('/api/game/move', game.pgn(),  {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      });

      safeGameMutate((game) => {
        game.move({
          promotion: 'q',
          ...response.data
        });
      });
    }
  }, [game]);

  function safeGameMutate(modify) {
    setGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function onDrop(sourceSquare, targetSquare) {
    let move = null;

    if (game.game_over() || game.in_draw()) {
      alert('game is over')
      return false;
    }

    safeGameMutate((game) => {
      console.log({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });
      move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q' // always promote to a queen for example simplicity
      });
    });

    return true;
  }

  return <div>
    <Chessboard
      id="BasicBoard"
      position={game.fen()}
      onPieceDrop={onDrop}
    />
  </div>
}

export default HomePage
