import useModel from "../hook/useModel";
import { Typography, Box } from '@mui/material';


const ModelImage = ({ modelId }) => {
    const { data: model, isLoading, isError } = useModel(modelId);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError) {
        return <div>Error loading model.</div>;
    }
    if (!model) {
        return null;
    }

    return (
        <>
            <Typography variant="body2" style={{ background: "#eeeeee", marginBottom: "5px", borderRadius: '6px', paddingLeft: '10px' }}>{model.type}</Typography>
            <Box style={{ overflow: 'auto', height: '33vh', display: 'flex', justifyContent: 'center', marginBottom: '25px', marginTop: '10px' }}>
                <img src={`/image/${model.image}`} alt="Model" />
            </Box>
        </>
    );
}

export default ModelImage;