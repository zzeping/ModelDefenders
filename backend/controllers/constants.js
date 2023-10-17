/**
 * Constants used when parsing/generating the XML in a JMermaid MXP file.
 */

const MXP_METADESCRIPTION = {
  TAG: 'mxp:metadescription',
};

const MXP_DESCRIPTION = {
  TAG: 'mxp:description',
};

const MXP_METACONSTRAINTS = {
  TAG: 'mxp:metaconstraints',
};

const MXP_METAPRECONDITION = {
  TAG: 'mxp:metaprecondition',
};

const MXP_METAPOSTCONDITION = {
  TAG: 'mxp:metapostcondition',
};

const MXP_METAIMPLEMENTATION = {
  TAG: 'mxp:metaimplementation',
};

const MXP_VALIDATION = {
  TAG: 'mxp:validation',
};

const MXP_IMPLEMENTATION = {
  TAG: 'mxp:implementation',
};

const MXP_ATTRIBUTE = {
  TAG: 'mxp:metaattribute',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  TYPE_ATTR: 'type',
  TYPE_ID_ATTR: 'type-id',
  DESCRIPTION: MXP_DESCRIPTION,
  VALIDATION: MXP_VALIDATION,
  IMPLEMENTATION: MXP_IMPLEMENTATION,
};

const MXP_ATTRIBUTES = {
  TAG: 'mxp:metaattributes',
  ATTRIBUTE: MXP_ATTRIBUTE,
};

const MXP_METASTATE = {
  TAG: 'mxp:metastate',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  TYPE_ATTR: 'type',
};

const MXP_METASTATES = {
  TAG: 'mxp:metastates',
  STATE: MXP_METASTATE,
};

const MXP_METATRANSITIONMETHOD = {
  TAG: 'mxp:metatransitionmethod',
  METHODID_ATTR: 'methodid',
  SAFEID_ATTR: 'safeid',
  METHODNAME_ATTR: 'methodname',
};

const MXP_METATRANSITION = {
  TAG: 'mxp:metatransition',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  SOURCE_STATE_ATTR: 'sourcestateid',
  TARGET_STATE_ATTR: 'targetstateid',
  TRANSITIONMETHODS: {
    TAG: 'mxp:metatransitionmethods',
    TRANSITIONMETHOD: MXP_METATRANSITIONMETHOD,
  },
};

const MXP_METATRANSITIONS = {
  TAG: 'mxp:metatransitions',
  TRANSITION: MXP_METATRANSITION,
};

const MXP_METAFSM = {
  TAG: 'mxp:metafsm',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  TYPE_ATTR: 'type',
  CODEGENERATION_ATTR: 'codegeneration',
  STATES: MXP_METASTATES,
  TRANSITIONS: MXP_METATRANSITIONS,
};

const MXP_METAFSMS = {
  TAG: 'mxp:metafsms',
  FSM: MXP_METAFSM,
};

const MXP_PATH = {
  TAG: 'mxp:metapath',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  ENABLED_ATTR: 'isenabled',
  DEPENDENCIES: {
    TAG: 'mxp:metadependencyinpath',
    ID_ATTR: 'id',
  },
};

const MXP_MULTIPLEPROPAGATIONCONTRAINT = {
  TAG: 'mxp:metamultiplepropagationconstraint',
  ID_ATTR: 'id',
  TYPE_ATTR: 'type',
  PATHS: MXP_PATH,
};

const MXP_OBJECTTYPE = {
  TAG: 'mxp:metaobject',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  ABSTRACT_ATTR: 'abstract',
  DESCRIPTION: MXP_METADESCRIPTION,
  CONSTRAINTS: MXP_METACONSTRAINTS,
  MULTIPLEPROPAGATIONCONSTRAINTS: {
    TAG: 'mxp:metamultiplepropagationconstraints',
    MULTIPLEPROPAGATIONCONSTRAINT: MXP_MULTIPLEPROPAGATIONCONTRAINT,
  },
  ATTRIBUTES: MXP_ATTRIBUTES,
  FSMS: MXP_METAFSMS,
};

const MXP_OBJECTTYPES = {
  TAG: 'mxp:metaobjects',
  OBJECTTYPE: MXP_OBJECTTYPE,
};

const MXP_EVENTTYPE = {
  TAG: 'mxp:metaevent',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  DESCRIPTION: MXP_METADESCRIPTION,
  ATTRIBUTES: MXP_ATTRIBUTES,
};

const MXP_EVENTTYPES = {
  TAG: 'mxp:metaevents',
  EVENTTYPE: MXP_EVENTTYPE,
};

