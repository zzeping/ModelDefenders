const TestCase = require('../models/TestCase');
const fs = require('fs');

class testCaseController {

    static async createTestCase(req, res) {
        const testCase = req.body;
        try {
            const newTestCase = await TestCase.create(testCase);
            res.status(201).json({ message: "Test case created successfully!", testCase: newTestCase })
        } catch (err) {
            res.status(400).json({ message: err.message })
        }
    }
    static async deleteTestCase(req, res) {
        const id = req.params.id;
        const game = req.params.game
        try {
            const testCase = await TestCase.findOne({
                where: {
                    id: id,
                    gameId: game
                }
            });
            if (!testCase) {
                return res.status(401).json({ error: 'Test case not found.' });;
            }
            await testCase.destroy();
            res.status(200).json({ message: "Test case deleted successfully!" })
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }
    static async getTestCase(req, res) {
        const id = req.params.id;
        try {
            const testCase = await TestCase.findOne({ where: { id } });
            res.status(200).json(testCase);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async getGameTestCases(req, res) {
        const id = req.params.id;
        try {
            const testCases = await TestCase.findAll({
                where: { gameId: id }
            });
            res.status(200).json(testCases);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

    static async getAllTC(req, res) {
        try {
            const tcs = await TestCase.findAll();
            res.status(200).json(tcs);
        } catch (err) {
            res.status(404).json({ message: err.message })
        }
    }

}

module.exports = testCaseController;