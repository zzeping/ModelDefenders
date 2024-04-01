const Mutant = require('../models/Mutant');

async function tsKillMutants(req, res, next) {
    const testCase = req.body;
    const events = testCase.events;
    const id = testCase.gameId
    const mutants = await Mutant.findAll({ where: { gameId: id } });

    let objects = [];
    var fail_flag = 0;
    var kill = 0;
    let mandatory_dependency = {};


    for (const mutant of mutants) {
        objects = [];

        for (const event of events) {
            fail_flag = 0;

            // check mandatory
            if (Object.keys(mandatory_dependency).length !== 0) {
                if (event.eventType !== "CREATE" || event.objTypeName !== mandatory_dependency.dependency?.name.dependent) { fail_flag = 1; console.log("1") }
                if (!event.relatedTo.find(obj => obj[Object.keys(obj)[0]] === mandatory_dependency.master)) { fail_flag = 1; console.log("2") }
                mandatory_dependency = {};
            }

            if (event.eventType === "CREATE") {
                // find all the dependencies that the object that the mutant created needs a master.
                let dependencies = mutant.MXP.dependencies.filter((dependency) => dependency.dependent === event.objType)
                if (dependencies.length !== 0) {
                    // check if all the dependencies has the corresponding masters. 
                    dependencies.forEach(dependency => {
                        let masterCreateEvents = events.some((e) => {
                            e.eventType === "CREATE" && e.objType === dependency.master && event.relatedTo[e.objTypeName] === e.objName && objects.some(obj => obj.name === e.objTypeName && obj.type === e.objType);
                        })
                        if (!masterCreateEvents) { fail_flag = 1; console.log("3")}
                        // kill the case that creating another dependent of the master but the dependency is one-to-one 
                        else if (dependency.type === "OPTIONAL_1" || dependency.type === "MANDATORY_1") {
                            // check if the masters of the object for this dependency already has other dependent
                            let dependentCreateEvents = events.some((e) => {
                                e.eventType === "CREATE" && e.objType === dependency.dependent && e.relatedTo[event.objTypeName] === event.objName && objects.some(obj => obj.name === e.objTypeName && obj.type === e.objType);
                            })
                            if (dependentCreateEvents) { fail_flag = 1; console.log("4") }
                        }
                    })
                }
                // store mandatory 
                let manDep = {}
                if (manDep = mutant.MXP.dependencies.find((dep) => (dep.type === "MANDATORY_1" || dep.type === "MANDATORY_N") && dep.master === event.objType)) {
                    mandatory_dependency = {
                        dependency: manDep,
                        master: event.objName,
                    }
                }

                let object = {
                    name: event.objName,
                    type: event.objType,
                }
                if (!objects.some(obj => obj.name === object.name)) objects.push(object)
            }
            if (event.eventType === "END") {
                // kill the case that ending an object that has exsiting dependents 
                // find all the dependencies that the object that the mutant end might have a dependent.
                let dependencies = mutant.MXP.dependencies.filter((dependency) => dependency.master === event.objType)
                if (dependencies.length !== 0) {
                    // check if all the dependencies doesn't have the corresponding dependents. 
                    dependencies.forEach(dependency => {
                        let dependentCreateEvents = events.some((e) => {
                            e.eventType === "CREATE" && e.objType === dependency.dependent && e.relatedTo[event.objTypeName] === event.objName && objects.some(obj => obj.name === e.objTypeName && obj.type === e.objType);
                        })
                        if (dependentCreateEvents) { fail_flag = 1; console.log("5") }
                    })
                }
                let index = objects.findIndex(obj => obj.name === event.objName && obj.type === event.objType);
                if (index !== -1) {
                    objects.splice(index, 1);
                }

            }
            if (fail_flag === 1 && event.outCome === "Success") { kill = 1;console.log("6")}
            if (fail_flag === 0 && event.outCome === "Fail")  { kill = 1;console.log("7")}

        }

        if (kill === 1) {
            let m = await Mutant.findByPk(mutant.id);
            m.state = 'dead';
            await m.save();
            kill = 0;
        }

    }

    next();
}

module.exports = tsKillMutants;