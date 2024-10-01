const Game = require('../models/Game');
const Model = require('../models/Model');

async function test_validation_check(req, res, next) {
    const testCase = req.body;
    const events = testCase.events;
    let id = testCase.gameId
    const game = await Game.findOne({ where: { id } });
    id = game.modelId
    const model = await Model.findOne({ where: { id } });
    const dependencyTypes = model.content.metamodel.dependencies // get all the dependencies of the model

    let objects = [];
    let existDependencies = []; // the current dependencies that changes accroding to the event. 
    let fail_flag = 0;
    let mandatory_dependency = {};

    try {
        events && events.forEach((event) => {
            fail_flag = 0;

            // check mandatory
            if (Object.keys(mandatory_dependency).length !== 0) {
                if (event.eventType !== "CREATE" || event.objTypeName !== mandatory_dependency.dependency?.name.dependent) fail_flag = 1;;
                if (!event.relatedTo.find(obj => obj[Object.keys(obj)[0]] === mandatory_dependency.master)) fail_flag = 1;;
                mandatory_dependency = {};
            }

            if (event.eventType === "CREATE") {
                // find all the dependencies of the object that the event created needs a master.
                const dependencies = dependencyTypes.filter((dependency) => dependency.dependent === event.objType)
                if (dependencies.length !== 0) {
                    // if the created object is related to unexist objects -> error
                    const objsexist = event.relatedTo.every(relatedObj => {
                        const masterType = Object.keys(relatedObj)[0];

                        let dep_ = dependencies.find(dep => dep.name.dependent === masterType && dependencyTypes.filter(dep__ => dep__.master === dep.master && dep__.dependent === dep.dependent).length > 1);
                        if (dep_) {
                            // for the case of multiple masters
                            return objects.some(obj => obj.type === dep_.name.master && obj.name === relatedObj[masterType]);
                        } else {
                            return objects.some(obj => obj.type === masterType && obj.name === relatedObj[masterType]);
                        }
                    });
                    if (!objsexist) throw new Error('Invalid test case.1');

                    dependencies.forEach(dependency => {

                        let check_multi = dependencies.filter(dep => dep.master === dependency.master && dep.dependent === dependency.dependent).length;

                        if (check_multi > 1) {
                            // the case with multiple masters
                            // check if all the dependencies has the corresponding masters. 
                            const master2 = event.relatedTo.find(obj => {
                                const [key] = Object.keys(obj);
                                return key === dependency.name.dependent;
                            });
                            console.log(master2)
                            console.log(existDependencies)
                            if (!master2) fail_flag = 1;
                            // check if the event is creating another dependent of the master but the dependency is one-to-one 
                            else if (dependency.type === "OPTIONAL_1" || dependency.type === "MANDATORY_1") {
                                // check if the master of the object for this dependency already has other dependent
                                const hasTheDependent = existDependencies.some((dep) =>
                                    dep.masterType === Object.keys(master2)[0] && dep.master === master2[Object.keys(master2)[0]] && dep.dependentType === dependency.name.dependent)
                                if (hasTheDependent) fail_flag = 1; // problem here!! why??
                            }
                        } else {
                            // check if all the dependencies has the corresponding masters. 
                            const master = event.relatedTo.find(obj => {
                                const [key] = Object.keys(obj);
                                return key === dependency.name.master;
                            });
                            if (!master) fail_flag = 1;

                            // check if the event is creating another dependent of the master but the dependency is one-to-one 
                            else if (dependency.type === "OPTIONAL_1" || dependency.type === "MANDATORY_1") {
                                // check if the master of the object for this dependency already has other dependent
                                const hasTheDependent = existDependencies.some((dep) =>
                                    dep.masterType === Object.keys(master)[0] && dep.master === master[Object.keys(master)[0]] && dep.dependentType === dependency.name.dependent)
                                if (hasTheDependent) fail_flag = 1;
                            }
                        }
                    })
                }

                // store mandatory 
                let manDep = {}
                if (manDep = dependencyTypes.find((dep) => (dep.type === "MANDATORY_1" || dep.type === "MANDATORY_N") && dep.master === event.objType)) {
                    mandatory_dependency = {
                        dependency: manDep,
                        master: event.objName,
                    }
                }

                if (event.outCome === "Success" && fail_flag === 1) throw new Error('Invalid test case.2');
                if (event.outCome === "Fail" && fail_flag === 0) throw new Error('Invalid test case.3');

                let object = {
                    name: event.objName,
                    type: event.objTypeName,
                }
                objects.push(object)

                // console.log(event.relatedTo)
                event.relatedTo.forEach(obj => {
                    for (const key in obj) {
                        const newDependency = {
                            master: obj[key],
                            dependent: event.objName,
                            masterType: key,
                            dependentType: event.objTypeName,
                        }
                        existDependencies.push(newDependency)
                    }
                })
            }
            if (event.eventType === "END") {
                // find the events that ending an object that has existing dependents 
                // find all the dependencies that the object that the mutant end might have a dependent.
                const dependencies = existDependencies.filter((dependency) => dependency.master === event.objName && dependency.masterType === event.objTypeName)
                if (dependencies.length !== 0) {
                    // check if all its dependents don't exist. 
                    dependencies.forEach(dependency => {
                        const dependentexist = objects.some(obj => obj.name === dependency.dependent && obj.type === dependency.dependentType)
                        if (dependentexist) fail_flag = 1;
                    })
                }

                if (event.outCome === "Success" && fail_flag === 1) throw new Error('Invalid test case.4');
                if (event.outCome === "Fail" && fail_flag === 0) throw new Error('Invalid test case.5');

                const indexOfobj = objects.findIndex(obj => obj.name === event.objName && obj.type === event.objTypeName);
                if (indexOfobj !== -1) {
                    objects.splice(indexOfobj, 1);
                }
            }

        })
        if (Object.keys(mandatory_dependency).length !== 0) throw new Error('Invalid test case.6');
    } catch (error) {
        return res.status(406).json({ message: `${error.message}` });
    }


    next();


}




module.exports = test_validation_check;