const MXP_SPECIALISED_EVENTTYPE = {
  TAG: 'mxp:metaspecialisedevent',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  OWNER_EVENT_ID_ATTR: 'ownereventid',
  INHERITANCE_ID_ATTR: 'inheritanceid',
  DESCRIPTION: MXP_METADESCRIPTION,
  ATTRIBUTES: MXP_ATTRIBUTES,
};

const MXP_SPECIALISED_EVENTTYPES = {
  TAG: 'mxp:metaspecialisedevents',
  EVENTTYPE: MXP_SPECIALISED_EVENTTYPE,
};

const MXP_DEPENDENCY = {
  TAG: 'mxp:metadependency',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  TYPE_ATTR: 'type',
  MASTER_ATTR: 'master',
  DEPENDENT_ATTR: 'dependent',
  MASTER_ROLE_ATTR: 'masterrole',
  DEPENDENT_ROLE_ATTR: 'dependentrole',
};

const MXP_DEPENDENCIES = {
  TAG: 'mxp:metadependencies',
  DEPENDENCY: MXP_DEPENDENCY,
};

const MXP_METHOD = {
  TAG: 'mxp:metamethod',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  PROVENANCE_ATTR: 'provenance',
  TYPE_ATTR: 'type',
  OWNER_OBJECT_ID_ATTR: 'ownerobjectid',
  OWNER_EVENT_ID_ATTR: 'ownereventid',
  VIA_METHOD_ATTR: 'viamethod',
  VIA_DEPENDENCY_ATTR: 'viadependency',
  VIA_INHERITANCE_ATTR: 'viainheritance',
  ATTRIBUTES: MXP_ATTRIBUTES,
  PRECONDITION: MXP_METAPRECONDITION,
  POSTCONDITION: MXP_METAPOSTCONDITION,
  IMPLEMENTATION: MXP_METAIMPLEMENTATION,
};

const MXP_METHODS = {
  TAG: 'mxp:metamethods',
  METHOD: MXP_METHOD,
};

const MXP_DATATYPE = {
  TAG: 'mxp:datatype',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
};

const MXP_DATATYPES = {
  TAG: 'mxp:datatypes',
  DATATYPE: MXP_DATATYPE,
};

const MXP_INHERITANCE = {
  TAG: 'mxp:metainheritance',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  SUPERTYPE_ID_ATTR: 'supertypeid',
  SUBTYPE_ID_ATTR: 'subtypeid',
};

const MXP_INHERITANCES = {
  TAG: 'mxp:metainheritances',
  INHERITANCE: MXP_INHERITANCE,
};

const MXP_METAMODEL = {
  TAG: 'mxp:metamodel',
  OBJECTTYPES: MXP_OBJECTTYPES,
  EVENTTYPES: MXP_EVENTTYPES,
  SPECIALISEDEVENTTYPES: MXP_SPECIALISED_EVENTTYPES,
  DEPENDENCIES: MXP_DEPENDENCIES,
  METHODS: MXP_METHODS,
  DATATYPES: MXP_DATATYPES,
  ATTRIBUTES: MXP_ATTRIBUTES,
  INHERITANCES: MXP_INHERITANCES,
};

const MXP_GUIOBJECT = {
  TAG: 'mxp:guiobject',
  REFID_ATTR: 'refid',
  LOCATION_ATTR: 'location',
  SIZE_ATTR: 'size',
  IGNORED_ATTRS: {
    borderthickness: '1',
    bordercolor: '0-0-0',
    backgroundcolor: '255-255-255',
    gradientcolor: 'null',
    textcolor: '0-0-0',
    fontfamily: 'Arial',
    fontsize: '12',
    fontbold: 'false',
    fontitalic: 'false',
  },
};

const MXP_GUIOBJECTS = {
  TAG: 'mxp:guiobjects',
  GUIOBJECT: MXP_GUIOBJECT,
};

const MXP_EDGECONTROLPOINT = {
  TAG: 'mxp:edgecontrolpoint',
  VALUE_ATTR: 'value',
};

const MXP_EDGECONTROLPOINTS = {
  TAG: 'mxp:edgecontrolpoints',
  EDGECONTROLPOINT: MXP_EDGECONTROLPOINT,
};

