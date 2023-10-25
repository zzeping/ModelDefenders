import { Dialog, Button, List, DialogTitle, ListItem, DialogActions, ListItemText } from '@mui/material';
import React from 'react';

const AddEvent = ({ events, open, setOpen, handleAddEvent }) => {

    const handleClose = () => {
        setOpen(false)
    }


    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>List of events</DialogTitle>
                <List sx={{ width: '100%', minWidth: 400 }} dense>
                    {events&&events.map((event) => (
                        <ListItem key={event.id} secondaryAction={<Button variant="contained" size="small"
                            onClick={handleAddEvent} value={event.id}>Add</Button>}>
                            <ListItemText
                                primary={event.name}
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

export default AddEvent;