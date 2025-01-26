/* eslint-disable react/prop-types */
// import React from "react";

export const PairListTable = ({wordlist, sectionNumber}) => {
  //   console.log("wordlist: ", wordlist);
  return (
    <div className="md:w-[70%] w-[85%] mx-auto">
      <h1 className="text-2xl my-10 font-semibold italic text-indigo-950 text-center">
        Pair List Section - {sectionNumber}
      </h1>
      <div className="overflow-x-auto">
        <table className=" overflow-scroll table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-stone-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Word 1
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Word 2
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Meaning
              </th>
            </tr>
          </thead>
          <tbody>
            {wordlist !== undefined &&
              wordlist.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-stone-100"}
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {row.word1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.word2}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {row.meaning}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
