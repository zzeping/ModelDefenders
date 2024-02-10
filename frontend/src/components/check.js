
function hasCorrespondingMaster(dependency, dependency_tests, objects, event) {
    return dependency_tests.find(dependency_test => {
        return dependency.master === dependency_test.dependencyType.master &&
            event.objType === dependency_test.dependencyType.dependent &&
            event.objName === dependency_test.dependent &&
            objects.some(obj => obj.name === dependency_test.master && obj.type === dependency_test.dependencyType.master);
    });
}

function hasCorrespondingDependent(dependency, dependency_tests, objects, event) {
    return dependency_tests.some(dependency_test => {
        return dependency.dependent === dependency_test.dependencyType.dependent &&
            event.objType === dependency_test.dependencyType.master &&
            event.objName === dependency_test.master &&
            objects.some(obj => obj.name === dependency_test.dependent && obj.type === dependency_test.dependencyType.dependent);
    });
}
function hasTheDependent(dependency, dependency_tests, objects, master) {
    return dependency_tests.some(dependency_test => {
        return dependency.dependent === dependency_test.dependencyType.dependent &&
            dependency.master === dependency_test.dependencyType.master &&
            master === dependency_test.master &&
            objects.some(obj => obj.name === dependency_test.dependent && obj.type === dependency_test.dependencyType.dependent);
    });
}

function check(mutants, events, expected, dependencies_test, objects_test) {

    let objects = [];
    let out = "Success";
    const mutants_new = [];

    mutants.forEach((mutant) => {
        out = "Success";
        objects = [];
        events.forEach((event) => {

            if (event.eventType === "CREATE") {
                // find all the dependencies that the object that the mutant created needs a master.
                let dependencies = mutant.MXP.dependencies.filter((dependency) => dependency.dependent === event.objType)
                if (dependencies.length !== 0) {
                    // check if all the dependencies has the corresponding masters. 
                    dependencies.forEach(dependency => {
                        let dependency_tests_result = hasCorrespondingMaster(dependency, dependencies_test, objects, event)
                        // kill the case that the created object actually need a master
                        if (!dependency_tests_result) { out = "Fail"; }
                        // kill the case that creating another dependent of the master but the dependency is one-to-one 
                        else if (dependency.type === "OPTIONAL_1" || dependency.type === "MANDATORY_1") {
                            // check if the master of the object for this dependency already has other dependent
                            let r = hasTheDependent(dependency, dependencies_test, objects, dependency_tests_result.master)
                            if (r) { out = "Fail"; }
                        }

                    })
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
                        let result = hasCorrespondingDependent(dependency, dependencies_test, objects, event)
                        if (result) out = "Fail";
                    })
                }

                let index = objects.findIndex(obj => obj.name === event.objName && obj.type === event.objType);
                if (index !== -1) {
                    objects.splice(index, 1);
                }

            }
        })

        // kill the case that having a mandatory master without having a corresponding dependent
        objects_test.forEach((obj) => {
            if (mutant.MXP.dependencies.some((dep) => dep.master === obj.objType && (dep.type === "MANDATORY_1" || dep.type === "MANDATORY_N") && !dependencies_test.some((existdep) => existdep.dependencyType.master === dep.master && existdep.dependencyType.dependent === dep.dependent && existdep.master === obj.objName))) {
                out = "Fail";
            }
        })

        // check if the test case kill the mutant
        if (out !== expected) {
            const mutant_new = {
                ...mutant,
                state: 'dead'
            };
            mutants_new.push(mutant_new)
        } else {
            mutants_new.push(mutant)
        }
    })



    return mutants_new;
}


module.exports = check;