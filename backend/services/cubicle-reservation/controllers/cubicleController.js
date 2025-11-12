const { Cubicle, Reservation } = require('../db/models');
const { Sequelize } = require('sequelize');

async function getCubicles(req, res) {
  const cubicles = await Cubicle.findAll();
  res.json({ cubicles, user: req.user });
}

async function getAvailableCubicles(req, res) {
  const { startTime, hoursReserved } = req.query;
  const start = new Date(startTime);
  const end = new Date(start.getTime() + hoursReserved * 60 * 60 * 1000);

  const allCubicles = await Cubicle.findAll();
  const busyCubicles = await Reservation.findAll({
    where: {
      status: 'accepted',
      [Sequelize.Op.or]: [
        { startTime: { [Sequelize.Op.between]: [start, end] } },
        { endTime: { [Sequelize.Op.between]: [start, end] } },
        { startTime: { [Sequelize.Op.lte]: start }, endTime: { [Sequelize.Op.gte]: end } }
      ]
    },
    attributes: ['cubicleId']
  });

  const busyIds = busyCubicles.map(r => r.cubicleId);
  const availableCubicles = allCubicles.filter(c => !busyIds.includes(c.id));

  res.json({ availableCubicles });
}

module.exports = { getCubicles, getAvailableCubicles };