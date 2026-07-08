import React, { useState } from 'react'
import QuestionCard from './components/QuestionCard';
import { fetchQuizQuestions, type Question } from './API';
import { type QuestionState, type Difficulty } from './API';
import './App.css';
import './QuestionCard.css';

export type answerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correct_answer: string;
}

const TOTAL_QUESTIONS = 10;
const difficulty: Difficulty = 'easy';

function App() {
  const [loading, setLoading] = useState(false);
  const[error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<answerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  // console.log(questions);

  const startTrivia = async () =>{
    setLoading(true);
    setError(null);
    setGameOver(false);

    try {
      const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, difficulty);
      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while loading questions.');
      setGameOver(true);
    } finally {
      setLoading(false);
    }

  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) =>{
    if(gameOver) return
    else if(!gameOver){
      // user answer
      const answer = e.currentTarget.value;
      // check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if(correct) setScore(prev => prev + 1);
      // save answer in the array for user answer
      const newAnswer: answerObject = {
        question: questions[number].question, // text of question
        answer, // answer of User
        correct, // is user answer is correct or not (true / false)
        correct_answer: questions[number].correct_answer, // was mistakenly "correctAnswer" — didn't match the answerObject type, so QuestionCard's userAnswer?.correct_answer was always undefined and the correct-answer highlight never worked
      };

      setUserAnswers((prev) => [...prev, newAnswer]);

    }

  }

  const isLastQuestion = number === TOTAL_QUESTIONS - 1;
  const hasAnsweredCurrent = userAnswers.length === number + 1;

  const nextQuestion = () =>{
    // Move to the next question if not the last question

    if(isLastQuestion){
      setGameOver(true);
    } else{
      setNumber(prev => prev + 1);
    }
  }

    const quizFinished = gameOver && userAnswers.length === TOTAL_QUESTIONS;

  return (
    <>
    <div className="App">
      
      <h1>REACT QUIZ</h1>
      {gameOver && (
      <button className="start" onClick={startTrivia} disabled={loading}>
        {quizFinished ? 'play Again' : 'Start'}
        </button>)
      }

      {error && <p className="error">{error}</p>}

      {quizFinished && (<p className="score">Final Score: {score} / {TOTAL_QUESTIONS}</p>)}
      
      {!gameOver && <p className="score">Score: {score}</p>}

      {loading && <p>Loading Question ...</p>}

      {!loading && !gameOver && questions.length > 0 && (
      <QuestionCard 
        questionNr={number + 1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers[number]}
        callback={checkAnswer}
      />
      )}

      {hasAnsweredCurrent && (
      <button className="next_Question" onClick={nextQuestion}>{isLastQuestion ? 'See Result' : 'Next Question'}</button>
      )}
      
    </div>
    </>
  )
}

export default App