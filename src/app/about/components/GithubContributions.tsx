"use client";

import React from "react";

const GithubContributions: React.FC = () => {
  return (
    <section
      id="github-contributions"
      className="py-4 bg-transparent w-screen relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]"
    >
      <div className="flex flex-col items-center">
        <p className="text-gray-300 mb-6 text-center max-w-xl">
          Here's a snapshot of my coding activity over the past year on GitHub.
        </p>

        <div className="bg-transparent p-4 rounded-2xl flex justify-center w-full">
          <img
            src="https://ghchart.rshah.org/0aff0a/rekht"
            alt="GitHub contribution graph"
            className="
              rounded-lg
              w-[98vw]          /* hampir selebar viewport penuh */
              sm:w-[95vw]
              md:w-[90vw]
              lg:w-[85vw]
              xl:w-[80vw]
              max-w-none        /* hilangkan batas maksimal */
              invert brightness-90 contrast-125
            "
          />
        </div>
      </div>
    </section>
  );
};

export default GithubContributions;