const MXP_GUIDEPENDENCY = {
  TAG: 'mxp:guidependency',
  REFID_ATTR: 'refid',
  IGNORED_ATTRS: {
    linewidth: '1',
    linecolor: '0-0-0',
    labelvisible: 'false',
    labelposition: '-0.00!0.00',
    textcolor: '0-0-0',
    fontfamily: 'Arial',
    fontsize: '12',
    fontbold: 'false',
    fontitalic: 'false',
  },
  IGNORED_CHILDREN: {
    'mxp:dependencylabels': [
      {
        'mxp:dependencyumllabel': [
          {
            $: {
              masterside: true,
              position: '0.00!0.00',
            },
          },
          {
            $: {
              masterside: false,
              position: '0.00!0.00',
            },
          },
        ],
      },
    ],
  },
  EDGECONTROLPOINTS: MXP_EDGECONTROLPOINTS,
};

const MXP_GUIDEPENDENCIES = {
  TAG: 'mxp:guidependencies',
  GUIDEPENDENCY: MXP_GUIDEPENDENCY,
};

const MXP_GUIINHERITANCE = {
  TAG: 'mxp:guiinheritance',
  REFID_ATTR: 'refid',
  IGNORED_ATTRS: {
    linewidth: '1',
    linecolor: '0-0-0',
    labelvisible: 'false',
    labelposition: '-0.00!0.00',
    textcolor: '0-0-0',
    fontfamily: 'Arial',
    fontsize: '12',
    fontbold: 'false',
    fontitalic: 'false',
  },
  EDGECONTROLPOINTS: MXP_EDGECONTROLPOINTS,
};

const MXP_GUIINHERITANCES = {
  TAG: 'mxp:guiinheritances',
  GUIINHERITANCE: MXP_GUIINHERITANCE,
};

const MXP_EDGVIEW = {
  TAG: 'mxp:edgview',
  IGNORED_ATTRS: {
    gridcolor: '128-128-128',
    backgroundcolor: '255-255-255',
    gridenabled: 'false',
    gridvisible: 'false',
    gridmode: '0',
    gridsize: '16',
    scale: '1.0',
  },
};

const MXP_OETEVENT = {
  TAG: 'mxp:oetevent',
  REFID_ATTR: 'refid',
};

const MXP_OETEVENTS = {
  TAG: 'mxp:oetevents',
  OETEVENT: MXP_OETEVENT,
};

const MXP_OETOBJECT = {
  TAG: 'mxp:oetobject',
  REFID_ATTR: 'refid',
};

const MXP_OETOBJECTS = {
  TAG: 'mxp:oetobjects',
  OETOBJECT: MXP_OETOBJECT,
};

const MXP_OETVIEW = {
  TAG: 'mxp:oetview',
  IGNORED_ATTRS: {
    highlightercolor: '255-200-0',
    linecolor: '122-138-153',
    backgroundcolor: '255-255-255',
    headerrotation: '90',
    hidedisabledmethods: 'false',
    scale: '1.0',
  },
  OETOBJECTS: MXP_OETOBJECTS,
  OETEVENTS: MXP_OETEVENTS,
};

const MXP_GUIMETHOD_IGNORED_ATTRS = {
  backgroundcolor: 'null',
  textcolor: '0-0-0',
  fontfamily: 'Arial',
  fontsize: '12',
  fontbold: 'false',
  fontitalic: 'false',
};

const MXP_GUIOWNEDMETHOD = {
  TAG: 'mxp:guiownedmethod',
  REFID_ATTR: 'refid',
  IGNORED_ATTRS: MXP_GUIMETHOD_IGNORED_ATTRS,
};

const MXP_GUIOWNEDMETHODS = {
  TAG: 'mxp:guiownedmethods',
  GUIOWNEDMETHOD: MXP_GUIOWNEDMETHOD,
};

const MXP_GUIACQUIREDMETHOD = {
  TAG: 'mxp:guiacquiredmethod',
  REFID_ATTR: 'refid',
  IGNORED_ATTRS: MXP_GUIMETHOD_IGNORED_ATTRS,
};

const MXP_GUIACQUIREDMETHODS = {
  TAG: 'mxp:guiacquiredmethods',
  GUIACQUIREDMETHOD: MXP_GUIACQUIREDMETHOD,
};

const MXP_GUIINHERITEDMETHOD = {
  TAG: 'mxp:guiinheritedmethod',
  REFID_ATTR: 'refid',
  IGNORED_ATTRS: MXP_GUIMETHOD_IGNORED_ATTRS,
};

const MXP_GUIINHERITEDMETHODS = {
  TAG: 'mxp:guiinheritedmethods',
  GUIINHERITEDMETHOD: MXP_GUIINHERITEDMETHOD,
};

const MXP_GUISPECIALISEDMETHOD = {
  TAG: 'mxp:guispecialisedmethod',
  REFID_ATTR: 'refid',
  IGNORED_ATTRS: MXP_GUIMETHOD_IGNORED_ATTRS,
};

