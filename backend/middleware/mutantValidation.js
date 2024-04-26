const Game = require('../models/Game');
const Model = require('../models/Model');


const areObjectsEqual = (obj1, obj2) => {
    return obj1.master === obj2.master && obj1.dependent === obj2.dependent && obj1.type === obj2.type;
};

// Function to find the common objects between two arrays
const findCommonObjects = (arr1, arr2) => {
    return arr1.filter(obj1 =>
        arr2.some(obj2 => areObjectsEqual(obj1, obj2))
    );
};

const findnewLink = (arr1, arr2) => {
    // Function to check if two dependencies direction are considered equal
    const areLinkEqual = (obj1, obj2) => {
        return obj1.master === obj2.master && obj1.dependent === obj2.dependent;
    };
    return arr1.filter(obj1 =>
        !arr2.some(obj2 => areLinkEqual(obj1, obj2))
    );
};

function hasCircle(arr) {
    const graph = {}; // Represent the graph using an adjacency list
    const visited = {}; // Keep track of visited nodes during DFS
    // Build the graph
    arr.forEach(item => {
        if (!graph[item.master]) {
            graph[item.master] = [];
        }
        graph[item.master].push(item.dependent);
    });

    function hasCircleDFS(node, ancestors) {
        if (visited[node]) {
            return ancestors.includes(node);
        }
        visited[node] = true;
        ancestors.push(node);
        if (graph[node]) {
            for (const neighbor of graph[node]) {
                if (hasCircleDFS(neighbor, ancestors)) {
                    return true;
                }
            }
        }
        ancestors.pop();
        return false;
    }
    // Check for a circle starting from each node
    for (const node in graph) {
        if (!visited[node] && hasCircleDFS(node, [])) {
            return false; // Circle found
        }
    }
    return true; // No circle found
}

async function mutant_validation_check(req, res, next) {
    const mutant = req.body;
    let id = mutant.gameId;
    const MXP = mutant.MXP;
    const game = await Game.findOne({ where: { id } });
    id = game.modelId
    const model = await Model.findOne({ where: { id } });
    const dependencies = model.content.metamodel.dependencies

    // Find common objects between dependencies and newDependencies
    const commonObjects = findCommonObjects(dependencies, MXP.dependencies);
    const newLinks = findnewLink(MXP.dependencies, dependencies);
    const changes = dependencies.length - commonObjects.length + newLinks.length

    if (changes == 0) {
        return res.status(406).json({ message: "The mutant can't be the same as the model." });
    } else if (!hasCircle(MXP.dependencies)) {
        return res.status(406).json({ message: "The graph can't contain circle." });
    }

    next();
}

module.exports = mutant_validation_check;