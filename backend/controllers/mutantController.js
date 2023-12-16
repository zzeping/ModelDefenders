const Mutant = require('../models/Mutant');
const fs = require('fs');

class mutantController {

    static async createMutant(req, res) {
        const mutant = req.body;
        try {
            const newMutant = await Mutant.create(mutant);
            res.status(201).json({ message: "Mutant created successfully!", mutant: newMutant })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }
    static async deleteMutant(req, res) {
        const id = req.params.id;
        try {
            const mutant = await Mutant.findByPk(id);
            if (!mutant) {
                return res.status(401).json({ error: 'Mutant not found.' });;
            }
            await mutant.destroy();
            res.status(200).json({ message: "Mutant deleted successfully!" })
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }
    static async getMutant(req, res) {
        const id = req.params.id;
        try {
            const mutant = await Mutant.findOne({ where: { id } });
            res.status(200).json(mutant);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async getGameMutants(req, res) {
        const id = req.params.id;
        try {
            const mutants = await Mutant.findAll({
                where: { gameId: id }
            });
            res.status(200).json(mutants);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

}

module.exports = mutantController;