const {Chess} = require('chess.js');
const jsChessEngine = require('js-chess-engine');
const { move, status, moves, aiMove, getFen } = jsChessEngine

export default function handler(req, res) {
  if (req.method == 'POST') {
    const game = new Chess();
    // @todo: respond with error if failed to load pgn
    game.load_pgn(req.body);
    const fen = game.fen();
    const calculatedMove = aiMove(fen);
    const normalizedMove = {
      from: Object.keys(calculatedMove)[0].toLowerCase(),
      to: Object.values(calculatedMove)[0].toLowerCase(),
    };
    res.status(200).json(normalizedMove);
  }
}
