import React from 'react';
// types
import { type answerObject } from '../App';
// this component (any question) divides by 4 props 👇👇:
type props = {
    question: string;
    answers: string[]; // UnCorrect Answers That I Shouldn`t Choice It
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer: answerObject | undefined;
    questionNr: number;
    totalQuestions: number;
}
const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const getButtonColor = (answer: string, userAnswer: answerObject | undefined) => {
    if (!userAnswer) return '#fff';

    const normalized = (value: string) => decodeHtml(value).trim().toLowerCase();

    if (normalized(answer) === normalized(userAnswer.correct_answer)) {
        return '#56FFA4'; // the correct answer, always highlighted once answered
    }
    if (normalized(answer) === normalized(userAnswer.answer)) {
        return '#FF5656'; // what the user picked, if it was wrong
    }
    return '#fff';
};

const QuestionCard: React.FC<props> = ({question, answers , callback, userAnswer, questionNr, totalQuestions}) => {
  return (
    <>
        <div className='container'>
            <p className="number">
                Question: {questionNr} / {totalQuestions}
            </p>

            <p className='question' dangerouslySetInnerHTML={{__html: question}}></p>

            <div className='button-wrapper'>
                {answers?.map((answer, index) => (
                    <div key={`${questionNr} - ${index}`} className='button-wrapper'>
                        <button disabled = {!!userAnswer}
                        value={answer}
                        onClick={callback}
                        style={userAnswer 
                            ? { background: getButtonColor(answer, userAnswer) } : undefined
                        }
                        >
                        <span dangerouslySetInnerHTML={{__html: answer}}></span>
                        </button>
                    </div>
                ))}
            </div>

        </div>
    </>
  );
};

export default QuestionCard