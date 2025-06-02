const connect=require('./connect')
const users = require('./usersRoutes')
const performance = require("./performanceRoutes")
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express()
const PORT = 3000

app.use(cors());
app.use(express.json());
app.use(users);
app.use(performance)

app.listen(PORT,()=>{
    connect.connectToServer()
    console.log('server running')
})