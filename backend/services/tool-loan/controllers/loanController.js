const { Loan, Equipment } = require('../db/models');
const { notifyReservationAccepted } = require("../events/publisher");
const { Op } = require('sequelize');

module.exports = {

  async getAll(req, res) {
    try {
      const loans = await Loan.findAll(
        { include: Equipment, order: [['startDate', 'DESC']]});
      res.json(loans);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getPending(req, res) {
    try {
      const loans = await Loan.findAll({
        where: { status: 'pending' },
        include: Equipment,
        order: [['startDate', 'DESC']]
      });
      res.json(loans);
    } catch (error) {
      console.error('Error al obtener préstamos pendientes:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  },

  async getNotPending(req, res) {
    try {
      const loans = await Loan.findAll({
        where: {
          status: { [Op.ne]: 'pending' } // "not equal"
        },
        include: Equipment,
        order: [['startDate', 'DESC']]
      });
      res.json(loans);
    } catch (error) {
      console.error('Error al obtener préstamos no pendientes:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  },

  async getById(req, res) {
    try {
      const loan = await Loan.findByPk(req.params.id, { include: Equipment });
      if (!loan) return res.status(404).json({ error: 'Loan not found' });
      res.json(loan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { equipmentId } = req.body;
      const userId = req.user.id;

      // 1️⃣ Verificar si el equipo existe
      const equipment = await Equipment.findByPk(equipmentId);
      if (!equipment) {
        return res.status(404).json({ error: 'Equipment not found' });
      }

      // 2️⃣ Validar disponibilidad
      if (equipment.quantity < 1 || equipment.status !== 'available') {
        return res.status(400).json({ error: 'Equipment not available for loan' });
      }

      // 3️⃣ Buscar si el usuario ya tiene un préstamo pendiente
      const existingPendingLoan = await Loan.findOne({
        where: {
          userId,
          status: 'pending',
        },
      });

      // 4️⃣ Si tiene uno, eliminarlo antes de crear uno nuevo
      if (existingPendingLoan) {
        await existingPendingLoan.destroy();
        console.log(`Préstamo pendiente anterior del usuario ${userId} eliminado.`);
      }

      // 5️⃣ Crear las fechas del nuevo préstamo
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + 4); // 4 días después

      // 6️⃣ Crear el nuevo préstamo
      const loan = await Loan.create({
        equipmentId,
        userId,
        startDate,
        endDate,
        status: 'pending',
      });

      // 🔹 (Opcional) Actualizar cantidad si deseas restar stock
      // await equipment.update({ quantity: equipment.quantity - 1 });

      res.status(201).json({
        message: 'Nuevo préstamo creado exitosamente',
        loan,
      });
    } catch (error) {
      console.error('Error al crear préstamo:', error);
      res.status(500).json({ error: error.message });
    }
  },


  async update(req, res) {
    try {
      const loan = await Loan.findByPk(req.params.id);
      if (!loan) return res.status(404).json({ error: 'Loan not found' });

      await loan.update(req.body);
      res.json(loan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const loan = await Loan.findByPk(req.params.id);
      if (!loan) return res.status(404).json({ error: 'Loan not found' });

      await loan.destroy();
      res.json({ message: 'Loan deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async accept(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.user.id;

      const loan = await Loan.findByPk(id);
      if (!loan) {
        return res.status(404).json({ error: 'Loan not found' });
      }

      if (loan.status !== 'pending') {
        return res.status(400).json({ error: 'Only pending loans can be accepted' });
      }

      await loan.update({ status: 'loaned' });

      // ws publisher
      await notifyReservationAccepted({
        id,
        status: "accepted",
        userId,
        timestamp: new Date().toISOString()
      });

      res.json({ message: 'Loan accepted successfully', loan });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
