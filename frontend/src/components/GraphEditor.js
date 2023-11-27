import React, { useEffect, useRef, useState } from 'react';
import * as joint from 'jointjs';
import useModel from '../hook/useModel';
import useBattleFieldStore from '../store/battleFieldStore';
import { Box, Button } from '@mui/material';
import { default as DependencyOptionalN } from './icons/dep_optional_n'
import { default as DependencyOptional1 } from './icons/dep_optional_1'
import { default as DependencyMandatoryN } from './icons/dep_mandatory_n'
import { default as DependencyMandatory1 } from './icons/dep_mandatory_1'


const GraphEditor = () => {
  const modelId = useBattleFieldStore((state) => state.modelId);

  const { data: model } = useModel(modelId); // get the model data of the current game

  const containerRef = useRef(null);

  const nodes = model.content.uimodel.edg.nodes;
  const objectTypes = model.content.metamodel.objectTypes
  const smallestY = Math.min(...nodes.map((node) => node.position.y));
  const dependencies = model.content.metamodel.dependencies

  const [current_link, setCurrent_link] = useState('MANDATORY_1');
  const [graph, setGraph] = useState(null);
  const [paper, setPaper] = useState(null);

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

  const handleAttack = () => {
    console.log(graph.getLinks())
  }

  const setLinkAttr = (link, type) => {
    if (type === "MANDATORY_1" || type === "MANDATORY_N") {
      link.attr({
        line: {
          sourceMarker: {
            'type': 'path',
            'stroke': 'black',
            'stroke-width': 2,
            'fill': 'black',
            'd': 'M 0 -5 A 5 5 0 1 0 0 5 A 5 5 0 1 0 0 -5',
          },
        }
      });
    } else {
      link.attr({
        line: {
          sourceMarker: {
            'type': 'path',
            'stroke': 'black',
            'stroke-width': 2,
            'fill': 'white',
            'd': 'M 0 -5 A 5 5 0 1 0 0 5 A 5 5 0 1 0 0 -5',
          },
        }
      });
    }
    if (type === 'OPTIONAL_1' || type === 'MANDATORY_1') {
      link.attr({
        line: {
          targetMarker: {
            'stroke': 'none',
            'fill': 'none',
          },
        }
      });
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      const graph = new joint.dia.Graph();
      const paper = new joint.dia.Paper({
        el: containerRef.current,
        width: '100%',
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

          // Check for cycles before allowing the connection


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

      dependencies.forEach((dependency) => {
        const link = new joint.shapes.standard.Link({
          id: dependency.id,
          source: { id: NametoID(dependency.name.master) },
          target: { id: NametoID(dependency.name.dependent) },
          type: dependency.type,
        });
        setLinkAttr(link, dependency.type)
        graph.addCell(link);

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
          style={{ width: '100%' }}
          // disabled={true}
          onClick={handleAttack}
        >Attack</Button>
      </Box>
    </>

  )

};

export default GraphEditor;
