const { Reservation, Cubicle } = require('../db/models');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

async function createReservation(req, res) {
  try {
    const { cubicleId, startTime, hoursReserved } = req.body;

    const cubicle = await Cubicle.findByPk(cubicleId);
    if (!cubicle) return res.status(404).json({ error: 'Cubicle not found' });

    if (![1, 2].includes(hoursReserved)) {
      return res.status(400).json({ error: 'Hours reserved must be 1 or 2' });
    }

    const start = new Date(startTime);
    const endTime = new Date(start.getTime() + hoursReserved * 60 * 60 * 1000);

    const conflictingReservation = await Reservation.findOne({
      where: {
        cubicleId,
        status: 'accepted',
        [Sequelize.Op.and]: [
          { startTime: { [Sequelize.Op.lt]: endTime } },
          { endTime: { [Sequelize.Op.gt]: start } }
        ]
      }
    });

    if (conflictingReservation) {
      return res.status(409).json({ error: 'Cubicle already reserved for this time range' });
    }

    const reservation = await Reservation.create({
      userId: req.user.id,
      cubicleId,
      startTime: start,
      endTime,
      status: 'pending'
    });

    res.json({ reservation });
  } catch(e) {
    console.log(e);
  }
}

async function deleteReservation(req, res) {
  const { reservationId } = req.body;

  const reservation = await Reservation.findByPk(reservationId);

  if (!reservation) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  /*
  if (reservation.userId !== req.user.id) {
    return res.status(403).json({ error: 'You are not allowed to delete this reservation' });
  }
  */

  await reservation.destroy();

  res.json({ message: 'Reservation deleted successfully' });
}

async function getUserReservations(req, res) {
  const reservations = await Reservation.findAll({
    where: { userId: req.user.id },
    include: [{ model: Cubicle }],
    order: [['createdAt', 'DESC']]
  });
  res.json({ reservations });
}

async function getCubicleReservations(req, res) {
  const { cubicleId } = req.params;
  const reservations = await Reservation.findAll({
    where: { cubicleId }
  });
  res.json({ reservations });
}

async function getReservationById(req, res) {
  const { reservationId } = req.params;
  const reservation = await Reservation.findByPk(reservationId, { include: [Cubicle] });
  if (!reservation) return res.status(404).json({ error: 'Reservation not found' });
  res.json({ reservation });
}

async function acceptReservation(req, res) {
  const { reservationId } = req.params;

  try {
    const reservation = await Reservation.findByPk(reservationId, { include: [Cubicle] });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    reservation.status = 'accepted';
    await reservation.save();

    res.json({ message: 'Reservation accepted successfully', reservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: 'Error updating reservation status' });
  }
}

async function updateReservation(req, res) {
  const { reservationId } = req.params;
  const { startTime, hoursReserved } = req.body;

  const reservation = await Reservation.findByPk(reservationId);
  if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

  if (reservation.userId !== req.user.id) {
    return res.status(403).json({ error: 'You are not allowed to update this reservation' });
  }

  if (![1, 2].includes(hoursReserved)) {
    return res.status(400).json({ error: 'Hours reserved must be 1 or 2' });
  }

  const start = new Date(startTime);
  const endTime = new Date(start.getTime() + hoursReserved * 60 * 60 * 1000);

  const conflict = await Reservation.findOne({
    where: {
      cubicleId: reservation.cubicleId,
      id: { [Sequelize.Op.ne]: reservation.id },
      status: 'accepted',
      [Sequelize.Op.or]: [
        { startTime: { [Sequelize.Op.between]: [start, endTime] } },
        { endTime: { [Sequelize.Op.between]: [start, endTime] } },
        { startTime: { [Sequelize.Op.lte]: start }, endTime: { [Sequelize.Op.gte]: endTime } }
      ]
    }
  });

  if (conflict) return res.status(409).json({ error: 'Time slot conflicts with another reservation' });

  reservation.startTime = start;
  reservation.endTime = endTime;
  await reservation.save();

  res.json({ reservation });
}

async function getAllReservations(req, res) {
  try {
    const reservations = await Reservation.findAll({
      include: [
        { model: Cubicle, attributes: ['id', 'name', 'location'] }
      ],
      order: [['startTime', 'ASC']]
    });

    res.json({ reservations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getPending(req, res) {
  try {
    const loans = await Reservation.findAll({
      where: { status: 'pending' },
      include: Cubicle,
      order: [['startTime', 'DESC']]
    });
    res.json(loans);
  } catch (error) {
    console.error('Error al obtener préstamos pendientes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

async function getNotPending(req, res) {
  try {
    const loans = await Reservation.findAll({
      where: {
        status: { [Op.ne]: 'pending' } // "not equal"
      },
      include: Cubicle,
      order: [['startTime', 'DESC']]
    });
    res.json(loans);
  } catch (error) {
    console.error('Error al obtener préstamos no pendientes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

module.exports = { createReservation , deleteReservation, getUserReservations, getCubicleReservations, getReservationById, updateReservation, getAllReservations, getPending, getNotPending, acceptReservation};