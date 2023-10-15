import useModel from "../hook/useModel";
import { TableCell } from '@mui/material';


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
            <img src={`/image/${model.image}`} alt="Model" />
        </>
    );
}

export default ModelImage;