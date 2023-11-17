import React, { useEffect, useRef } from 'react';
import * as joint from 'jointjs';
import useModel from '../hook/useModel';
import useBattleFieldStore from '../store/battleFieldStore';
import { Box, Button } from '@mui/material';
import { default as DependencyOptionalN} from './icons/dep_mandatory_1'
import { default as DependencyOptional1} from './icons/dep_optional_1'
import { default as DependencyMandatoryN} from './icons/dep_mandatory_n'
import { default as DependencyMandatory1} from './icons/dep_mandatory_1'

const GraphEditor = () => {
  const modelId = useBattleFieldStore((state) => state.modelId);

  const { data: model } = useModel(modelId); // get the model data of the current game

  const containerRef = useRef(null);

  const links = model.content.uimodel.edg.links;
  const nodes = model.content.uimodel.edg.nodes;
  const objectTypes = model.content.metamodel.objectTypes
  const smallestY = Math.min(...nodes.map((node) => node.position.y));

  const OIDtoName = (id) => {
    const matching_obj = objectTypes.find((type) => type.id === id)
    return matching_obj.name
  }

  const handleButtonClicked = (linkType) => {
    // linkTypeRef.current = linkType;
    // linkCreationModeRef.current = true;
  };

  useEffect(() => {
    if (containerRef.current) {
      const graph = new joint.dia.Graph();
      const paper = new joint.dia.Paper({
        el: containerRef.current,
        width: '100%',
        height: '400',
        model: graph,
        gridSize: 10,
      });

      nodes.forEach((node) => {
        const newNode = new joint.shapes.basic.Rect({
          id: node.objectType,
          position: { x: node.position.x - 10, y: node.position.y - smallestY + 10 },
          size: { width: node.size.width, height: node.size.height },
          attrs: {
            text: { text: OIDtoName(node.objectType) },
          },
        });
        paper.model.addCell(newNode);
      });
    }
    
  }, []);

  return (
    <Box display="flex">
      <Box display="flex" flexDirection="column" >
        <Button style={{maxWidth: '30px', minWidth: '30px', margin: '0px', padding:'0px'}}><DependencyMandatory1/></Button>
        <Button style={{maxWidth: '30px', minWidth: '30px', margin: '0px', padding:'0px'}}><DependencyMandatoryN /></Button>
        <Button style={{maxWidth: '30px', minWidth: '30px', margin: '0px', padding:'0px'}}><DependencyOptional1 /></Button>
        <Button style={{maxWidth: '30px', minWidth: '30px', margin: '0px', padding:'0px'}}><DependencyOptionalN /></Button>
      </Box>
      <Box style={{ width: '100%', height: '37vh', overflow: 'auto' }}>
        <div ref={containerRef} />
      </Box>
    </Box>

  )

};

export default GraphEditor;
