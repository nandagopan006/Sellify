import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PublicOnlyRoute({children}) {

    const isAuthenticated =useSelector(
        (state)=> state.auth.isAuthenticated
    );

    if(isAuthenticated){
        return <Navigate to="/" replace />
    }
    return children

}
export default PublicOnlyRoute;