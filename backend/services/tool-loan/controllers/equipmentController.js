const { Equipment } = require('../db/models');

module.exports = {

  async getAll(req, res) {
    try {
      const equipments = await Equipment.findAll();
      res.json(equipments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const equipment = await Equipment.findByPk(req.params.id);
      if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const equipment = await Equipment.create(req.body);
      res.status(201).json(equipment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const equipment = await Equipment.findByPk(req.params.id);
      if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

      await equipment.update(req.body);
      res.json(equipment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const equipment = await Equipment.findByPk(req.params.id);
      if (!equipment) return res.status(404).json({ error: 'Equipment not found' });

      await equipment.destroy();
      res.json({ message: 'Equipment deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllForOpenAI(req, res) {
    try {
      const equipments = await Equipment.findAll({
        attributes: ['name', 'description', 'quantity', 'status']
      });
      res.json(equipments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
