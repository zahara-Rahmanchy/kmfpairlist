import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import FlipCard from "./components/FlipCard";
import {useState} from "react";
import {useEffect} from "react";
import axios from "axios";
import "./App.css";
import {PairListTable} from "./components/PairListTable";

// eslint-disable-next-line react/prop-types
const CustomArrow = ({className, style, onClick}) => (
  <div
    className={`${className}`}
    style={{
      ...style,
      // color: "#ffff",
      background: "#312c85", // Set arrow background
      borderRadius: "50%", // Make it circular
    }}
    onClick={onClick}
  />
);
export default function App() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [flippedCard, setFlippedCard] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [meaning, setShowMeaning] = useState(false);
  const [sectionNumber, setSectionNumber] = useState(1);
  const [isLoading, setISloading] = useState(false);
  const [words, setWords] = useState([]);

  const fetchData = async sectionNumber => {
    setISloading(true);
    try {
      const response = await axios.get(
        `https://kmfpairlist-backend.vercel.app/get-pairlist?section=${sectionNumber}`
      );
      const data = response.data;
      // console.log("data: ", data);
      setCount(data.count);
      setWords(data.cursor); // Assuming cursor contains the list of words
      // console.log("Data fetched from server", data.data);
      setISloading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when section changes
  useEffect(() => {
    fetchData(sectionNumber);
  }, [sectionNumber]);
  const handleSectionChange = event => {
    setSectionNumber(Number(event.target.value));
  };

  const handleInputChange = (e, cardIndex) => {
    const value = e.target.value;
    setInput(value); // Update input value
    setIsTyping(true);
    // Clear the existing timer if the user is still typing
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    console.log("Typing started at:", new Date().toLocaleTimeString());

    // Set a new timer to check after a delay (e.g., 300ms)
    const timeout = setTimeout(() => {
      setIsTyping(false);

      console.log("Typing stopped at:", new Date().toLocaleTimeString());

      // Determine the correct word to compare against based on which card is flipped
      const correctWord =
        flippedCard === cardIndex
          ? words[cardIndex].word1
          : words[cardIndex].word2;

      console.log("Correct word:", correctWord);

      // Check if the input matches the correct word
      if (value.trim().toLowerCase() === correctWord.toLowerCase()) {
        setIsCorrect(true); // Correct
      } else {
        setIsCorrect(false); // Incorrect
      }
    }, 1000);
    // Store the timeout ID in the state
    setTypingTimeout(timeout);
  };

  const settings = {
    className: " md:w-100 w-[85%] mx-10 mb-10",
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    appendDots: i => (
      <div className="mt-10 ">
        {" "}
        {/* Add margin-top here for spacing */}
        <ul className="slick-dots">{i}</ul>
      </div>
    ),
    // Reset the input field when the slide changes
    beforeChange: () => {
      setInput(""); // Clear the input field
      setIsCorrect(null); // Reset correctness state
    },

    // customPaging: function (i) {
    //   return (
    //     <a className={`p-2 rounded ${"text-blue-600 bg-blue-100"}`}>{i + 1}</a>
    //   );
    // },

    // customPaging: function (i) {
    //   return (
    //     <a className="text-stone-500 bg-stone-100 p-1 m-3 rounded">{i + 1}</a>
    //   );
    // },

    dotsClass: "slick-dots flex justify-center space-x-2 mt-4",
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          // dots: true,
        },
      },
    ],
    // customPaging: () => (
    //   <button className="w-3 h-3 rounded-full bg-gray-300 hover:bg-indigo-500"></button>
    // ),

    nextArrow: <CustomArrow />,
    prevArrow: <CustomArrow />,
  };
  return (
    <>
      <div className=" slider-container flex flex-col justify-center items-center mt-10 w-full">
        <h1 className="text-2xl my-10 font-semibold italic text-indigo-950 text-center">
          KMF Pair List - Sentence Equivalence
        </h1>
        <div className="bg-stone-50 mb-4 border-b-2 border-b-gray-300 flex justify-between md:w-100 w-[85%] items-center px-3 py-3">
          {/* Dropdown for selecting section */}
          <select
            value={sectionNumber}
            onChange={handleSectionChange}
            className=" text-black border-0 outline-0 rounded"
          >
            {Array.from({length: 41}, (_, index) => (
              <option key={index + 1} value={index + 1}>
                Section {index + 1}
              </option>
            ))}
          </select>
          <p className="  text-black text-sm rounded">Words : {count}</p>
        </div>
        <Slider {...settings}>
          {isLoading && (
            <div className="flex flex-row mx-auto items-center justify-center h-full text-center">
              <div className="w-[30px] h-[30px] mx-auto   text-center border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          )}
          {words.map((item, index) => (
            <div key={index} className="bg-indigo-100 shadow-cyan-950 shadow">
              <FlipCard
                word1={item.word1}
                word2={item.word2}
                id={index + 1}
                setFlippedCard={setFlippedCard}
              />
              <div className="flex justify-between space-x-1.5 items-center mx-2 my-2 px-2 py-1">
                <div>
                  <input
                    type="text"
                    placeholder="Type the other pair here"
                    className="border-b-2 float-left border-0 outline-0 md:w-fit w-[80%] placeholder:text-xs"
                    value={input}
                    onChange={e => handleInputChange(e, index)}
                  />
                  {isCorrect === true && !isTyping && (
                    <p className="text-lime-500 font-extrabold text-sm mt-2 shadow-2xl">
                      &#10004;
                    </p> // Show correct message in green
                  )}
                  {isCorrect === false && input !== "" && !isTyping && (
                    <p className="text-red-500 text-sm mt-2">
                      Wrong, try again!
                    </p> // Show "Wrong" message
                  )}
                </div>
                <div>
                  <button
                    onClick={() => setShowMeaning(!meaning)}
                    className=" float-right cursor-pointer rounded bg-indigo-900 text-white px-2 py-1"
                  >
                    Meaning
                  </button>
                </div>
              </div>
              <div
                className={`${
                  meaning
                    ? "min-h-[50px] p-3  border-stone-200 border-t-[1px] max-h-fit opacity-100"
                    : "max-h-0 min-h-0 opacity-0"
                }  transition-all duration-500 ease-in-out`}
              >
                {item.meaning}
              </div>
            </div>
          ))}
        </Slider>
        <div className="my-10 w-full">
          <PairListTable wordlist={words} sectionNumber={sectionNumber} />
        </div>
      </div>
    </>
  );
}
