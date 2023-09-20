
import useAuthStore from '../authStore';


const HomePage = () => {
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);

    console.log("go to home. user:" + user.username + ".  token: " + token);     
      
      
    return <h2>Model Defenders: A Mutation Testing Game for Model-Driven Engineering</h2>;
}


export default HomePage;