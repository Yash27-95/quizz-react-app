export default function StartPage({startQuizz}) {
    return (
        <div className="content-start">
            <h1>Quizzical</h1>
            <p>Play for fun!</p>
            <button onClick={startQuizz}>Start quizz</button>
        </div>
    )
}