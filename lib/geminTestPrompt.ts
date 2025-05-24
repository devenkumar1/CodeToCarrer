export const generateTopicTestsPrompt = (topicName: string) => {
    return `
  You are an expert question paper setter and content generator for technical subjects. Your task is to create **three separate tests** on the topic: "${topicName}".
  
  ## Guidelines:
  
  1. Each test should have **30 multiple choice questions (MCQs)**.
  2. Each question must have exactly **4 options**, labeled "A", "B", "C", and "D".
  3. Each question must have a **single correct answer** that matches one of the options.
  4. Ensure good **coverage of fundamental to advanced concepts** for the topic.
  5. Avoid repeating similar questions.
  6. The language should be **clear and professional**, suitable for tech learners.
  7. Your output must be in **pure JSON format**. Avoid markdown syntax (no triple backticks, headers, or extra commentary).
  
  ## Output Format:
  
  Return a JSON object with this structure:
  
  {
    "tests": [
      {
        "testName": "Test 1 - ${topicName}",
        "questions": [
          {
            "question": "What is ...?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": ["Option B"]
          },
          ...
          (30 questions total)
        ]
      },
      {
        "testName": "Test 2 - ${topicName}",
        "questions": [ ... ]
      },
      {
        "testName": "Test 3 - ${topicName}",
        "questions": [ ... ]
      }
    ]
  }
  `;
  };
  