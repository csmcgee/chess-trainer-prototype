import { useState, useEffect, useReducer } from 'react';
import { Chessboard } from 'react-chessboard';
import ChessControls from './components/ChessControls';
import ChessMoves from './components/ChessMoves';
// @todo: can we change this from 'require' to 'import' for nextjs
const { Chess } = require('chess.js');
import axios from 'axios';

function init(pgn) {
  return {history: [], pgn, animationDuration: 300, historySquares: {}};
}

function reducer(state, action) {
  const { pgn, historySquares } = state;
  const { type } = action;
  const chess = new Chess();

  switch(type) {
    case 'MOVE':
      chess.load_pgn(pgn);
      const { move } = action;
      const currentMove = chess.move(move);
      if (!currentMove) {
        return state;
      }
      // @todo: make better
      historySquares = {};
      historySquares[currentMove.from] = {
        background: 'rgba(255,255,0, 0.5)',
      };
      historySquares[currentMove.to] = {
        background: 'rgba(255,255,0, 0.5)',
      }
      return {
        ...state,
        animationDuration: 300,
        history: chess.history(),
        fen: chess.fen(),
        pgn: chess.pgn(),
        isGameOver: chess.game_over(),
        historySquares,
      };
    case 'NEW_GAME':
      const initialState = init('');
      return {...initialState, animationDuration: 0};
  }

}


function HomePage() {
  const [ state, dispatch ] = useReducer(reducer, '', init);

  useEffect(async () => {
    // @todo: turn into factory with pgn
    const chessInstance = new Chess();
    chessInstance.load_pgn(state.pgn);
    console.log(chessInstance.history());

    if (chessInstance.game_over() || chessInstance.in_draw()) {
      return false;
    }

    if (chessInstance.turn() == 'b') {
      const response = await axios.post('/api/game/move', chessInstance.pgn({newline_char:''}),  {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      });

      dispatch({type: 'MOVE', move: {
        promotion: 'q',
        ...response.data
      }});
    }
  }, [state.fen]);

  function onDrop(sourceSquare, targetSquare) {
    dispatch({type: 'MOVE', move: {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to a queen for example simplicity
    }});
  }

  return <div>
    <Chessboard
      id="BasicBoard"
      animationDuration={state.animationDuration}
      position={state.fen}
      onPieceDrop={onDrop}
      customSquareStyles={{
        ...state.historySquares,
      }}
    />
    <ChessControls
      // todo: get autocomplete working
      onNewGameClick={() => { dispatch({ type: 'NEW_GAME'}) }}
      onRematch={() => { dispatch({ type: 'NEW_GAME'}) }}
      gameOver={state.isGameOver}
    />
    <ChessMoves
      moves={state.history}
    />
  </div>
}

export default HomePage
