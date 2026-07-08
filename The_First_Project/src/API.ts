import { shuffleArray } from "./utils";

export type Question = {
    category: string;
    correct_answer: string;
    difficulty: string;
    incorrect_answers: string[];
    question: string;
    type: string;
};

export type QuestionState = Question & { answers: string[] };

export type Difficulty = "easy" | "medium" | "hard";

export const fetchQuizQuestions = async (
    amount: number,
    difficulty: Difficulty
): Promise<QuestionState[]> => {
    const endpoint = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`;

    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // The Open Trivia DB API signals failure via response_code rather than
    // an HTTP error status, so it has to be checked explicitly.
    if (data.response_code !== 0) {
        throw new Error(
            "No questions were returned for the selected options. Try a different difficulty."
        );
    }

    return data.results.map((question: Question) => ({
        ...question,
        answers: shuffleArray([...question.incorrect_answers, question.correct_answer]),
    }));
};