const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 8888;

const users = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "guest", password: "guest" }
];

// Handle JSON responses
app.use(bodyParser.json());

app.post("/login", (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.status(400).send("You need to supply a username and password");
    return;
  }

  const user = users.find(u => {
    return u.username === req.body.username && u.password === req.body.password;
  });

  if (!user) {
    res.status(401).send("Invalid user credentials");
    return;
  }

  // Generate token
  const token = jwt.sign(
    {
      sub: user.id,
      username: user.username
    },
    "supersecretkey",
    { expiresIn: "3 hours" }
  );

  res.status(200).send({ access_token: token });
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
