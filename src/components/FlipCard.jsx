/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import {useState} from "react";

const FlipCard = ({word1, word2, id, setFlippedCard}) => {
  const [isFlipped, setIsFlipped] = useState(false); // Track if card is flipped

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setFlippedCard(isFlipped ? null : id - 1); // Update the flipped card in parent
  };
  return (
    <div className="flex items-center justify-center ">
      <div className="w-full h-40 [perspective:1000px] ">
        {/* Hidden Checkbox */}
        {/* <input
          type="checkbox"
          id={`flipToggle-${id}`}
          className="peer hidden"
        /> */}

        {/* Card Wrapper */}
        <div
          className={`relative block w-full h-full cursor-pointer transition-transform duration-700 [transform-style:preserve-3d] ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={handleFlip} // Flip card on click
        >
          {/* Front Side */}
          <div className="absolute inset-0 text-3xl bg-cyan-50 text-black  flex flex-col items-center justify-center  [backface-visibility:hidden]">
            {word1}
          </div>
          {/* Back Side */}
          <div className="absolute inset-0 bg-green-100 text-black text-3xl flex items-center justify-center [backface-visibility:hidden] rotate-y-180">
            {word2}
            {/* <p className="text-black">Tap anywhere to see the pair</p> */}
          </div>
          {/* </label> */}
        </div>
        <p className="absolute bottom-1 left-1 text-gray-400 text-xs  px-1 py-0.5 rounded">
          Tap on the card to reveal the pair
        </p>
      </div>
    </div>
  );
};

export default FlipCard;
