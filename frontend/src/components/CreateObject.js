import { Dialog, Button, List, DialogTitle, ListItem, MenuItem, Select, DialogActions, ListItemText, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { styled } from '@mui/material/styles';


import React, { useState } from 'react';

const SmallDatePicker = styled(DatePicker)`
& input {
    height: 10px; // Adjust the height as needed to make the input area smaller
  }
  width: 150px;
  float: right; 
`;

const CreateObject = ({ inputValues, setInputValues, handleClose, chosenMasters, setChosenMasters, handleSubmit, attributes, open, masters }) => {

    const handleAttributeChange = (attributeId, value) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [attributeId]: value,
        }));
    }

    const handleChooseMaster = (name, value) => {
        setChosenMasters((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }    
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Select attributes</DialogTitle>
                    <List sx={{ width: '100%', minWidth: 250 }} dense>
                        {/* {attributes && attributes.map((attribute) => (
                            <ListItem key={attribute.id}>
                                <ListItemText
                                    primary={attribute.name}
                                />
                                {attribute.type==="Date/Time" ? <SmallDatePicker value={inputValues[attribute.id]|| null} onChange={(date) => handleAttributeChange(attribute.id,date)} size="small" /> : 
                                <TextField value={inputValues[attribute.id]|| ''} onChange={(e) => handleAttributeChange(attribute.id, e.target.value)} variant="outlined" style={{width: '150px'}} size="small" />}
                            </ListItem>
                        ))}
                        {attributes && (attributes.length === 0) && */}
                        <ListItem><ListItemText primary="Name:" /> <TextField value={inputValues['name'] || ''} onChange={(e) => handleAttributeChange('name', e.target.value)} variant="outlined" style={{ width: '150px' }} size="small" /></ListItem>
                        {masters && masters.map((master, index) => (
                            <ListItem key={index}><ListItemText primary={master.name} /> 
                            <Select
                            size="small"
                            value={chosenMasters[master.name] || ''}
                            onChange={(e)=>handleChooseMaster(master.name,e.target.value)}
                          >
                            {master.objs&&(master.objs.length!==0)&&master.objs.map((obj,objIndex) => (
                              <MenuItem key={objIndex} value={obj?.objName || ''}>
                                {obj?.objName || ''}
                              </MenuItem>
                            ))}
                          </Select> </ListItem>

                        ))}
                        {/* }  */}
                    </List>
                    <DialogActions>
                        <Button onClick={handleClose}>Close</Button>
                        <Button onClick={handleSubmit}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </LocalizationProvider>
        </>
    )

}

export default CreateObject;