
import useAuthStore from '../authStore';
import AvailableGames from '../components/AvailableGames';

const HomePage = () => {
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    console.log("go to home. user:" + user.username + ".  token: " + token);     
      
      
    return <AvailableGames />;
}


export default HomePage;