require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

function generatePrompt(topic) {
  const qTopic = topic[0].toUpperCase() + topic.slice(1).toLowerCase();
  return `Return words and clues for 10 short nouns related to ${qTopic}. 
	JSON Format. Example: 
	[{"word": "Airplane", "clue": "A 20th century invention that revolutionized global travel and made the world seem a little smaller."},
	{"word": "Ford", "clue": "This American company, started in the early 1900s, played a crucial role in mobilizing the masses."}]`;
}

exports.getWords = async (req, res) => {
  const { topic } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(topic),
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }

  // console.log("Request received");
  // console.log(topic);
  // const completion = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   prompt: generatePrompt(topic),
  //   temperature: 0.6,
  // });
  // res.end(completion);
};

//summarize text
exports.summarize = async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Summarize this: \n${text}`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//generate a paragraph
exports.paragraph = async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Write a detailed paragraph about: \n${text}`,
      max_tokens: 500,
      temperature: 0.5,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//generate a yoda-like chatbot
exports.chatbot = async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Answer questions similar to how Yoda from Star Wars would.
            Me: "What is your name?"
            Yoda: "Yoda my name is."
            Me: "How old are you?"
            Yoda: "Old I am. 900 years old I am."
            Me: "What is your favorite color?"
            Yoda: "Blue my favorite color is."
            Me; ${text}`,
      max_tokens: 300,
      temperature: 0.7,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//convert english into javscript
exports.jsConverter = async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `/* Convert these instruction into JavaScript code: \n${text} */`,
      max_tokens: 400,
      temperature: 0.25,
    });
    if (response.data) {
      if (response.data.choices[0].text) {
        return res.status(200).json(response.data.choices[0].text);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};

//generate a sci-fi image
exports.scifi = async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.createImage({
      prompt: `Generate a sci-fi image of ${text}`,
      n: 1,
      size: "512x512",
    });
    if (response.data) {
      if (response.data.data[0].url) {
        return res.status(200).json(response.data.data[0].url);
      }
    }
  } catch (err) {
    return res.status(404).json({ message: err.message });
  }
};
