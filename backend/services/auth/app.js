require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const authTestRoutes = require('./routes/authTestRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', authRoutes);
app.use('/auth', authTestRoutes);

module.exports = app;
