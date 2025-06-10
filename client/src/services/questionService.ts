import type { Question } from '../models/Question.js';

export const fetchRandomQuestions = async (): Promise<Question[]> => {
  try {
    const response = await fetch('/api/questions/random', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const questionData: Question[] = await response.json();
    return questionData;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};