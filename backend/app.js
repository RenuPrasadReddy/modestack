const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const userRoute = require('./src/routes/userRoute');
const articleRoute = require('./src/routes/articleRoute') 


const app = express();
app.use(express.json())
dotenv.config();

app.listen(process.env.PORT, ()=> console.log("server listening to port ", process.env.PORT));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
mongoose.connection.on('connected', ()=> console.log('connected to atlas db'));


app.use('/user', userRoute);
app.use('/', articleRoute);
