const express = require('express');
// const mongoose = require('mongoose')
const cors = require('cors');
const env = require('dotenv').config({ path: '.env' });

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req,res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('listening...');
});

// mongoose.connect('mongodb://localhost:27017');
// mongoose.connection.once('open', () => {
//   console.log('connected to mongod...');
// });
