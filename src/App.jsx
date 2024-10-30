import { useState, useEffect } from "react";
import "./App.css";

const url = "https://dattebayo-api.onrender.com/characters";

//Shuffles any array
function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function App() {
  const [characters, setCharacters] = useState([]);
  const [cards, setCards] = useState([]);
  const [clickedCards, setClickedCards] = useState([]);
  const [gameStatus, setGameStatus] = useState("");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacters();
  }, []);

  //Updates the best score even after resetting the game
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score, bestScore]);

  const fetchCharacters = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();

      //Selects the first 6 entries from the api fetch
      const selectedCharacters = data.characters.slice(0, 8).map((char) => ({
        id: char.id,
        name: char.name,
        image: char.images[0],
      }));
      setCharacters(selectedCharacters);
      setCards(shuffleArray(selectedCharacters));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching characters", error);
      setLoading(false);
    }
  };

  const handleCardClick = (card) => {
    //If clicked card includes a duplicate the game is over
    if (clickedCards.includes(card.id)) {
      setGameStatus("Game is over");
      resetGame();
      return;
    }

    //newClickedCards is declared as a clone of clicked cards
    const newClickedCards = [...clickedCards, card.id];
    setClickedCards(newClickedCards);
    setScore(newClickedCards.length);

    if (newClickedCards.length === characters.length) {
      setGameStatus("You Win");
      resetGame();
    } else {
      setCards(shuffleArray(cards));
    }
  };

  const resetGame = () => {
    setTimeout(() => {
      setCards(shuffleArray(characters));
      setClickedCards([]);
      setScore(0);
      setGameStatus("");
    }, 2000);
  };

  if (loading)
    return (
      <img
        className="loading-gif"
        src="src/assets/naruto_loading.webp"
        alt="Loading Gif"
      ></img>
    );

  return (
    <>
      <header>
        <h1>Naruto Memory Game</h1>
        <div className="score-box">
          <p>{gameStatus || "Click each character only once"}</p>
          <p>
            Best Score : <span>{bestScore}</span>
          </p>
          <p>
            Score : <span>{score}</span>
          </p>
        </div>
      </header>
      <div className="card-container">
        {cards.map((card) => (
          <div
            className="card"
            key={card.id}
            onClick={() => handleCardClick(card)}
          >
            <img src={card.image} alt={card.name} />
            <p>{card.name}</p>
          </div>
        ))}
      </div>
      <footer>Created by Melina Bedingfield</footer>
    </>
  );
}

export default App;
