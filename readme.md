# Reelo Assignment - Question Paper Generator

## Overview

This Node.js application is designed to generate question papers based on a question bank provided in a JSON file. The application exposes three REST APIs for different functionalities related to question paper generation.

## Prerequisites

- Node.js installed on your machine.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/reelo.git
   ```

2. Navigate to the project directory:

   ```bash
   cd reelo
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

### 1. Generate Basic Question Paper

Endpoint: `/generate_paper`

- Method: `POST`
- Request Body:
  ```json
  {
    "total_marks": 50,
    "difficulty": {
      "Easy": "28%",
      "Medium": "40%",
      "Hard": "32%"
    }
  }
  ```
- Example:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"total_marks": 50,"difficulty": {"Easy": "28%","Medium": "40%","Hard": "32%"}}' http://localhost:3000/generate_paper
  ```

## `dfs` Function

The `dfs` function is a critical component of the first API in this application. Its primary role is to generate a question paper based on the specified parameters, including total marks, a pool of all available questions, the number of required questions, and the maximum limit for each difficulty level.

### Function Signature:

```javascript
function dfs(marks, allquestions, required_questions, max) {
  // Function implementation
}
```

### Parameters:

- **`marks`**: Total marks for the question paper.
- **`allquestions`**: A pool of all available questions.
- **`required_questions`**: The number of questions required for the paper.
- **`max`**: Maximum limit for each difficulty level.

### Functionality:

1. **Depth-First Search (DFS) Algorithm:**
   - The function employs a depth-first search algorithm to traverse the available questions and select the optimal combination that meets the specified requirements.

2. **Difficulty Level Weightage:**
   - The function ensures that the selected questions maintain the desired weightage for each difficulty level, as defined by the `max` parameter. This ensures a balanced distribution of easy, medium, and hard questions.

3. **Total Marks Calculation:**
   - The function calculates the total marks of the generated question paper, providing users with a clear understanding of the paper's overall difficulty level.

### Example Usage:

```javascript
const generatedPaper = dfs(50, allQuestionsPool, [], { "Easy": 14, "Medium": 20, "Hard": 16 });
```

### Important Note:

Feel free to enhance the function based on specific use cases and requirements.

### 2. Get Questions Topicwise

Endpoint: `/get_questions_topicwise`

- Method: `POST`
- Request Body:
  ```json
  {
    "total_marks": 50,
    "difficulty": {
      "Easy": "28%",
      "Medium": "40%",
      "Hard": "32%"
    },
    "weightage": {
      "Democracy": "8%"
    }
  }
  ```
- Example:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"total_marks": 50,"difficulty": {"Easy": "28%","Medium": "40%","Hard": "32%"},"weightage": {"Democracy": "8%"}}' http://localhost:3000/get_questions_topicwise
  ```

## `topicwise_dfs` Function

The `topicwise_dfs` function is a core component of the second API in this application. Its primary responsibility is to generate a question paper based on the specified parameters, including total marks, marks distribution across difficulty levels, topic-wise weightage, and a pool of all available questions.

### Function Signature:

```javascript
function topicwise_dfs(marks, marks_obj, topics_weightage, allquestions) {
  // Function implementation
}
```

### Parameters:

- **`marks`**: Total marks for the question paper.
- **`marks_obj`**: Marks distribution across difficulty levels.
- **`topics_weightage`**: Weightage of each topic in terms of marks percentage.
- **`allquestions`**: A pool of all available questions.

### Functionality:

1. **Topic-wise Question Selection:**
   - The function utilizes a depth-first search (DFS) approach to select questions for each topic based on their weightage in the total marks. It ensures that each topic contributes its designated percentage of marks to the total marks.

2. **Difficulty Level Distribution:**
   - Within each topic, the function further distributes marks across difficulty levels according to the provided `marks_obj`. This ensures a balanced representation of easy, medium, and hard questions within each topic.

3. **Marks Percentage Calculation:**
   - The function calculates the marks percentage of each topic from the total marks. This information can be useful for users to understand the distribution of marks across different topics.

### Example Usage:

```javascript
const generatedPaper = topicwise_dfs(
  50,
  { "Easy": 14, "Medium":20, "Hard": 16 },
  { "Democracy": "8%" },
  allQuestionsPool
);
```

### Important Note:

- Adjust the function as needed to accommodate any specific business rules, error handling, or additional features required by your application.

Feel free to enhance the function based on specific use cases and requirements.

### 3. Paper Generator Topicwise

Endpoint: `/paper_generator_topicwise`

- Method: `POST`
- Request Body:
  ```json
  {
    "total_marks": 50,
    "difficulty": {
      "Easy": "28%",
      "Medium": "40%",
      "Hard": "32%"
    },
    "total_questions": 13,
    "weightage": {
      "Democracy": "7.69%"
    }
  }
  ```
- Example:
  ```bash
  curl -X POST -H "Content-Type: application/json" -d '{"total_marks": 50,"difficulty": {"Easy": "28%","Medium": "40%","Hard": "32%"},"total_questions": 13,"weightage":{"Democracy": "7.69%"}}' http://localhost:3000/paper_generator_topicwise
  ```

## `paper_generator_topicwise` Function

The `paper_generator_topicwise` function is a key component of the third API in this application. It is responsible for generating a question paper based on various parameters, including total marks, the number of total questions, marks distribution across difficulty levels, topic-wise weightage, a pool of all available questions, and an index to keep track of the current question set.

### Function Signature:

```javascript
function paper_generator_topicwise(
  marks,
  total_questions,
  marks_obj,
  topics_weightage,
  allquestions,
  index
) {
  // Function implementation
}
```

### Parameters:

- **`marks`**: Total marks for the question paper.
- **`total_questions`**: Total number of questions to be included in the paper.
- **`marks_obj`**: Marks distribution across difficulty levels.
- **`topics_weightage`**: Weightage of each topic in terms of marks percentage.
- **`allquestions`**: A pool of all available questions.
- **`index`**: Index to keep track of the current topic.

### Functionality:

1. **Topic-wise Question Selection:**
   - The function begins by selecting questions for each topic based on their weightage in the total number of questions. It ensures that each topic contributes its designated percentage of marks to the total marks.

2. **Random Question Selection:**
   - After selecting questions for each topic, the function fills in the remaining questions randomly from the pool of all available questions.

3. **Difficulty Level Distribution:**
   - The function takes into account the marks distribution across difficulty levels (`marks_obj`) and assigns marks to questions accordingly.

### Example Usage:

```javascript
const generatedPaper = paper_generator_topicwise(
  50,
  13,
  { "Easy": 14, "Medium": 20, "Hard": 16 },
  { "Democracy": "7.69%" },
  allQuestionsPool,
  0
);
```

### Important Note:

Feel free to adjust the function or provide additional error handling based on specific use cases and requirements.

## Contributing

Feel free to contribute by opening issues, suggesting improvements, or submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.