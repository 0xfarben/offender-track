//jshint esversion6
const express = require('express');
const mysql = require('mysql2');
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const app = express();
const fileUpload = require("express-fileupload")
const port = 10;

app.use(fileUpload());

dotenv.config({
  path : './.env'
})

// MySQL Database Configuration
const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});


const publicDirectory = path.join(__dirname, './public')
app.use(express.static(publicDirectory))

//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON Bodies (as sent by API Clients)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.use('/upload', express.static('upload'));

app.post('crime', (req, res) => {
  console.log("Entered IMAGE UPLOADER")
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // name of the input is sampleFile
  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/upload/' + sampleFile.name;

  console.log(sampleFile);
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});