const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8888;

const secret = "supersecretkey";

const users = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "guest", password: "guest" }
];

app.use(bodyParser.json()); // Handle JSON responses
app.use(cors());

const jwtCheck = expressJwt({ secret });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.get("/status", (_req, res) => {
  const localTime = new Date().toLocaleTimeString();

  res.status(200).send(`Server time is ${localTime}.`);
});

app.get("/resource", (_req, res) => {
  res.status(200).send("Public Resource");
});

// Authorisation: Bearer Token - token from /login route.
app.get("/resource/secret", jwtCheck, (_req, res) => {
  res.status(200).send("Private Resource - you are logged in.");
});

// Body: { "username": "admin", "password": "admin" }, JSON type.
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
    secret,
    { expiresIn: "3 hours" }
  );

  res.status(200).send({ access_token: token });
});

app.get("*", (_req, res) => {
  res.sendStatus(404);
});
