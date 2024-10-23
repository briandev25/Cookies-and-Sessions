const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const mockUsers = [
  { username: "Bryan", password: "kamau123" },
  { username: "jira", password: "12345678" },
];

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "Brian the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.send("welcome");
});

app.get("/cookie", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.sessionStore.get(req.sessionID, (err, sessionData) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(sessionData);
  });
  res.send("welcome cooks");
});
app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;

  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser) return res.status(401).send({ msg: "User doesnt exist" });
  if (findUser.password !== password)
    return res.status(401).send({ msg: "Bad credentials" });
  req.session.user = findUser;
  return res.status(201).send(findUser);
});
app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, sessionData) => {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log(sessionData);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "User not authenticated" });
});
