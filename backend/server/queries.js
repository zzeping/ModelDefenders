const getModels = "select model.modelName, type.type, difficulty.difficulty from model left join type on model.type_id = type.typeID left join difficulty on model.difficulty_id = difficulty.difficultyID;"

module.exports = {
    getModels,
}