// @ts-check
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "static")));
app.use(cookieParser());
app.use(bodyParser());
app.set('views', './views')
app.set('view engine', 'pug')

// "/Users/colemqa/Desktop/scratch-express/home.html"
const homeFilePath = path.join(__dirname, "home.html");

const database = {};

app.get("/", (request, response) => {
  let sessionId = request.cookies && request.cookies["sessionId"];

  if (sessionId != null && database[sessionId]) {
    response.render('home-logged-in', {
      name: database[sessionId]
    })
  }

  // response.type("html").end(`
  //   Please login at <a href="/login">/login</a>
  // `);
  response.render('home-not-logged-in')
});

app.get("/logout", (request, response) => {
  response.clearCookie("sessionId");

  response.redirect('/')
});

const loginFilePath = path.join(__dirname, "login.html");
app.get("/login", (request, response) => {
  response.clearCookie("sessionId");

  response.render('login')
});

app.post("/login", (request, response) => {
  response.clearCookie("sessionId");

  let sessionId = request.cookies && request.cookies["sessionId"];
  if (sessionId == null) {
    sessionId = Math.random().toString(36);
    response.cookie("sessionId", sessionId);
  }

  database[sessionId] = request.body.name;

  response.redirect("/");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("server running");
});