const MXP_GUISPECIALISEDMETHODS = {
  TAG: 'mxp:guispecialisedmethods',
  GUISPECIALISEDMETHOD: MXP_GUISPECIALISEDMETHOD,
};

const MXP_GUIEVENT = {
  TAG: 'mxp:guievent',
  REFID_ATTR: 'refid',
  IGNORED_ATTRS: {
    backgroundcolor: 'null',
    textcolor: '0-0-0',
    fontfamily: 'Arial',
    fontsize: '12',
    fontbold: 'false',
    fontitalic: 'false',
  },
};

const MXP_GUIEVENTS = {
  TAG: 'mxp:guievents',
  GUIEVENT: MXP_GUIEVENT,
};

const MXP_GUIFSM = {
  TAG: 'mxp:guifsm',
  REFID_ATTR: 'refid',
};

const MXP_GUIFSMS = {
  TAG: 'mxp:guifsms',
  FSM: MXP_GUIFSM,
};

const MXP_GUISTATE = {
  TAG: 'mxp:guistate',
  REFID_ATTR: 'refid',
  LOCATION_ATTR: 'location',
  SIZE_ATTR: 'size',
  IGNORED_ATTRS: {
    borderthickness: '1',
    bordercolor: '0-0-0',
    backgroundcolor: 'null',
    gradientcolor: 'null',
    textcolor: '0-0-0',
    fontfamily: 'Arial',
    fontsize: '12',
    fontbold: 'false',
    fontitalic: 'false',
  },
};

const MXP_GUISTATES = {
  TAG: 'mxp:guistates',
  STATE: MXP_GUISTATE,
};

const MXP_GUITRANSITION = {
  TAG: 'mxp:guitransition',
  REFID_ATTR: 'refid',
  IGNORED_ATTRS: {
    linewidth: '1',
    linecolor: '0-0-0',
    labelvisible: 'true',
    labelposition: '0.00!0.00',
    textcolor: '0-0-0',
    fontfamily: 'Arial',
    fontsize: '12',
    fontbold: 'false',
    fontitalic: 'false',
  },
  EDGECONTROLPOINTS: MXP_EDGECONTROLPOINTS,
};

const MXP_VIEW = {
  TAG: 'mxp:view',
  ID_ATTR: 'id',
  NAME_ATTR: 'name',
  ISDEFAULT_ATTR: 'isdefault',
  DESCRIPTION: {
    TAG: 'mxp:guidescription',
  },
  GUIOBJECTS: MXP_GUIOBJECTS,
  GUIDEPENDENCIES: MXP_GUIDEPENDENCIES,
  EDGVIEW: MXP_EDGVIEW,
  OETVIEW: MXP_OETVIEW,
  GUIINHERITANCES: MXP_GUIINHERITANCES,
  GUIEVENTS: MXP_GUIEVENTS,
  GUIOWNEDMETHODS: MXP_GUIOWNEDMETHODS,
  GUIACQUIREDMETHODS: MXP_GUIACQUIREDMETHODS,
  GUIINHERITEDMETHODS: MXP_GUIINHERITEDMETHODS,
  GUISPECIALISEDMETHODS: MXP_GUISPECIALISEDMETHODS,
  GUIFSMS: MXP_GUIFSMS,
  GUISTATES: MXP_GUISTATES,
  GUITRANSITIONS: {
    TAG: 'mxp:guitransitions',
    TRANSITION: MXP_GUITRANSITION,
  },
  FSMVIEW: {
    TAG: 'mxp:fsmview',
    IGNORED_ATTRS: {
      gridcolor: '128-128-128',
      backgroundcolor: '255-255-255',
      gridenabled: 'false',
      gridvisible: 'false',
      gridmode: '0',
      gridsize: '10',
      scale: '1.0',
    },
  },
  EDGECONTROLPOINT: MXP_EDGECONTROLPOINT,
};

const MXP_GUIMODEL = {
  TAG: 'mxp:guimodel',
  CURRENTVIEW_ATTR: 'currentview',
  TOPVIEW_LASTID_ATTR: 'topview.lastid',
  VIEW: MXP_VIEW,
};

const MXP = {
  TAG: 'mxp:mermaidmodel',
  TIMESTAMP_ATTR: 'timestamp',
  VERSION_ATTR: 'mxp.version',
  METAMODEL: MXP_METAMODEL,
  GUIMODEL: MXP_GUIMODEL,
};

module.exports = {
  MERLIN_MODEL_VERSION: '1.0.0',
  MODEL_FILENAME: 'model.mxp',
  MXP,
};
