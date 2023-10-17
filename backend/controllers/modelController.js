const Model = require('../models/Model');
const User = require('../models/User');
const fs = require('fs');
const parseMXP = require('./mxpParser');

class modelController {

    static async createModel(req, res) {
        const { MXP, image } = req.files;
        const modelData = req.body;
        const parsedMXP = await parseMXP(MXP[0].path);
        console.log(parsedMXP)
        try {
            const newModel = await Model.create({
                MXP: MXP[0].filename,
                image: image[0].filename,
                content: parsedMXP,
                ...modelData,
            });
            res.status(201).json({ message: "Model created successfully!", model: newModel })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }

    static async getUserModels(req, res) {
        const id = req.params.id;
        try {
            const models = await Model.findAll({
                where: { ownerId: id }
            });
            res.status(200).json(models);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async getAdminModels(req, res) {
        try {
            const models = await Model.findAll({
                include: [{
                    model: User,
                    where: { role: 'admin' }
                }],
            });
            res.status(200).json(models);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async getAllModels(req, res) {
        try {
            const models = await Model.findAll();
            res.status(200).json(models);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async fetchModel(req, res) {
        const id = req.params.id;
        try {
            const model = await Model.findOne({ where: { id } });
            res.status(200).json(model);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async deleteModel(req, res) {
        const id = req.params.id;
        try {
            const model = await Model.findByPk(id);
            if (!model) {
                return res.status(401).json({ error: 'Model not found.' });;
            }
            if (model.MXP !== "") {
                try {
                    fs.unlinkSync("./uploads/MXP/" + model.MXP);
                } catch (err) {
                    console.log(err);
                }
            }
            if (model.image !== "") {
                try {
                    fs.unlinkSync("./uploads/image/" + model.image);
                } catch (err) {
                    console.log(err);
                }
            }
            await model.destroy();
            res.status(200).json({ message: "Model deleted successfully!" })
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

}


module.exports = modelController;