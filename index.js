const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const questions = require("./data/questions.json");

const app = express();

app.listen(3000, () => {
  console.log("App is running on 3000");
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function dfs(marks, allquestions, required_questions, max) {
  if (max < 0) {
    return [-1, required_questions];
  }
  if (marks === 0) {
    return [1, required_questions];
  }
  if (marks < 0) {
    return [-1, required_questions];
  }
  if (allquestions.length == 0) {
    return [-1, required_questions];
  }

  const matrix = new Set();

  while (matrix.size < max) {
    const random_number = randomNumber(0, max);
    matrix.add(random_number);
    if (allquestions[random_number].marks > marks) {
      continue;
    }

    let curr_marks = allquestions[random_number].marks;
    required_questions.push(allquestions[random_number]);
    allquestions.splice(random_number, 1);

    let [ret, req_questions] = dfs(
      marks - curr_marks,
      allquestions,
      required_questions,
      max - 1
    );
    if (ret === 1) {
      return [ret, req_questions];
    } else {
      const last_element = required_questions.pop();
      allquestions.splice(random_number, 0, last_element);
    }
  }

  return [-1, required_questions];
}

function topicwise_dfs(marks, marks_obj, topics_weightage, allquestions) {
  if (marks === 0) {
    return [1, []];
  }
  if (marks < 0) {
    return [-1, []];
  }
  if (allquestions.length == 0) {
    return [-1, []];
  }

  let required_questions = [];

  for (key in topics_weightage) {
    let topic_questions = allquestions.filter((question) => {
      return question.topic === key;
    });
    allquestions = allquestions.filter((question) => {
      return question.topic !== key;
    });

    topic_questions.sort((question1, question2) => {
      if (question1.marks > question2.marks) {
        return 1;
      }
      return -1;
    });
    let [ret, req_questions] = dfs(
      (marks * parseInt(topics_weightage[key].slice(0, -1))) / 100,
      topic_questions,
      [],
      topic_questions.length
    );
    if (ret === -1) {
      return [-1, []];
    } else {
      for (let i = 0; i < req_questions.length; i++) {
        marks_obj[req_questions[i].difficulty] -= req_questions[i].marks;
      }
      required_questions = required_questions.concat(req_questions);
    }
  }

  let _questions = questions["questions"].filter((question) => {
    return question.difficulty === "Easy";
  });

  _questions.sort((question1, question2) => {
    if (question1.marks > question2.marks) {
      return 1;
    }
    return -1;
  });
  let [ret, req_questions] = dfs(
    marks_obj["Easy"],
    _questions,
    [],
    _questions.length
  );
  if (ret === -1) {
    return [-1, required_questions];
  }
  required_questions = required_questions.concat(req_questions);

  _questions = questions["questions"].filter((question) => {
    return question.difficulty === "Medium";
  });

  _questions.sort((question1, question2) => {
    if (question1.marks > question2.marks) {
      return 1;
    }
    return -1;
  });
  [ret, req_questions] = dfs(
    marks_obj["Medium"],
    _questions,
    [],
    _questions.length
  );
  if (ret === -1) {
    return [-1, required_questions];
  }
  required_questions = required_questions.concat(req_questions);

  _questions = questions["questions"].filter((question) => {
    return question.difficulty === "Hard";
  });

  _questions.sort((question1, question2) => {
    if (question1.marks > question2.marks) {
      return 1;
    }
    return -1;
  });
  [ret, req_questions] = dfs(
    marks_obj["Hard"],
    _questions,
    [],
    _questions.length
  );
  if (ret === -1) {
    return [-1, required_questions];
  }
  required_questions = required_questions.concat(req_questions);
  return [1, required_questions];
}

function* topicwise_generator(
  questions_req,
  marks_obj,
  required_questions,
  allquestions,
  index
) {
  if (questions_req === 0) {
    yield required_questions;
    return;
  }
  if (index >= allquestions.length) {
    return;
  }
  required_questions.push(allquestions[index]);
  marks_obj[allquestions[index].difficulty] -= allquestions[index].marks;
  allquestions.splice(index, 1);
  yield* topicwise_generator(
    questions_req - 1,
    marks_obj,
    required_questions,
    allquestions,
    index + 1
  );

  let last_element = required_questions.pop();
  marks_obj[last_element.difficulty] += last_element.marks;
  allquestions.splice(index, 0, last_element);
  yield* topicwise_generator(
    questions_req,
    marks_obj,
    required_questions,
    allquestions,
    index + 1
  );
  return;
}

function paper_generator_topicwise(
  marks,
  total_questions,
  marks_obj,
  topics_weightage,
  allquestions,
  index
) {
  let req_questions = [];
  if (index >= Object.entries(topics_weightage).length) {
    let _questions = allquestions.filter((question) => {
      return question.difficulty === "Easy";
    });
    _questions.sort((question1, question2) => {
      if (question1.marks > question2.marks) {
        return 1;
      }
      return -1;
    });
    let [ret, reqs_questions] = dfs(
      marks_obj["Easy"],
      _questions,
      [],
      _questions.length
    );
    if (ret === -1) {
      return [-1, req_questions];
    }
    total_questions -= reqs_questions.length;
    req_questions = req_questions.concat(reqs_questions);

    _questions = allquestions.filter((question) => {
      return question.difficulty === "Medium";
    });
    _questions.sort((question1, question2) => {
      if (question1.marks > question2.marks) {
        return 1;
      }
      return -1;
    });
    [ret, reqs_questions] = dfs(
      marks_obj["Medium"],
      _questions,
      [],
      _questions.length
    );
    if (ret === -1) {
      return [-1, req_questions];
    }
    total_questions -= reqs_questions.length;
    req_questions = req_questions.concat(reqs_questions);

    _questions = allquestions.filter((question) => {
      return question.difficulty === "Hard";
    });
    _questions.sort((question1, question2) => {
      if (question1.marks > question2.marks) {
        return 1;
      }
      return -1;
    });
    [ret, reqs_questions] = dfs(
      marks_obj["Hard"],
      _questions,
      [],
      _questions.length
    );
    if (ret === -1) {
      return [-1, req_questions];
    }
    total_questions -= reqs_questions.length;
    req_questions = req_questions.concat(reqs_questions);

    if (total_questions !== 0) {
      return [-1, req_questions];
    }
    return [1, req_questions];
  }

  let topic_questions = allquestions.filter((question) => {
    return question.topic === Object.entries(topics_weightage)[index][0];
  });

  allquestions = allquestions.filter((question) => {
    return question.topic !== Object.entries(topics_weightage)[index][0];
  });

  topic_questions.sort((question1, question2) => {
    if (question1.marks > question2.marks) {
      return 1;
    }
    return -1;
  });

  console.log(
    Math.ceil(
      (total_questions *
        parseInt(Object.entries(topics_weightage)[index][1].slice(0, -1))) /
        100
    )
  );
  let generatorr = topicwise_generator(
    Math.ceil(
      (total_questions *
        parseInt(Object.entries(topics_weightage)[index][1].slice(0, -1))) /
        100
    ),
    marks_obj,
    [],
    topic_questions,
    0
  );
  req_questions = generatorr.next().value;
  while (req_questions !== undefined) {
    let [ret, reqs_questions] = paper_generator_topicwise(
      marks,
      total_questions - req_questions.length,
      marks_obj,
      topics_weightage,
      allquestions,
      index + 1
    );
    if (ret === 1) {
      return [1, req_questions.concat(reqs_questions)];
    }
    req_questions = generatorr.next().value;
  }
  return [-1, []];
}

app.get("/generate_paper", async (req, res) => {
  try {
    const { marks, difficulty } = req.body;
    const easy_marks =
      (marks * parseInt(difficulty["Easy"].slice(0, -1))) / 100;
    const medium_marks =
      (marks * parseInt(difficulty["Medium"].slice(0, -1))) / 100;
    const hard_marks =
      (marks * parseInt(difficulty["Hard"].slice(0, -1))) / 100;

    let easy_questions = questions["questions"].filter((question) => {
      return question.difficulty === "Easy";
    });

    easy_questions.sort((question1, question2) => {
      if (question1.marks > question2.marks) {
        return 1;
      }
      return -1;
    });

    let medium_questions = questions["questions"].filter((question) => {
      return question.difficulty === "Medium";
    });

    medium_questions.sort((question1, question2) => {
      if (question1.marks > question2.marks) {
        return 1;
      }
      return -1;
    });

    let hard_questions = questions["questions"].filter((question) => {
      return question.difficulty === "Hard";
    });

    hard_questions.sort((question1, question2) => {
      if (question1.marks > question2.marks) {
        return 1;
      }
      return -1;
    });

    let required_questions = [];

    let [ret, req_questions] = await dfs(
      easy_marks,
      easy_questions,
      [],
      easy_questions.length
    );
    if (ret === -1) {
      return res.send("Not enough questions in question bank");
    }
    required_questions = required_questions.concat(req_questions);

    [ret, req_questions] = await dfs(
      medium_marks,
      medium_questions,
      [],
      medium_questions.length
    );
    if (ret === -1) {
      return res.send("Not enough questions in question bank");
    }
    required_questions = required_questions.concat(req_questions);

    [ret, req_questions] = await dfs(
      hard_marks,
      hard_questions,
      [],
      hard_questions.length
    );
    if (ret === -1) {
      return res.send("Not enough questions in question bank");
    }
    required_questions = required_questions.concat(req_questions);

    return res.send(required_questions);
  } catch (err) {
    console.log(err);
    return res.send("Error");
  }
});

app.get("/get_questions_topicwise", async (req, res) => {
  try {
    const { marks, difficulty, weightage } = req.body;
    const easy_marks =
      (marks * parseInt(difficulty["Easy"].slice(0, -1))) / 100;
    const medium_marks =
      (marks * parseInt(difficulty["Medium"].slice(0, -1))) / 100;
    const hard_marks =
      (marks * parseInt(difficulty["Hard"].slice(0, -1))) / 100;

    let marks_obj = {
      Easy: easy_marks,
      Medium: medium_marks,
      Hard: hard_marks,
    };

    let [ret, req_questions] = await topicwise_dfs(
      marks,
      marks_obj,
      weightage,
      questions["questions"],
      []
    );

    if (ret === -1) {
      return res.send("Not enough question in bank");
    }
    return res.send(req_questions);
  } catch (err) {
    console.log(err);
    return res.send("Error");
  }
});

app.get("/paper_generator_topicwise", async (req, res) => {
  try {
    const { marks, difficulty, weightage, total_questions } = req.body;
    const easy_marks =
      (marks * parseInt(difficulty["Easy"].slice(0, -1))) / 100;
    const medium_marks =
      (marks * parseInt(difficulty["Medium"].slice(0, -1))) / 100;
    const hard_marks =
      (marks * parseInt(difficulty["Hard"].slice(0, -1))) / 100;

    let marks_obj = {
      Easy: easy_marks,
      Medium: medium_marks,
      Hard: hard_marks,
    };

    let [ret, req_questions] = await paper_generator_topicwise(
      marks,
      total_questions,
      marks_obj,
      weightage,
      questions["questions"],
      0
    );

    if (ret === -1) {
      return res.send("Not enough questions in question bank");
    }
    return res.send(req_questions);
  } catch (err) {
    console.log(err);
    return res.send("Error");
  }
});

app.use((req, res) => {
  res.status(404).send("404: Page not found");
});
