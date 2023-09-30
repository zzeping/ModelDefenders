import useModel from "../hook/useModel";
import { TableCell } from '@mui/material';


const ModelInfo = ({ modelId }) => {
    const { data: model, isLoading, isError } = useModel(modelId);
    if (isLoading) {
        return <TableCell>Loading...</TableCell>;
    }
    if (isError) {
        return <TableCell>Error loading model.</TableCell>;
    }
    if (!model) {
        return null;
    }

    return (
        <>
            <TableCell>{model.name}</TableCell>
            <TableCell>{model.type}</TableCell>
        </>
    );
}

export default ModelInfo;