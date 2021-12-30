function ChessControls(props) {
  return <div>
    { props.gameOver && <div onClick={props.onRematch}>Rematch</div> }
    <div onClick={props.onNewGameClick}>New Game</div>
  </div>
}

export default ChessControls;
