import useModel from "../hook/useModel";
import { TableCell } from '@mui/material';


const ModelInfo = ({ modelId, selectedGame, changeImage, gameId }) => {
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

    if (selectedGame == gameId) {
        changeImage(model.image)
    }
    return (
        <>
            <TableCell>{model.name}</TableCell>
            <TableCell>{model.type}</TableCell>
        </>
    );
}

export default ModelInfo;