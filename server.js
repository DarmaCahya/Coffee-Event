const express = require('express');
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require('path');
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], 
    httpOnly: true,
  })
);

require('./app/routes/authRoutes')(app);
require('./app/routes/userRoutes')(app);
require('./app/routes/eventRoutes')(app);
require('./app/routes/scoreRoutes')(app);

const db = require("./app/models");
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

// Define a simple route
app.get('/', (req, res) => {
  res.render('Form/form');
});

app.get("/test", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

async function initial() {
  await db.user.create({
    username: "john_doe",
    email: "john@gmail.com",
    password: bcrypt.hashSync("securepassword"),
    role: "admin"
  });

  await db.user.create({
    username: "heho",
    email: "john12@gmail.com",
    password: bcrypt.hashSync("securepassword"),
    role: "jury"
  });
}