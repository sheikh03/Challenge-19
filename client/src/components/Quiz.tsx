import { useState } from 'react';
import type { Question } from '../models/Question.js';
import { fetchRandomQuestions } from '../services/questionService.js';

const QuizApp = () => {
  const [questionBank, setQuestionBank] = useState<Question[]>([]);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasBegun, setHasBegun] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const fetchedQuestions = await fetchRandomQuestions();

      if (!fetchedQuestions || fetchedQuestions.length === 0) {
        throw new Error('No questions received from server');
      }

      setQuestionBank(fetchedQuestions);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load questions. Please try again.');
      setIsLoading(false);
    }
  };

  const processAnswer = (isAnswerCorrect: boolean) => {
    if (isAnswerCorrect) {
      setUserScore(prevScore => prevScore + 1);
    }

    const nextIdx = activeQuestionIdx + 1;
    if (nextIdx < questionBank.length) {
      setActiveQuestionIdx(nextIdx);
    } else {
      setIsFinished(true);
    }
  };

  const initializeQuiz = async () => {
    setHasBegun(true);
    setIsFinished(false);
    setUserScore(0);
    setActiveQuestionIdx(0);
    await loadQuestions();
  };

  // Welcome screen
  if (!hasBegun) {
    return (
      <div className="welcome-container p-4 text-center">
        <h1 className="mb-4">Tech Knowledge Assessment</h1>
        <button
          className="btn btn-success btn-lg"
          onClick={initializeQuiz}
        >
          Begin Assessment
        </button>
      </div>
    );
  }

  // Results screen
  if (isFinished) {
    return (
      <div className="results-panel card p-5 text-center">
        <h2 className="mb-3">Assessment Complete!</h2>
        <div className="alert alert-info mb-4">
          <h3>Final Score: {userScore} out of {questionBank.length}</h3>
          <p className="mb-0">
            {userScore >= questionBank.length * 0.8 ? 'Excellent work!' : 'Keep practicing!'}
          </p>
        </div>
        <button
          className="btn btn-primary btn-lg mx-auto"
          onClick={initializeQuiz}
        >
          Try Another Assessment
        </button>
      </div>
    );
  }

  // Loading state
  if (isLoading || (hasBegun && !isFinished && questionBank.length === 0)) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          {error ? (
            <>
              <div className="alert alert-danger">{error}</div>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </>
          ) : (
            <>
              <div className="spinner-border text-success mb-3" role="status">
                <span className="visually-hidden">Loading questions...</span>
              </div>
              <p>Preparing your assessment...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const activeQuestion = questionBank[activeQuestionIdx];

  // Question display
  return (
    <div className='question-card card p-4 shadow'>
      <div className="progress mb-3">
        <div
          className="progress-bar bg-success"
          style={{ width: `${((activeQuestionIdx + 1) / questionBank.length) * 100}%` }}
        >
          Question {activeQuestionIdx + 1} of {questionBank.length}
        </div>
      </div>

      <h3 className="mb-4">{activeQuestion.question}</h3>

      <div className="answer-options">
        {activeQuestion.answers.map((option, idx) => (
          <div key={idx} className="d-flex align-items-center mb-3">
            <button
              className="btn btn-outline-primary me-3 choice-btn"
              onClick={() => processAnswer(option.isCorrect)}
            >
              {String.fromCharCode(65 + idx)}
            </button>
            <div className="alert alert-light mb-0 flex-grow-1 choice-text">
              {option.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizApp;