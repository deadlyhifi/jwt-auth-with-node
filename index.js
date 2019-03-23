const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8888;

// Handle JSON responses
app.use(bodyParser.json());

app.post("/login", (req, res) => {
  const user = req.body.username;

  res.status(200).send(`You logged in with ${user}.`);
});

app.get("/status", (_req, res) => {
  const localTime = new Date().toLocaleTimeString();

  res.status(200).send(`Server time is ${localTime}.`);
});

app.get("*", (_req, res) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
