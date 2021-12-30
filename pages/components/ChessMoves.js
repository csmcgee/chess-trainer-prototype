function ChessMoves(props) {


  const { moves } = props;
  const list = moves.reduce((accumulator, currentValue, currentIndex, array) => {
    if (currentIndex % 2 == 0) {
      accumulator.push([array.slice(currentIndex, currentIndex + 2)]);
    }
    return accumulator;
  }, []);
  console.log(list);
  return <ol>
  </ol>
}

export default ChessMoves;
