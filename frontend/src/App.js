import LoginPanel from "./components/Login/Login"
import {Routes, Route} from "react-router-dom";
import Register from "./components/Register/Register"
import Home from "./components/Home/Home"
import CreateGame from "./components/CreateGame/CreateGame";
function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPanel/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="" element={<Home/>}/>
            <Route path="/create-game" element={<CreateGame/>}/>
        </Routes>
    );
}

export default App;
