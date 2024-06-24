import React, { useEffect, useRef, useState } from 'react';
import * as joint from 'jointjs';
import _ from 'lodash';
import useModel from '../hook/useModel';
import useBattleFieldStore from '../store/battleFieldStore';
import { Box, Button } from '@mui/material';
import { default as DependencyOptionalN } from './icons/dep_optional_n'
import { default as DependencyOptional1 } from './icons/dep_optional_1'
import { default as DependencyMandatoryN } from './icons/dep_mandatory_n'
import { default as DependencyMandatory1 } from './icons/dep_mandatory_1'
import useAddMutant from '../hook/useAddMutant';
import useAuthStore from '../store/authStore';


const GraphEditor = () => {
  const modelId = useBattleFieldStore((state) => state.modelId);
  const gameId = useBattleFieldStore((state) => state.gameId);
  const user = useAuthStore((state) => state.user);

  const { data: model } = useModel(modelId); // get the model data of the current game

  const containerRef = useRef(null);

  const nodes = model.content.uimodel.edg.nodes;
  const objectTypes = model.content.metamodel.objectTypes
  const smallestY = Math.min(...nodes.map((node) => node.position.y));
  const dependencies = model.content.metamodel.dependencies

  const [current_link, setCurrent_link] = useState('MANDATORY_1'); // it's the dependency type selected by the user
  const [graph, setGraph] = useState(null);
  const [paper, setPaper] = useState(null);
  const { handleAddMutant, isAdding, error } = useAddMutant();

  const OIDtoName = (id) => {
    const matching_obj = objectTypes.find((type) => type.id === id)
    return matching_obj.name
  }
  const NametoID = (name) => {
    const matching_obj = objectTypes.find((type) => type.name === name)
    return matching_obj.id
  }

  const handleButtonClicked = (linkType) => {
    setCurrent_link(linkType)
  };

  const handleAttack = async () => {
    const links = graph.getLinks();
    const newDependencies = [];
    for (const link of links) {
      const newDependency = {
        id: link.id,
        master: link.attributes.source.id,
        dependent: link.attributes.target.id,
        type: link.attributes.type,
        name: {
          dependent: OIDtoName(link.attributes.target.id),
          master: OIDtoName(link.attributes.source.id),
        }
      }
      newDependencies.push(newDependency);
    }


    const MXP = {
      dependencies: newDependencies,
      nodes: nodes,
    }
    MXP.nodes.forEach(node => {
      node.name = OIDtoName(node.objectType);
    });

    const data = {
      gameId: gameId,
      MXP: MXP,
      userId: user.id,
      state: "alive",
    };


    try {
      const newMutant = await handleAddMutant(data)
    } catch (err) {
      alert(err.response.data.message);
    }




    // Create a data URL from the SVG string
    // const imageDataURL = `data:image/svg+xml;base64,${btoa(svgString)}`;
    // const svg = paper.svg.cloneNode(true);
    // const serializer = new XMLSerializer();
    // const svgString = serializer.serializeToString(svg);

  }



  const setLinkAttr = (link, type) => {
    switch (type) {
      case 'MANDATORY_1':
        link.attr({
          line: {
            sourceMarker: {
              'type': 'path',
              'stroke': 'black',
              'stroke-width': 2,
              'fill': 'black',
              'd': 'M 0 -5 A 5 5 0 1 0 0 5 A 5 5 0 1 0 0 -5',
            },
            targetMarker: {
              'stroke': 'none',
              'fill': 'none',
            },
          },
        });
        break;
      case 'MANDATORY_N':
        link.attr({
          line: {
            sourceMarker: {
              'type': 'path',
              'stroke': 'black',
              'stroke-width': 2,
              'fill': 'black',
              'd': 'M 0 -5 A 5 5 0 1 0 0 5 A 5 5 0 1 0 0 -5',
            },
            targetMarker: {
              'type': 'path',
              'stroke': 'black',
              'stroke-width': 2,
              'fill': 'none',
              'd': 'M 10 -5 L 0 0 L 10 5', 
            },
          },
        });
        break;
      case 'OPTIONAL_1':
        link.attr({
          line: {
            sourceMarker: {
              'type': 'path',
              'stroke': 'black',
              'stroke-width': 2,
              'fill': 'white',
              'd': 'M 0 -5 A 5 5 0 1 0 0 5 A 5 5 0 1 0 0 -5',
            },
            targetMarker: {
              'stroke': 'none',
              'fill': 'none',
            },
          },
        });
        break;
      case 'OPTIONAL_N':
        link.attr({
          line: {
            sourceMarker: {
              'type': 'path',
              'stroke': 'black',
              'stroke-width': 2,
              'fill': 'white',
              'd': 'M 0 -5 A 5 5 0 1 0 0 5 A 5 5 0 1 0 0 -5',
            },
            targetMarker: {
              'type': 'path',
              'stroke': 'black',
              'stroke-width': 2,
              'fill': 'none',
              'd': 'M 10 -5 L 0 0 L 10 5', 
            },
          },
        });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const graph = new joint.dia.Graph();
      const paper = new joint.dia.Paper({
        el: containerRef.current,
        width: '150%',
        height: '400',
        model: graph,
        gridSize: 10,
        defaultLink: () => {
          const new_link = new joint.shapes.standard.Link()
          setLinkAttr(new_link, current_link)
          return new_link
        },
        linkPinning: false,
        validateConnection: function (cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
          // Prevent linking to itself
          if (cellViewS === cellViewT) {
            return false;
          }
          // Check if a link already exists between the source and target cells
          const links = graph.getLinks();
          for (const link of links) {
            if (
              (link.get('source').id === cellViewS.model.id && link.get('target').id === cellViewT.model.id) ||
              (link.get('source').id === cellViewT.model.id && link.get('target').id === cellViewS.model.id)
            ) {
              return false;
            }
          }
          // Connection between non-rectangular elements is not allowed
          if (cellViewS.model.get('type') !== 'standard.Rectangle' || cellViewT.model.get('type') !== 'standard.Rectangle') {
            return false;
          }
          return true;
        }
      });

      nodes.forEach((node) => {
        const newNode = new joint.shapes.standard.Rectangle({
          id: node.objectType,
          position: { x: node.position.x - 10, y: node.position.y - smallestY + 10 },
          size: { width: node.size.width, height: node.size.height },
          attrs: {
            label: { text: OIDtoName(node.objectType), cursor: 'move', },
            body: {
              magnet: true,
              cursor: 'crosshair',
            }
          },
        });
        paper.model.addCell(newNode);
      });

      // Keep track of existing links between the same source and target
      let links = [];
      let flag = 0;

      dependencies.forEach((dependency, idx) => {
        let { master, dependent } = dependency;
        links.push({ f: master, t: dependent });
      })
      console.log(links)

      dependencies.forEach((dependency, idx) => {
        let { master, dependent, type } = dependency;
        let count = links.filter(link => link.f === master && link.t === dependent).length;

        // Check if a link already exists
        if (count !== 1 && flag === 0) {
          flag = 1;
          // Adjust the position of the new link to make it distinguishable
          const source = nodes.find((n) => n.objectType === master)
          const target = nodes.find((n) => n.objectType === dependent)
          const middel = [
            {
              x: (source.position.x + target.position.x) / 2 - 80,
              y: (source.position.y + target.position.y) / 2 - 140
            },
          ]
          // Create the new link with adjusted position
          const link = new joint.shapes.standard.Link({
            id: dependency.id,
            source: { id: master },
            target: { id: dependent },
            vertices: middel,
            type: type,
          });

          // Assign a different label to the new link
          link.label(0, {
            position: 0.5, // Adjust label position as needed
            attrs: {
              text: { text: dependency.name.dependent }, // Set the label text
            },
          });

          setLinkAttr(link, type);
          graph.addCell(link);

        } else {
          // Create a new link if no link exists between the same source and target
          const link = new joint.shapes.standard.Link({
            id: dependency.id,
            source: { id: master },
            target: { id: dependent },
            type: type,
          });
          // Assign a different label to the new link
          link.label(0, {
            position: 0.5, // Adjust label position as needed
            attrs: {
              text: { text: dependency.name.dependent }, // Set the label text
            },
          });

          setLinkAttr(link, type);
          graph.addCell(link);
        }

      });
      const removeButton = new joint.linkTools.Remove();
      const boundaryTool = new joint.linkTools.Boundary();
      const linkToolsView = new joint.dia.ToolsView({
        tools: [boundaryTool, removeButton],
      });
      paper.on('link:mouseenter', function (linkView) {
        linkView.addTools(linkToolsView);
      });
      paper.on('link:mouseleave', function (linkView) {
        linkView.removeTools();
      });
      paper.on('link:pointerdblclick', function (linkView) {
        toggleLinkType(linkView.model);
      })

      graph.on('remove', (cell, collection, opt) => {
        if (cell.isLink()) {
          console.log('Link deleted:', cell);
        }
      });


      setGraph(graph);
      setPaper(paper);

      // Clean up the graph when the component is unmounted
      return () => {
        graph.off('remove');
        graph.clear();
      };
    }
  }, []);

  const toggleLinkType = (link) => {
    const currentType = link.attributes.type;
    console.log("currentType: "+currentType)
    let newType;
    switch (currentType) {
      case 'MANDATORY_1':
        newType = 'MANDATORY_N';
        break;
      case 'MANDATORY_N':
        newType = 'OPTIONAL_N';
        break;
      case 'OPTIONAL_N':
        newType = 'OPTIONAL_1';
        break;
      case 'OPTIONAL_1':
        newType = 'MANDATORY_1';
        break;
      default:
        newType = currentType;
    }
    link.attributes.type = newType;
    console.log("new type: "+ newType)
    setLinkAttr(link, newType);
  };


  useEffect(() => {
    if (graph && paper) {
      paper.options.defaultLink = () => {
        const new_link = new joint.shapes.standard.Link();
        new_link.attributes.type = current_link
        // Set link attributes based on current_link
        setLinkAttr(new_link, current_link);
        return new_link;
      };
    }
  }, [current_link, graph, paper]);



  return (
    <>
      <Box display="flex">
        <Box display="flex" flexDirection="column" >
          <Button style={{ maxWidth: '30px', minWidth: '30px', margin: '0px', padding: '0px', backgroundColor: current_link === 'MANDATORY_1' ? 'lightblue' : 'transparent', }} onClick={() => handleButtonClicked('MANDATORY_1')}><DependencyMandatory1 /></Button>
          <Button style={{ maxWidth: '30px', minWidth: '30px', margin: '0px', padding: '0px', backgroundColor: current_link === 'MANDATORY_N' ? 'lightblue' : 'transparent', }} onClick={() => handleButtonClicked('MANDATORY_N')}><DependencyMandatoryN /></Button>
          <Button style={{ maxWidth: '30px', minWidth: '30px', margin: '0px', padding: '0px', backgroundColor: current_link === 'OPTIONAL_1' ? 'lightblue' : 'transparent', }} onClick={() => handleButtonClicked('OPTIONAL_1')}><DependencyOptional1 /></Button>
          <Button style={{ maxWidth: '30px', minWidth: '30px', margin: '0px', padding: '0px', backgroundColor: current_link === 'OPTIONAL_N' ? 'lightblue' : 'transparent', }} onClick={() => handleButtonClicked('OPTIONAL_N')}><DependencyOptionalN /></Button>
        </Box>
        <Box style={{ width: '100%', height: '37vh', overflow: 'auto' }}>
          <div ref={containerRef} />
        </Box>
      </Box>
      <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Button
          color="primary"
          variant="contained"
          style={{ width: '100%', background: "#BB1E10" }}
          // disabled={true}
          onClick={handleAttack}
        >{isAdding ? 'Attacking...' : 'Attack'}</Button>
      </Box>
    </>

  )

};

export default GraphEditor;
