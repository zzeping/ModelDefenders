import { Dialog, Button, Box, DialogTitle, FormControl, InputLabel, MenuItem, Select, DialogContentText, DialogContent, DialogActions, TextField } from '@mui/material';
import React, { useState } from 'react';
import useAddModel from '../hook/useAddModel';
import useAuthStore from '../store/authStore';


const CreateModel = () => {

    const [open, setOpen] = useState(false);
    const [modelname, setModelname] = useState('');
    const [MXP, setMXP] = useState('');
    const [image, setImage] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [type, setType] = useState('');
    const { handleAddModel, isAdding, error } = useAddModel();
    const user = useAuthStore((state) => state.user);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setImage('');
        setDifficulty('');
        setMXP('');
        setModelname('');
        setType('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('MXP', MXP[0]);
        formData.append('image', image[0]);
        formData.append('name', modelname);
        formData.append('type', type);
        formData.append('difficulty', difficulty);
        formData.append('ownerId', user.id);
        try {
            const newModel = await handleAddModel(formData)
            console.log(newModel)
        } catch (error) {
            console.error('Axios error:', error);
        }
        handleClose();
    }

    return (
        <>
            <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <Button
                    color="primary"
                    variant="contained"
                    style={{ width: '100%' }}
                    onClick={handleClickOpen}
                >Upload Model</Button>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Upload Model</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            variant="standard"
                            required
                            id="modelname"
                            label="Model name"
                            value={modelname}
                            fullWidth
                            onChange={(e) => setModelname(e.target.value)}
                            margin="dense"
                            size='small'

                        />
                        <FormControl fullWidth variant="standard" margin="dense" size="small">
                            <InputLabel id="difficulty-label">Difficulty</InputLabel>
                            <Select
                                labelId="difficulty-label"
                                id="difficulty"
                                value={difficulty}
                                label="Difficulty"
                                onChange={(e) => setDifficulty(e.target.value)}
                                required
                            >
                                <MenuItem value={'Easy'}>Easy</MenuItem>
                                <MenuItem value={'Intermediate'}>Intermediate</MenuItem>
                                <MenuItem value={'Advanced'}>Advanced</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth variant="standard" margin="dense" size="small">
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                                labelId="type-label"
                                id="type"
                                value={type}
                                label="Type"
                                onChange={(e) => setType(e.target.value)}
                                required
                            >
                                <MenuItem value={'EDG'}>EDG</MenuItem>
                                <MenuItem value={'FSM'}>FSM</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            id="upload_file"
                            variant="standard"
                            fullWidth
                            type="file"
                            label="MXP file"
                            margin="dense"
                            required
                            onChange={(e) => setMXP(e.target.files)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                accept: ".mxp"
                            }}
                        />
                        <TextField
                            id="upload_image"
                            variant="standard"
                            fullWidth
                            required
                            type="file"
                            label="Model image"
                            margin="dense"
                            value={image.name}
                            onChange={(e) => setImage(e.target.files)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                accept: "image/*",
                            }}
                        />
                        {error && <div>Error: {error.message}</div>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">{isAdding ? 'Adding...' : 'Submit'}</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );

}

export default CreateModel;