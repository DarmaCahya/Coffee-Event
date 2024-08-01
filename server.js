const express = require('express');
const cors = require("cors");
const cookieSession = require("cookie-session");
const path = require('path');
const bcrypt = require("bcryptjs");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

require('dotenv').config();

const app = express();
app.use(methodOverride('_method'));
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
require('./app/routes/adminRoutes')(app);

const db = require("./app/models");
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

// Define a simple route
app.get('/', (req, res) => {
  res.status(404).send({message: "welcome coffee competition"});
});

app.use((req, res, next) => {
  res.status(404).redirect('/notfound');
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const calculateEspressoTotal = (flushHead, dryFilter, spill, dosing, cleanPort, brew, extractTime) => {
  return (
      (flushHead ? 1 : 0) +
      (dryFilter ? 1 : 0) +
      (spill ? 1 : 0) +
      (dosing ? 1 : 0) +
      (cleanPort ? 1 : 0) +
      (brew ? 1 : 0) +
      (extractTime ? 4 : 0)
  );
};

const calculateMilkTotal = (cleanPitcher, purgeBefore, cleanWand, purgeAfter, pitcherWasteEnd) => {
  return (
      (cleanPitcher ? 1 : 0) +
      (purgeBefore ? 1 : 0) +
      (cleanWand ? 1 : 0) +
      (purgeAfter ? 1 : 0) +
      (pitcherWasteEnd ? 1 : 0)
  );
};

const calculateHygieneTotal = (cleanWand) => {
  return cleanWand * 2;
};

const calculatePerformanceTotal = (orgWorkspace, overall) => {
  return (orgWorkspace ? orgWorkspace : 0) + (overall ? overall * 6 : 0);
};

// Calculating Totals
const espresso_total1 = calculateEspressoTotal(true, true, true, true, true, true, true);
const espresso_total2 = calculateEspressoTotal(true, true, true, true, true, true, true);
const espresso_total_dsgn = calculateEspressoTotal(true, true, true, true, true, true, true);

const milk_total1 = calculateMilkTotal(true, true, true, true, true);
const milk_total2 = calculateMilkTotal(true, true, true, true, true);
const milk_total_dsgn = calculateMilkTotal(true, true, true, true, true);

const hygiene_total = calculateHygieneTotal(6);
const performance_total = calculatePerformanceTotal(6, 6);

const total_score = espresso_total1 + espresso_total2 + espresso_total_dsgn + milk_total1 + milk_total2 + milk_total_dsgn + hygiene_total + performance_total;

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

  await db.event.create({
    image: "image",
    title: "Coffee Brewing Championship",
    description: "A championship to find the best coffee brewer.",
    tag: "Brewing",
    startDate: new Date(),
    endDate: new Date(),
    pin: "1234"
  });

  await db.score.create({
    eventId: 1,
    userId: 1, 
    representing: "joko",
    competitor: "rumah",
    judge: "alex",
    espresso_flush_head1: true,
    espresso_flush_head2: true,
    espresso_flush_head_dsgn: true,
    espresso_dry_filter1: true,
    espresso_dry_filter2: true,
    espresso_dry_filter_dsgn: true,
    espresso_spill1: true,
    espresso_spill2: true,
    espresso_spill_dsgn: true,
    espresso_dosing1: true,
    espresso_dosing2: true,
    espresso_dosing_dsgn: true,
    espresso_clean_port1: true,
    espresso_clean_port2: true,
    espresso_clean_port_dsgn: true,
    espresso_brew1: true,
    espresso_brew2: true,
    espresso_brew_dsgn: true,
    espresso_extract_time1: true,
    espresso_extract_time2: true,
    espresso_extract_time_dsgn: true,
    milk_clean_pitcher1: true,
    milk_clean_pitcher2: true,
    milk_clean_pitcher_dsgn: true,
    milk_purge_wand_before1: true,
    milk_purge_wand_before2: true,
    milk_purge_wand_before_dsgn: true,
    milk_clean_wand1: true,
    milk_clean_wand2: true,
    milk_clean_wand_dsgn: true,
    milk_purge_wand_after1: true,
    milk_purge_wand_after2: true,
    milk_purge_wand_after_dsgn: true,
    milk_pitcher_waste_end1: true,
    milk_pitcher_waste_end2: true,
    milk_pitcher_waste_end_dsgn: true,
    hygiene_clean_wand: 6,
    performance_org_workspace: 6,
    performance_overall: 6,
    espresso_total1,
    espresso_total2,
    espresso_total_dsgn,
    milk_total1,
    milk_total2,
    milk_total_dsgn,
    hygiene_total,
    performance_total,
    total_score
});
}