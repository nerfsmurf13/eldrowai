const express = require("express");
const router = express.Router();

const { getWords } = require("../controllers/openai");

router.route("/topic").post(getWords);

module.exports = router;
