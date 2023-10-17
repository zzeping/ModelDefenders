const fs = require('fs');
const constants = require('./constants');
const xml2js = require('xml2js');
const luxon = require('luxon');
const { v4: uuidv4 } = require('uuid')
const semver = require('semver');


/**
 * Parse an XML string
 *
 * This uses xml2js to convert the XML in to a JSON that represent it:
 * https://github.com/Leonidas-from-XIV/node-xml2js
 *
 * @param data An XML string
 *
 * @return A Promise that resolves with the parse result. This is a JSON object representing the XML tree.
 */
function parse(data) {
    return new Promise((resolve, reject) => {
        let parser = new xml2js.Parser();
        parser.parseString(data, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
/**
 * Convert a JMermaid timestamp to ISO 8601
 *
 * (see https://github.com/moment/luxon for details on luxon)
 */
function convertTimestamp(timestamp) {
    return luxon.DateTime.fromMillis(parseInt(timestamp)).toUTC().toISO();
}

/**
 * Convert a JSON representation of a JMermaid metaobject to a Merlin object type.
 */
function convertObjectType(state, objecttype) {
    let OT = constants.MXP.METAMODEL.OBJECTTYPES.OBJECTTYPE;
    let attrs = objecttype['$'];
    return {
        id: state.idConvertor(attrs[OT.ID_ATTR]),
        name: attrs[OT.NAME_ATTR],
        abstract: attrs[OT.ABSTRACT_ATTR] === 'true',
        description: objecttype[OT.DESCRIPTION.TAG][0],
        constraints: objecttype[OT.CONSTRAINTS.TAG][0],
        attributes: extractXMLChildren(
            objecttype,
            OT.ATTRIBUTES.TAG,
            OT.ATTRIBUTES.ATTRIBUTE.TAG
        ).map((a) => convertAttribute(state, a)),
        fsms: extractXMLChildren(objecttype, OT.FSMS.TAG, OT.FSMS.FSM.TAG).map((f) =>
            convertFSM(state, f)
        ),
        multiplePropagationConstraints: extractXMLChildren(
            objecttype,
            OT.MULTIPLEPROPAGATIONCONSTRAINTS.TAG,
            OT.MULTIPLEPROPAGATIONCONSTRAINTS.MULTIPLEPROPAGATIONCONSTRAINT.TAG
        ).map((mpc) => convertMultiplePropagationConstraint(state, mpc)),
    };
}

/**
 * Convert a JSON representation of a JMermaid metaevent to a Merlin event type.
 */
function convertEventType(state, eventtype, ET = constants.MXP.METAMODEL.EVENTTYPES.EVENTTYPE) {
    let attrs = eventtype['$'];
    return {
        id: state.idConvertor(attrs[ET.ID_ATTR]),
        name: attrs[ET.NAME_ATTR],
        description: eventtype[ET.DESCRIPTION.TAG][0],
        attributes: extractXMLChildren(
            eventtype,
            ET.ATTRIBUTES.TAG,
            ET.ATTRIBUTES.ATTRIBUTE.TAG
        ).map((a) => convertAttribute(state, a)),
    };
}

/**
 * Convert a JSON representation of a JMermaid specialised event to a Merlin event type.
 */
function convertSpecialisedEventType(state, eventtype) {
    const SET = constants.MXP.METAMODEL.SPECIALISEDEVENTTYPES.EVENTTYPE;
    const result = convertEventType(state, eventtype, SET);
    const attrs = eventtype['$'];
    result.ownerEventType = state.idConvertor(attrs[SET.OWNER_EVENT_ID_ATTR]);
    result.inheritance = state.idConvertor(attrs[SET.INHERITANCE_ID_ATTR]);
    return result;
}

/**
 * Convert a JSON representation of a JMermaid metadependency to a Merlin dependency.
 */
function convertDependency(state, dependency) {
    let DEP = constants.MXP.METAMODEL.DEPENDENCIES.DEPENDENCY;
    let attrs = dependency['$'];
    const id = state.idConvertor(attrs[DEP.ID_ATTR]);
    const master = state.idConvertor(attrs[DEP.MASTER_ATTR]);
    const dependent = state.idConvertor(attrs[DEP.DEPENDENT_ATTR]);
    state.addDependencyObjects(id, master, dependent);
    let name;
    if (state.atLeastVersion('1.7')) {
        name = {
            master: attrs[DEP.MASTER_ROLE_ATTR],
            dependent: attrs[DEP.DEPENDENT_ROLE_ATTR],
        };
    } else {
        name = {
            master: attrs[DEP.NAME_ATTR],
            dependent: attrs[DEP.NAME_ATTR],
        };
    }
    return {
        id,
        name,
        type: attrs[DEP.TYPE_ATTR],
        master,
        dependent,
    };
}

/**
 * Convert a JSON representation of a JMermaid metamethod to a Merlin method.
 */
function convertMethod(state, method) {
    let M = constants.MXP.METAMODEL.METHODS.METHOD;
    let attrs = method['$'];
    let result = {
        id: state.idConvertor(attrs[M.ID_ATTR]),
        name: attrs[M.NAME_ATTR],
        provenance: attrs[M.PROVENANCE_ATTR],
        type: attrs[M.TYPE_ATTR],
        ownerObjectType: state.idConvertor(attrs[M.OWNER_OBJECT_ID_ATTR]),
        ownerEventType: state.idConvertor(attrs[M.OWNER_EVENT_ID_ATTR]),
        precondition: method[M.PRECONDITION.TAG][0],
        postcondition: method[M.POSTCONDITION.TAG][0],
        implementation: method[M.IMPLEMENTATION.TAG][0],
        attributes: extractXMLChildren(method, M.ATTRIBUTES.TAG, M.ATTRIBUTES.ATTRIBUTE.TAG).map((a) =>
            convertAttribute(state, a)
        ),
    };
    if (attrs[M.VIA_METHOD_ATTR]) {
        result.viaMethod = state.idConvertor(attrs[M.VIA_METHOD_ATTR]);
    }
    if (attrs[M.VIA_DEPENDENCY_ATTR]) {
        result.viaDependency = state.idConvertor(attrs[M.VIA_DEPENDENCY_ATTR]);
    }
    if (attrs[M.VIA_INHERITANCE_ATTR]) {
        result.viaInheritance = state.idConvertor(attrs[M.VIA_INHERITANCE_ATTR]);
    }
    return result;
}

/**
 * Convert a JSON representation of a JMermaid inheritance to a Merlin datatype
 */
function convertInheritance(state, inheritance) {
    let I = constants.MXP.METAMODEL.INHERITANCES.INHERITANCE;
    let attrs = inheritance['$'];
    const id = state.idConvertor(attrs[I.ID_ATTR]);
    const supertype = state.idConvertor(attrs[I.SUPERTYPE_ID_ATTR]);
    const subtype = state.idConvertor(attrs[I.SUBTYPE_ID_ATTR]);
    state.addInheritanceObjects(id, supertype, subtype);
    return {
        id,
        supertype,
        subtype,
    };
}

/**
 * Convert a JSON representation of a JMermaid datatype to a Merlin datatype.
 */
function convertDataType(state, datatype) {
    let DT = constants.MXP.METAMODEL.DATATYPES.DATATYPE;
    let attrs = datatype['$'];
    return {
        id: state.idConvertor(attrs[DT.ID_ATTR]),
        name: attrs[DT.NAME_ATTR],
    };
}

/**
 * Convert a JSON representation of a JMermaid attribute to a Merlin attribute
 */
function convertAttribute(state, attribute) {
    let A = constants.MXP.METAMODEL.ATTRIBUTES.ATTRIBUTE;
    let attrs = attribute['$'];
    let result = {
        id: state.idConvertor(attrs[A.ID_ATTR]),
        name: attrs[A.NAME_ATTR],
        type: attrs[A.TYPE_ATTR],
        description: attribute[A.DESCRIPTION.TAG][0],
        implementation: attribute[A.IMPLEMENTATION.TAG][0],
        validation: attribute[A.VALIDATION.TAG][0],
    };
    if (attrs[A.TYPE_ID_ATTR] != null && attrs[A.TYPE_ID_ATTR] !== '-1') {
        result.type = state.idConvertor(attrs[A.TYPE_ID_ATTR]);
    }
    return result;
}

/**
 * Convert a JSON representation of a JMermaid state to a Merlin state.
 */
function convertState(conversionState, state, fsm) {
    let STATE = constants.MXP.METAMODEL.OBJECTTYPES.OBJECTTYPE.FSMS.FSM.STATES.STATE;
    let attrs = state['$'];
    let id = conversionState.idConvertor(attrs[STATE.ID_ATTR]);
    conversionState.addState(fsm, id);
    let result = {
        id,
        name: attrs[STATE.NAME_ATTR],
        type: attrs[STATE.TYPE_ATTR],
    };
    return result;
}

/**
 * Convert a JSON representation of a JMermaid transition method to a Merlin
 * transition method.
 */
function convertTransitionMethod(state, method, fsm) {
    let FSM = constants.MXP.METAMODEL.OBJECTTYPES.OBJECTTYPE.FSMS.FSM;
    let METHOD = FSM.TRANSITIONS.TRANSITION.TRANSITIONMETHODS.TRANSITIONMETHOD;
    let attrs = method['$'];
    let result = {
        method: state.idConvertor(attrs[METHOD.METHODID_ATTR]),
    };
    if (attrs[METHOD.SAFEID_ATTR] != null) {
        result.id = state.idConvertor(attrs[METHOD.SAFEID_ATTR]);
    } else {
        result.id = uuidv4();
    }
    if (attrs[METHOD.METHODNAME_ATTR] != null) {
        result.methodName = attrs[METHOD.METHODNAME_ATTR];
    }
    return result;
}

/**
 * Convert a JSON representation of a JMermaid transition to a Merlin
 * transition.
 */
function convertTransition(state, transition, fsm) {
    const FSM = constants.MXP.METAMODEL.OBJECTTYPES.OBJECTTYPE.FSMS.FSM;
    const T = FSM.TRANSITIONS.TRANSITION;
    const attrs = transition['$'];
    const id = state.idConvertor(attrs[T.ID_ATTR]);
    const sourceState = state.idConvertor(attrs[T.SOURCE_STATE_ATTR]);
    const targetState = state.idConvertor(attrs[T.TARGET_STATE_ATTR]);
    state.addTransition(fsm, id);
    state.addTransitionStates(id, sourceState, targetState);
    const result = {
        id,
        name: attrs[T.NAME_ATTR],
        sourceState,
        targetState,
        methods: extractXMLChildren(
            transition,
            T.TRANSITIONMETHODS.TAG,
            T.TRANSITIONMETHODS.TRANSITIONMETHOD.TAG
        ).map((m) => convertTransitionMethod(state, m)),
    };
    return result;
}

/**
 * Convert a JSON representation of a JMermaid FSM to a Merlin
 * FSM.
 */
function convertFSM(state, fsm) {
    let FSM = constants.MXP.METAMODEL.OBJECTTYPES.OBJECTTYPE.FSMS.FSM;
    let attrs = fsm['$'];
    let id = state.idConvertor(attrs[FSM.ID_ATTR]);
    let result = {
        id,
        name: attrs[FSM.NAME_ATTR],
        type: attrs[FSM.TYPE_ATTR],
        codegeneration: attrs[FSM.CODEGENERATION_ATTR] === 'true',
        states: extractXMLChildren(fsm, FSM.STATES.TAG, FSM.STATES.STATE.TAG).map((s) =>
            convertState(state, s, id)
        ),
        transitions: extractXMLChildren(
            fsm,
            FSM.TRANSITIONS.TAG,
            FSM.TRANSITIONS.TRANSITION.TAG
        ).map((t) => convertTransition(state, t, id)),
    };
    return result;
}

/**
 * Convert a JSON representation of a JMermaid dependency in a meta path to a
 * Merlin dependency in a path in a Merlin multiple propagation constraint.
 */
function convertDependencyInPath(state, dependency) {
    const DEP =
        constants.MXP.METAMODEL.OBJECTTYPES.OBJECTTYPE.MULTIPLEPROPAGATIONCONSTRAINTS
            .MULTIPLEPROPAGATIONCONSTRAINT.PATHS.DEPENDENCIES;
    const attrs = dependency['$'];
    return state.idConvertor(attrs[DEP.ID_ATTR]);
}

/**
 * Convert a JSON representation of a JMermaid meta path to a Merlin path in a
 * Merlin multiple propagation constraint.
 */
function convertMetaPath(state, path) {
    const P =
        constants.MXP.METAMODEL.OBJECTTYPES.OBJECTTYPE.MULTIPLEPROPAGATIONCONSTRAINTS
            .MULTIPLEPROPAGATIONCONSTRAINT.PATHS;
    const attrs = path['$'];
    const result = {
        id: state.idConvertor(attrs[P.ID_ATTR]),
        name: attrs[P.NAME_ATTR],
        primary: attrs[P.ENABLED_ATTR] === 'true',
        elements: (path[P.DEPENDENCIES.TAG] || []).map((d) => convertDependencyInPath(state, d)),
    };
    return result;
}

/**
 * Convert a JSON representation of a JMermaid multiple propagation constraint
 * to a Merlin multiple propagation constraint.
 */
function convertMultiplePropagationConstraint(state, mpc) {
    const MPC =
        constants.MXP.METAMODEL.OBJECTTYPES.OBJECTTYPE.MULTIPLEPROPAGATIONCONSTRAINTS
            .MULTIPLEPROPAGATIONCONSTRAINT;
    const attrs = mpc['$'];
    const id = state.idConvertor(attrs[MPC.ID_ATTR]);
    const paths = mpc[MPC.PATHS.TAG] || [];
    const result = {
        id,
        type: state.atLeastVersion('1.6') ? attrs[MPC.TYPE_ATTR] : 'EQUAL_TO',
        paths: paths.map((p) => convertMetaPath(state, p)),
    };
    return result;
}

/**
 * Safely extract children from the JSON representation of a JMermaid model,
 * e.g. the list of metaobjects from metamodel, the list of guiobjects from guimodel, ...
 *
 * @param object The object to extract from
 * @param collectionTag The XML tagname of the collection (e.g. 'mxp:metaobjects')
 * @param childTag The XML tagname of the children (e.g. 'mxp:metaobject')
 *
 * @return An array of the children. An empty array if the children are missing.
 */
function extractXMLChildren(object, collectionTag, childTag) {
    return ((object[collectionTag] || [])[0] || {})[childTag] || [];
}

/**
 * Convert the JSON representation of a JMermaid metamodel to the Merlin representation.
 *
 * @param metamodel The JSON representation of the JMermaid metamodel
 *
 * @return The Merlin representation of the JMermaid metamodel
 */
function convertMetaModel(state, metamodel) {
    let MM = constants.MXP.METAMODEL;
    return {
        objectTypes: extractXMLChildren(
            metamodel,
            MM.OBJECTTYPES.TAG,
            MM.OBJECTTYPES.OBJECTTYPE.TAG
        ).map((o) => convertObjectType(state, o)),
        eventTypes: extractXMLChildren(metamodel, MM.EVENTTYPES.TAG, MM.EVENTTYPES.EVENTTYPE.TAG)
            .map((e) => convertEventType(state, e))
            .concat(
                extractXMLChildren(
                    metamodel,
                    MM.SPECIALISEDEVENTTYPES.TAG,
                    MM.SPECIALISEDEVENTTYPES.EVENTTYPE.TAG
                ).map((e) => convertSpecialisedEventType(state, e))
            ),
        dependencies: extractXMLChildren(
            metamodel,
            MM.DEPENDENCIES.TAG,
            MM.DEPENDENCIES.DEPENDENCY.TAG
        ).map((d) => convertDependency(state, d)),
        methods: extractXMLChildren(metamodel, MM.METHODS.TAG, MM.METHODS.METHOD.TAG).map((m) =>
            convertMethod(state, m)
        ),
        dataTypes: extractXMLChildren(
            metamodel,
            MM.DATATYPES.TAG,
            MM.DATATYPES.DATATYPE.TAG
        ).map((dt) => convertDataType(state, dt)),
        inheritances: extractXMLChildren(
            metamodel,
            MM.INHERITANCES.TAG,
            MM.INHERITANCES.INHERITANCE.TAG
        ).map((i) => convertInheritance(state, i)),
    };
}

/**
 * Convert a position in JMermaid format "x!y" to a JSON representation.
 */
function convertLocation(location) {
    let position = location.split('!');
    return {
        x: Number(position[0]),
        y: Number(position[1]),
    };
}

/**
 * Convert a size in JMermaid format "width!height" to an JSON representation.
 */
function convertSize(orig) {
    let size = orig.split('!');
    return {
        width: Number(size[0]),
        height: Number(size[1]),
    };
}

/**
 * Convert the JSON representation of a JMermaid GUI object to a Merlin EDG position.
 */
function convertGUIObject(state, guiobject) {
    let GO = constants.MXP.GUIMODEL.VIEW.GUIOBJECTS.GUIOBJECT;
    let attrs = guiobject['$'];
    return {
        objectType: state.idConvertor(attrs[GO.REFID_ATTR]),
        position: convertLocation(attrs[GO.LOCATION_ATTR]),
        size: convertSize(attrs[GO.SIZE_ATTR]),
    };
}

/**
 * Convert the JSON representation of a JMermaid Edge control point to a Merlin vertex.
 */
function convertEdgeControlPoint(state, ecp, origin) {
    const ECP = constants.MXP.GUIMODEL.VIEW.EDGECONTROLPOINT;
    const attrs = ecp['$'];
    const position = attrs[ECP.VALUE_ATTR].split('!');
    const x = Number(position[0]);
    const y = Number(position[1]);
    if (x !== 0 || y !== 0) {
        return {
            x: origin.x + Number(position[0]),
            y: origin.y + Number(position[1]),
        };
    } else {
        return undefined;
    }
}

/**
 * Convert the JSON representation of a JMermaid GUI dependency to a Merlin EDG link.
 */
function convertGUIDependency(state, guidependency, nodes) {
    const GDEP = constants.MXP.GUIMODEL.VIEW.GUIDEPENDENCIES.GUIDEPENDENCY;
    const attrs = guidependency['$'];
    const dependencyId = state.idConvertor(attrs[GDEP.REFID_ATTR]);
    let vertices = [];
    const ecps = extractXMLChildren(
        guidependency,
        GDEP.EDGECONTROLPOINTS.TAG,
        GDEP.EDGECONTROLPOINTS.EDGECONTROLPOINT.TAG
    );
    if (ecps.length > 0) {
        // If there are edgecontrolpoints: calculate their origin and convert them to vertices
        const { master, dependent } = state.objectsForDependency(dependencyId);
        const masterNode = nodes.find((n) => n.objectType === master);
        const dependentNode = nodes.find((n) => n.objectType === dependent);
        const origin = {
            x: (dependentNode.position.x + masterNode.position.x) / 2,
            y: (dependentNode.position.y + masterNode.position.y) / 2,
        };
        vertices = ecps
            .map((ecp) => convertEdgeControlPoint(state, ecp, origin))
            .filter((v) => v != null);
    }
    return {
        dependency: dependencyId,
        vertices,
    };
}

/**
 * Convert the JSON representation of a JMermaid GUI Inheritance to a Merlin EDG link.
 */
function convertGUIInheritance(state, guiinheritance, nodes) {
    const GI = constants.MXP.GUIMODEL.VIEW.GUIINHERITANCES.GUIINHERITANCE;
    const attrs = guiinheritance['$'];
    const inheritanceId = state.idConvertor(attrs[GI.REFID_ATTR]);
    let vertices = [];
    const ecps = extractXMLChildren(
        guiinheritance,
        GI.EDGECONTROLPOINTS.TAG,
        GI.EDGECONTROLPOINTS.EDGECONTROLPOINT.TAG
    );
    if (ecps.length > 0) {
        // If there are edgecontrolpoints: calculate their origin and convert them to vertices
        const { supertype, subtype } = state.objectsForInheritance(inheritanceId);
        const supertypeNode = nodes.find((n) => n.objectType === supertypeNode);
        const subtypeNode = nodes.find((n) => n.objectType === subtype);
        const origin = {
            x: (subtypeNode.position.x + supertypeNode.position.x) / 2,
            y: (subtypeNode.position.y + supertypeNode.position.y) / 2,
        };
        vertices = ecps
            .map((ecp) => convertEdgeControlPoint(state, ecp, origin))
            .filter((v) => v != null);
    }
    return {
        inheritance: inheritanceId,
        vertices,
    };
}

/**
 * Convert the JSON representation of a JMermaid GUI State to a Merlin FSM node.
 */
function convertGUIState(conversionState, state) {
    let S = constants.MXP.GUIMODEL.VIEW.GUISTATES.STATE;
    let attrs = state['$'];
    return {
        state: conversionState.idConvertor(attrs[S.REFID_ATTR]),
        position: convertLocation(attrs[S.LOCATION_ATTR]),
        size: convertSize(attrs[S.SIZE_ATTR]),
    };
}

function convertGUITransition(state, transition, nodes) {
    let T = constants.MXP.GUIMODEL.VIEW.GUITRANSITIONS.TRANSITION;
    let attrs = transition['$'];
    const transitionId = state.idConvertor(attrs[T.REFID_ATTR]);
    let vertices = [];
    const ecps = extractXMLChildren(
        transition,
        T.EDGECONTROLPOINTS.TAG,
        T.EDGECONTROLPOINTS.EDGECONTROLPOINT.TAG
    );
    if (ecps.length > 0) {
        // If there are edgecontrolpoints: calculate their origin and convert them to vertices
        const { sourceState, targetState } = state.statesForTransition(transitionId);
        const sourceStateNode = nodes.find((n) => n.state === sourceState);
        const targetStateNode = nodes.find((n) => n.state === targetState);
        const origin = {
            x: (targetStateNode.position.x + sourceStateNode.position.x) / 2,
            y: (targetStateNode.position.y + sourceStateNode.position.y) / 2,
        };
        vertices = ecps
            .map((ecp) => convertEdgeControlPoint(state, ecp, origin))
            .filter((v) => v != null);
    }
    return {
        transition: transitionId,
        vertices,
    };
}

/**
 * Convert the JSON representation of a JMermaid GUI FSM to a Merlin FSM view.
 *
 * @param state The conversion state
 * @param guifsm The JSON representation of the JMermaid GUI FSM.
 * @param nodes The Merlin representations of all FSM nodes.
 * @param links The Merlin representations of all FSM links.
 */
function convertGUIFSM(state, guifsm, nodes, links) {
    const GUIFSM = constants.MXP.GUIMODEL.VIEW.GUIFSMS.FSM;
    const attrs = guifsm['$'];
    const fsm = state.idConvertor(attrs[GUIFSM.REFID_ATTR]);
    return {
        fsm,
        nodes: nodes.filter((s) => state.fsmForState(s.state) === fsm),
        links: links.filter((t) => state.fsmForTransition(t.transition) === fsm),
    };
}

/**
 * Convert the JSON representation of a JMermaid GUI model to a Merlin UI model.
 *
 * @param state The conversion state.
 * @param guimodel The JSON representation of the JMermaid GUI model
 *
 * @return A Merlin UI model.
 */
function convertGUIModel(state, guimodel) {
    let GUIM = constants.MXP.GUIMODEL;
    let view =
        (guimodel[GUIM.VIEW.TAG] || []).find((v) => v['$'][GUIM.VIEW.ISDEFAULT_ATTR] === 'true') || {};
    const edgnodes = extractXMLChildren(
        view,
        GUIM.VIEW.GUIOBJECTS.TAG,
        GUIM.VIEW.GUIOBJECTS.GUIOBJECT.TAG
    ).map((o) => convertGUIObject(state, o));
    const edglinks = extractXMLChildren(
        view,
        GUIM.VIEW.GUIDEPENDENCIES.TAG,
        GUIM.VIEW.GUIDEPENDENCIES.GUIDEPENDENCY.TAG
    ).map((d) => convertGUIDependency(state, d, edgnodes));
    const fsmnodes = extractXMLChildren(
        view,
        GUIM.VIEW.GUISTATES.TAG,
        GUIM.VIEW.GUISTATES.STATE.TAG
    ).map((s) => convertGUIState(state, s));
    const fsmlinks = extractXMLChildren(
        view,
        GUIM.VIEW.GUITRANSITIONS.TAG,
        GUIM.VIEW.GUITRANSITIONS.TRANSITION.TAG
    ).map((t) => convertGUITransition(state, t, fsmnodes));
    return {
        edg: {
            nodes: edgnodes,
            links: edglinks,
        },
        fsms: extractXMLChildren(view, GUIM.VIEW.GUIFSMS.TAG, GUIM.VIEW.GUIFSMS.FSM.TAG).map((f) =>
            convertGUIFSM(state, f, fsmnodes, fsmlinks)
        ),
    };
}

/**
 * Generate a function that converts the numeric ids of JMermaid to UUIDs.
 *
 * The function keeps a list of JMermaid ids it already saw and returns the same
 * UUID each time the same JMermaid id is converted.
 */
function generateIdConvertor() {
    let ids = {};
    return function (id) {
        if (!ids[id]) {
            ids[id] = uuidv4();
        }
        return ids[id];
    };
}

/**
 * Conversion state holder.
 */
class ConversionState {
    mxpVersion = 1.5;

    constructor({ mxpVersion }) {
        this.mxpVersion = mxpVersion;
        this.idConvertor = generateIdConvertor();
        this.stateMap = {};
        this.transitionMap = {};
        this.objectsForDependencyMap = {};
        this.statesForTransitionMap = {};
        this.objectsForInheritanceMap = {};
    }

    // Methods below keep track of which state/transition belong to which fsm to be
    // able to put the guistates/guitransitions in the correct fsm. In JMermaid
    // these are flat list, but in Merlin, we keep them as children of the fsm
    // they belong to.

    addState(fsm, state) {
        this.stateMap[state] = fsm;
    }

    fsmForState(state) {
        return this.stateMap[state];
    }

    addTransition(fsm, transition) {
        this.transitionMap[transition] = fsm;
    }

    fsmForTransition(transition) {
        return this.transitionMap[transition];
    }

    // Methods below keep track of the master and dependent object for a dependency.
    // We need that info for calculation the origin of the vertices for an EDG link.

    addDependencyObjects(dependency, master, dependent) {
        this.objectsForDependencyMap[dependency] = {
            master,
            dependent,
        };
    }

    objectsForDependency(dependency) {
        return this.objectsForDependencyMap[dependency];
    }

    // Methods below keep track of the supertype and subtype object for an inheritance.
    // We need that info for calculating the origin of the vertices for the EDG link.

    addInheritanceObjects(inheritance, supertype, subtype) {
        this.objectsForInheritanceMap[inheritance] = {
            supertype,
            subtype,
        };
    }

    objectsForInheritance(inheritance) {
        return this.objectsForInheritanceMap[inheritance];
    }

    // Methods below keep track of the source and target state for a transition.
    // We need that info for calculating the origin of the vertices for an FSM link.

    addTransitionStates(transition, sourceState, targetState) {
        this.statesForTransitionMap[transition] = {
            sourceState,
            targetState,
        };
    }

    statesForTransition(transition) {
        return this.statesForTransitionMap[transition];
    }

    atLeastVersion(version) {
        return semver.gte(semver.coerce(this.mxpVersion), semver.coerce(version));
    }
}

/**
 * Convert the JSON representation of a JMermaid model to the Merlin representation.
 *
 * @param model The JSON respresentation of a JMermaid model
 *
 * @return The Merlin representation of the JMermaid model
 */
function convertModel(model) {
    let mermaidModel = model[constants.MXP.TAG];
    const mxpVersion = mermaidModel['$'][constants.MXP.VERSION_ATTR];
    const state = new ConversionState({ mxpVersion });
    const metamodel = convertMetaModel(state, mermaidModel[constants.MXP.METAMODEL.TAG][0]);
    const uimodel = convertGUIModel(state, mermaidModel[constants.MXP.GUIMODEL.TAG][0]);
    return {
        version: constants.MERLIN_MODEL_VERSION,
        timestamp: convertTimestamp(mermaidModel['$'][constants.MXP.TIMESTAMP_ATTR]),
        metamodel: metamodel,
        uimodel: uimodel,
    };
}

// Function to parse an MXP file and extract metaobjects
function parseMXP(mxpFilePath) {
    return new Promise((resolve, reject) => {
        const mxpContent = fs.readFileSync(mxpFilePath, 'utf8');
        parse(mxpContent)
          .then(result => {
            resolve(convertModel(result));
          })
          .catch(error => {
            reject(error);
          });
      });
}

module.exports = parseMXP;

