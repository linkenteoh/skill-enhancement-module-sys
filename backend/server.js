const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
const errorHandler = require('./middleware/error');


const exercisesRouter = require('./routes/exercises');
const usersRouter = require('./routes/users');
const announcementRouter = require('./routes/announcement');
const coursesRouter = require('./routes/courses');
const papersRouter = require('./routes/papers');
const classRouter = require('./routes/classes');
const registrationRouter = require('./routes/registrations');
const resultRouter = require('./routes/results');
const authRouter = require('./routes/auth');
const settingsRouter = require('./routes/userSettings');
const privateRouter = require('./routes/private');


require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})


app.use(cors({origin: true}));
app.use(bodyParser.urlencoded({ extended: false })) //Can be removed
app.use(bodyParser.json())

// Connecting Routes
app.use('/exercises', exercisesRouter);
app.use('/users', usersRouter);
app.use('/userSettings', settingsRouter);
app.use('/announcement', announcementRouter);
app.use('/courses', coursesRouter);
app.use('/papers', papersRouter);
app.use('/classes', classRouter);
app.use('/registrations', registrationRouter);
app.use('/results', resultRouter);
app.use('/api/auth', authRouter);
app.use('/api/private', privateRouter);


app.use(express.json());

// Error Handler (Last Piece of Middleware)
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
})