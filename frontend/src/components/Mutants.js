import React, { useState, useRef } from 'react';
import useGameMutants from '../hook/useMutants';
import { List, ListItem, Dialog, DialogTitle, Box, DialogActions, ListItemText, Button, Chip } from '@mui/material';
import * as joint from 'jointjs';
import useBattleFieldStore from '../store/battleFieldStore';




const Mutants = () => {

    const { data: mutants } = useGameMutants();
    const [open_mutant, setOpenMutant] = useState(false); // mutant view dialog
    const containerRef = useRef(null);
    const role = useBattleFieldStore((state) => state.role);



    const handelMutantView = (e) => {
        const mutant = mutants.find((mutant) => mutant.id === e.target.value)
        const nodes = mutant.MXP.nodes;
        const dependencies = mutant.MXP.dependencies;
        const graph = new joint.dia.Graph();
        const smallestY = Math.min(...nodes.map((node) => node.position.y));

        // Delay the creation of Paper to ensure that containerRef.current is accessible
        setTimeout(() => {
            const paper = new joint.dia.Paper({
                el: containerRef.current,
                width: 1200,
                height: 370,
                model: graph,
                gridSize: 10,
                interactive: false,
            });
            nodes.forEach((node) => {
                const newNode = new joint.shapes.standard.Rectangle({
                    id: node.objectType,
                    position: { x: node.position.x - 10, y: node.position.y - smallestY + 10 },
                    size: node.size,
                    attrs: {
                        label: { text: node.name },
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
                    setLinkAttr(link, type);
                    graph.addCell(link);
                }

            });
        }, 0);
        setOpenMutant(true)
    }

    const handleMutantClose = () => {
        setOpenMutant(false)
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



    return (
        <>
            <List style={{ paddingTop: '0px' }}>
                {mutants && mutants.map((mutant, index) => (
                    <ListItem key={mutant.id} style={{ height: '20px', borderBottom: '1px solid #ccc', }} secondaryAction={<>
                        {(mutant.state === "alive" && role === "defender") || (mutant.state === "dead" && role === "attacker") ?
                            <Chip label={mutant.state} style={{ height: '18px', fontSize: '12px', borderRadius: '4px', color: 'white', background: 'red' }} /> :
                            <Chip label={mutant.state} style={{ height: '18px', fontSize: '12px', borderRadius: '4px', color: 'white', background: 'green' }} />}
                        {'\u00A0'}
                        <Button value={mutant.id} variant="contained" style={{ height: '18px', fontSize: '10px' }} onClick={handelMutantView}>View</Button>
                        {'\u00A0'}
                        <Button value={mutant.id} variant="contained" style={{ height: '18px', fontSize: '10px', }} disabled={true}>View killing test</Button>
                    </>
                    }>
                        <ListItemText primaryTypographyProps={{ style: { fontSize: '12px' } }} primary={`Mutant: ${index + 1} ${'\u00A0'}${'\u00A0'}${'\u00A0'}Changes: ${mutant.MXP.changes} ${'\u00A0'}${'\u00A0'}${'\u00A0'}Associations: ${mutant.MXP.dependencies.length}`} />
                    </ListItem>
                ))}
            </List>
            <Dialog open={open_mutant} onClose={handleMutantClose}>
                <DialogTitle>Mutant overview</DialogTitle>
                <Box style={{ width: '70vh', height: '100%', overflow: 'auto' }}>
                    <div ref={containerRef} />
                </Box>

                <DialogActions>
                    <Button onClick={handleMutantClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

export default Mutants;