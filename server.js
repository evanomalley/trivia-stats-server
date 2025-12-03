require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3500;
const corsOptions = require('./server/config/corsOptions');

//DB import
const connectDB = require('./server/config/dbConnection');
const mongoose = require('mongoose');

//middleware imports
const errorHandler = require('./server/middleware/errorHandler');
const {logger, logEvents} = require('./server/middleware/logger');
const cookieParser = require('cookie-parser');
const cors = require('cors');

console.log(process.env.NODE_ENV);

//connect to the db
connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser());

app.use(errorHandler);

app.use('/auth', require('./server/routes/authRoutes.js'));
app.use('/users', require('./server/routes/userRoutes.js'));
app.use('/questions', require('./server/routes/Questions.js'));
app.use('/games', require('./server/routes/GamesRoutes.js'));

mongoose.connection.once('open', () => {
    console.log('Connection to DB successful')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));    
});

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});