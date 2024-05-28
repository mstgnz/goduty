require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const path = require('path');
const connectMongoose = require('./helpers/databaseHelper');
const errorMiddleware = require('./middlewares/errorMiddleware');
const validateMiddleware = require('./middlewares/validateMiddleware');

// Express
const app = express();

// Port
const PORT = process.env.PORT;

// Connect Database
connectMongoose();

// Body Parser
app.use(express.json());

// Api Routes
app.use('/api', validateMiddleware, routes);

// Middleware
app.use(errorMiddleware);

// Static Files
app.use(express.static(path.join(__dirname, "public")))

// Listen
app.listen(PORT, () => {
    console.log(`App start on http://localhost:${PORT}`);
});