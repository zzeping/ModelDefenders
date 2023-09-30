import useUser from "../hook/useUser";
import { TableCell } from '@mui/material';

const UserInfo = ({ userId }) => {
    const { data: user, isLoading, isError } = useUser(userId);
    if (isLoading) {
        return <TableCell>Loading...</TableCell>;
    }
    if (isError) {
        return <TableCell>Error loading user.</TableCell>;
    }
    if (!user) {
        return null;
    }
    return (
        <>
            <TableCell>{user.username}</TableCell>
        </>
    );
}

export default UserInfo;