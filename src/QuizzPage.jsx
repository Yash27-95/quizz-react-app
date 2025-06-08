import { useState, useEffect } from "react"
import he from "he"
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'
import { FaCircleNotch } from "react-icons/fa6";

export default function QuizzPage({ quizzData, shuffleArray, handlePlayAgain, reloading }) {
    const [data, setData] = useState(() => 
        quizzData.map((obj, index) => ({
            id: index,
            question: obj.question,
            correct_answer: obj.correct_answer,
            incorrect_answers: obj.incorrect_answers,
            choices: shuffleArray([...obj.incorrect_answers, obj.correct_answer]),
            selected: false,
            selected_answer: null
        }))
    );

    const [finish, setFinish] = useState(false)
    const [score, setScore] = useState(0)

    const { width, height } = useWindowSize()

    useEffect(() => {
        const container = document.querySelector('.content-quizz');
        if (container) {
            container.scrollTop = 0;
        }
    }, []);

    function handleSelect(id, choice) {
        if(!finish) {
            setData(pre => {
                return pre.map(obj => {
                    if(obj.id === id) {
                        return (obj.selected && obj.selected_answer === choice) ?
                        {
                            ...obj,
                            selected: false,
                            selected_answer: null
                        } : 
                        {
                            ...obj,
                            selected: true,
                            selected_answer: choice
                        }
                    }else {
                        return obj
                    }
                })
            })
        }
    }

    function handleFinish() {
        if(data.every(obj => obj.selected && obj.selected_answer)){
            setScore(data.filter(obj => obj.selected_answer === obj.correct_answer).length)
            setFinish(true)
        }else{
            return null
        }
    }

    function getChoiceStyle(finish, choice, obj) {
        if (!finish) return {};

        if (choice === obj.correct_answer && choice === obj.selected_answer) {
            return { color: "#293264", backgroundColor: "#94D7A2", border: "1px solid #94D7A2" };
        }

        if (choice === obj.selected_answer && choice !== obj.correct_answer) {
            return { color: "#293264", backgroundColor: "#F8BCBC", border: "1px solid #F8BCBC" };
        }

        if (choice === obj.correct_answer) {
            return { color: "#293264", backgroundColor: "#94D7A2", border: "1px solid #94D7A2" };
        }

        return { color: "#293264", backgroundColor: "transparent", border: "1px solid #293264" };
    }

    return (
        <div className={reloading ? "content-reload" : "content-quizz"}>
            {finish && 
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={1000}
                    gravity={0.2}
                />
            }
            {
                reloading ?
                <p className="reload-text">
                    Please wait while the quizz reloads                   
                    <FaCircleNotch className="reload-icon"/>
                </p> :
                <>
                    {
                        data.map((obj) => (
                            <div className="result" key={obj.id}>
                                <p className="question">{he.decode(obj.question)}</p>
                                <div className="choices">
                                    {
                                        obj.choices.map((choice, i) => (
                                            <span 
                                                style={getChoiceStyle(finish, choice, obj)}
                                                className={`choice ${obj.selected_answer === choice ? "selected" : null}`}
                                                key={i} 
                                                onClick={() => handleSelect(obj.id, choice)}
                                            >
                                                {he.decode(choice)}
                                            </span>
                                        ))
                                    }
                                </div>
                                <hr />
                            </div>
                        ))
                    }
                    <div className="check-answers">
                        {finish && <span>You scored {score}/5 correct answer{score > 1 ? "s" : ""}</span>}
                        <button 
                            onClick={finish ? handlePlayAgain : handleFinish} 
                            disabled={data.some(obj => !obj.selected)}
                        >
                            {finish ? "Play again" : "Check answers"}
                        </button>
                    </div>
                </>
            }   
        </div>
    );
}
