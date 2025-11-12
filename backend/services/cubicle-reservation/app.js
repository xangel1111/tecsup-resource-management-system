require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cubicleRoutes = require('./routes/cubicleRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();

app.use(cors({ origin: "*"}));

app.use(express.json());

app.use('/cubicles', cubicleRoutes);
app.use('/reservations', reservationRoutes);

module.exports = app;