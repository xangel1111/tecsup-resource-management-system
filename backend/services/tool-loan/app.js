require('dotenv').config();
const express = require('express');
const equipmentRoutes = require('./routes/equipmentRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
app.use(express.json());

app.use('/equipments', equipmentRoutes);
app.use('/loans', loanRoutes);

app.use((req, res, next) => {
  console.log(`[Loan Service] ${req.method} ${req.originalUrl}`);
  next();
});

module.exports = app;