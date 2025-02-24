"use client";
import { useState } from "react";

const LearningMethod = () => {
  const [formStatus, setFormStatus] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [learningMethod, setLearningMethod] = useState("");
  const [outcome, setOutcome] = useState("");
  const handleNextStep = () => {
    if (formStatus < 4) setFormStatus(formStatus + 1);
  };

  const handlePreferences = (e: any) => {
    e.preventDefault();
    console.log("Preferences submitted!");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-800">
      {/* Learning Preference Modal */}
      {formStatus === 1 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-3/4 max-w-md h-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Learning Preference
            </h2>
            <h3 className="text-xl font-semibold mb-6 text-center">
              How do you prefer to learn?
            </h3>
            <div className="flex flex-col space-y-4">
              {[
                "Hands-on Projects",
                "Theoretical Knowledge",
                "Interactive Challenges",
                "Video Tutorials",
              ].map((method) => (
                <label className="flex items-center" key={method}>
                  <input
                    type="radio"
                    name="learning"
                    value={method}
                    onChange={(e) => setLearningMethod(e.target.value)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setFormStatus(2)}
                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {formStatus === 3 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-3/4 max-w-md h-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Learning Outcome
            </h2>
            <h3 className="text-xl font-semibold mb-6 text-center">
              How do you want to achieve through your learning ?
            </h3>
            <div className="flex flex-col space-y-4">
              {[
                "Academics",
                "Technical Interview",
                "Contribute to Open-Source",
                "Earn a Certification",
              ].map((method) => (
                <label className="flex items-center" key={method}>
                  <input
                    type="radio"
                    name="outcome"
                    value={method}
                    onChange={(e) => setOutcome(e.target.value)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setFormStatus(4)}
                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Experience Level Modal */}
      {formStatus === 2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-3/4 max-w-md h-auto">
            <h2 className="text-2xl font-semibold mb-4 pt-4 text-center">
              Experience Level
            </h2>
            <h3 className="text-xl font-semibold mb-6 text-center">
              How experienced are you with this language?
            </h3>
            <form id="experience-form">
              <div className="flex flex-col space-y-4 mb-6">
                {["Beginner", "Intermediate", "Advanced", "Expert"].map(
                  (level) => (
                    <label className="flex items-center" key={level}>
                      <input
                        type="radio"
                        name="experience"
                        value={level}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{level}</span>
                    </label>
                  )
                )}
              </div>
              <p className="text-gray-500 text-center mb-6">
                Please select your experience level.
              </p>
              <button
                type="button"
                onClick={() => setFormStatus(3)}
                className="flex items-center justify-center w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Submit Experience
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5-5 5M6 12h12"
                  ></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Form */}
      {formStatus !== 1 && formStatus !== 2 && (
        <div className="bg-white rounded-lg shadow-lg p-8 w-[80vh] h-[85vh]">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {formStatus === 0 ? "Choose Your Path" : "Final Step"}
          </h2>
          {formStatus === 0 && (
            <blockquote className="text-gray-600 italic mb-6 text-center">
              "The best way to predict the future is to invent it." - Alan Kay
            </blockquote>
          )}

          {/* Step 1: Select Language */}
          {formStatus === 0 && (
            <>
              <h3 className="text-xl font-semibold mb-6 text-center">
                Which Programming Language Do You Want to Learn?
              </h3>
              <div className="flex flex-col space-y-4 mb-6">
                {["JavaScript", "Python", "Java", "Ruby", "Go", "Other"].map(
                  (language) => (
                    <label className="flex items-center" key={language}>
                      <input
                        type="radio"
                        name="language"
                        value={language}
                        onChange={(e) => {
                          setSelectedLanguage(e.target.value);
                          if (e.target.value !== "Other") {
                            setCustomLanguage("");
                          }
                        }}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{language}</span>
                    </label>
                  )
                )}
              </div>
              {selectedLanguage === "Other" && (
                <input
                  type="text"
                  placeholder="Please specify..."
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                />
              )}
            </>
          )}

          {/* Final Step: Submit Form */}
          {formStatus === 4 && (
            <p className="text-center text-gray-700 mb-6">
              You have selected:{" "}
              <strong>{selectedLanguage || "No selection"}</strong> <br />
              Learning Method: <strong>{learningMethod}</strong> <br />
              Experience Level:{" "}
              <strong>{selectedExperience || "No selection"}</strong> <br />
              Outcome : <strong>{outcome}</strong> <br />
              Click "Submit" to complete your preference selection.
            </p>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4">
            {formStatus === 4 ? (
              <button
                onClick={handlePreferences}
                className="py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200"
              >
                Submit Preference
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Next Step
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningMethod;