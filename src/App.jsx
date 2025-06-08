import { useState, useEffect } from 'react'
import QuizzPage from "./QuizzPage.jsx"
import StartPage from "./StartPage.jsx"

function App() {
  const [isStart, setIsStart] = useState(false)
  const [quizzData, setQuizzData] = useState([])
  const [reloading, setReloading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=5");

        if (res.status === 429) {
          throw new Error("Too many requests. Please wait and try again.");
        }

        if (!res.ok) {
          throw new Error("Failed to fetch quiz data");
        }

        const data = await res.json();
        setQuizzData(data.results);
      } catch (err) {
        console.error(err);
        setError(err.message); // Show message in UI
      }
    };

    fetchData();
  }, []);


  function shuffleArray(array) {
    const arr = [...array]; // copy to avoid mutating original
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
    }
    return arr;
  }

  function handlePlayAgain() {
    setReloading(true)
    setTimeout(() => {
      window.location.reload(); // hard refresh
    }, 300); 
  }

  function startQuizz() {
    setIsStart(true)
  }

  return (
    <div className={`content-box ${isStart && "quizz-box"}`}>
      {
        isStart ? 
        <QuizzPage quizzData={quizzData} shuffleArray={shuffleArray} handlePlayAgain={handlePlayAgain} reloading={reloading}/> :
        <StartPage startQuizz={startQuizz}/>
      }
    </div>
  )
}

export default App
