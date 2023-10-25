import { Dialog, Button, List, DialogTitle, ListItem, DialogActions, ListItemText } from '@mui/material';
import React from 'react';



const changeObject = ({ open, objs, handleObj, handleClose}) => {

    return (
        <>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select objetcs</DialogTitle>
                <List sx={{ width: '100%', minWidth: 250 }} dense>
                    {objs&&objs.map((obj,index) => (
                        <ListItem key={index} secondaryAction={<Button variant="contained" size="small"
                            onClick={handleObj} value={obj?.objName||''}>Select</Button>}>
                            <ListItemText
                                primary={obj?.objName||''}
                            />
                        </ListItem>
                    ))}
                </List>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

export default changeObject;