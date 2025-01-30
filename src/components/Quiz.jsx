import {useEffect, useState} from "react";
import axios from "axios";

const Quiz = () => {
  const [section, setSection] = useState(1); // Default section 1
  const [words, setWords] = useState([]);
  const [wordCorrectCounts, setWordCorrectCounts] = useState({}); // Tracks correct counts per word
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState([]);
  const [correctCounts, setCorrectCounts] = useState(0); // Tracks total correct answers

  // Fetch words whenever section changes
  useEffect(() => {
    fetchWords();
  }, [section]);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const {data} = await axios.get(
        `https://kmfpairlist-backend.vercel.app/get-pairlist?section=${section}`
      );

      const wordsList = data.cursor; // Assuming `cursor` holds words
      if (wordsList && wordsList.length > 0) {
        setWords(wordsList);
        setWordCorrectCounts(
          wordsList.reduce((acc, word) => ({...acc, [word.word1]: 0}), {})
        ); // Initialize all words with 0 correct answers
        setCurrentQuizIndex(0);
        setQuizEnded(false);
        setIncorrectAnswers([]);
        setCorrectCounts(0);
      }
    } catch (error) {
      console.error("Error fetching words:", error);
    }
    setLoading(false);
  };

  // Get options for the current question (correct word + 3 incorrect)
  const getOptions = correctWord => {
    const incorrectOptions = words
      .filter(word => word.word1 !== correctWord)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    return [...incorrectOptions, {word1: correctWord}];
  };

  // Handle answer selection
  const handleAnswer = (chosenWord, correctWord) => {
    setSelectedAnswer(chosenWord);
    const isCorrect = chosenWord === correctWord;

    if (isCorrect) {
      setAnswerStatus("correct");
      setWordCorrectCounts(prevCounts => {
        const newCounts = {
          ...prevCounts,
          [correctWord]: prevCounts[correctWord] + 1,
        };

        // Update total correct count
        setCorrectCounts(
          Object.values(newCounts).reduce(
            (sum, count) => sum + (count >= 4 ? 1 : 0),
            0
          )
        );

        // Check if all words have been answered correctly 4 times
        if (Object.values(newCounts).every(count => count >= 4)) {
          setQuizEnded(true);
        }

        return newCounts;
      });
    } else {
      setAnswerStatus("incorrect");
      setIncorrectAnswers(prev => [
        ...prev,
        {word1: correctWord, meaning: words[currentQuizIndex].meaning},
      ]);
    }

    setTimeout(() => {
      // Find the next word that hasn’t been answered correctly 4 times
      const remainingWords = words.filter(
        word => wordCorrectCounts[word.word1] < 4
      );
      if (remainingWords.length > 0) {
        setCurrentQuizIndex(
          prevIndex => (prevIndex + 1) % remainingWords.length
        );
      }

      setAnswerStatus(null);
      setSelectedAnswer(null);
    }, 1000);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Quiz - Section {section}</h2>
        <p className="text-base text-indigo-600">
          {correctCounts} / {words.length} correct!
        </p>
      </div>

      {/* Section Selection Dropdown */}
      <div className="bg-stone-50 mb-4 border-b-2 border-b-gray-300 flex justify-between md:w-full items-center px-3 py-3">
        {/* Dropdown for selecting section */}
        <label htmlFor="section-select" className="font-semibold">
          Choose Section:
        </label>
        <select
          value={section}
          onChange={e => setSection(Number(e.target.value))}
          className=" text-black border-0 outline-0 rounded"
        >
          {Array.from({length: 41}, (_, index) => (
            <option key={index + 1} value={index + 1}>
              Section {index + 1}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading quiz...</p>
      ) : (
        words.length > 0 &&
        !quizEnded && (
          <div className="border p-3 mb-3 rounded-md shadow">
            {words[currentQuizIndex] && (
              <>
                <p className="font-semibold">
                  {words[currentQuizIndex].meaning}
                </p>
                <div className="mt-2">
                  {getOptions(words[currentQuizIndex].word1).map(option => (
                    <button
                      key={option.word1}
                      className={`block w-full bg-gray-200 hover:bg-blue-500 hover:text-white p-2 rounded-md mb-1 ${
                        selectedAnswer === option.word1 &&
                        answerStatus === "correct"
                          ? "bg-green-500"
                          : selectedAnswer === option.word1 &&
                            answerStatus === "incorrect"
                          ? "bg-red-500"
                          : ""
                      }`}
                      onClick={() =>
                        handleAnswer(
                          option.word1,
                          words[currentQuizIndex].word1
                        )
                      }
                    >
                      {option.word1}
                    </button>
                  ))}
                </div>

                {/* Show answer status */}
                {answerStatus && (
                  <p
                    className={`mt-2 text-sm ${
                      answerStatus === "correct"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {answerStatus === "correct"
                      ? `Correct!\t\t \t\t\t\t\t\t\t Pair:  ${words[currentQuizIndex].word2}`
                      : "Incorrect, try again!"}
                  </p>
                )}

                {/* Show progress for each word */}
                {/* <div className="mt-3">
                  {words.map(word => (
                    <p key={word.word1}>
                      {word.word1}: {wordCorrectCounts[word.word1] || 0}/4
                      correct
                    </p>
                  ))}
                </div> */}
              </>
            )}
          </div>
        )
      )}

      {/* Show results after quiz is completed */}
      {quizEnded && (
        <div className="mt-4 p-4 border rounded shadow-md">
          <h3 className="text-xl font-semibold">Quiz Finished!</h3>
          <p className="mt-2 text-lg">
            You answered all words correctly 4 times!
          </p>

          {/* Show incorrect answers if any */}
          {quizEnded && incorrectAnswers.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-lg">
                Words You Got Incorrect:
              </h4>
              <ul>
                {incorrectAnswers.map((answer, index) => (
                  <li key={index} className="mt-2">
                    <p>
                      <span className="font-bold">{answer.meaning}</span>:{" "}
                      {answer.word1}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
