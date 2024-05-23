import LoginPanel from "./components/Login/Login"
import {Routes, Route} from "react-router-dom";
import Register from "./components/Register/Register"
import Home from "./components/Home/Home"
import CreateGame from "./components/CreateGame/CreateGame";
import Game from "./components/Game/Game";
import PrivateRoute from "./PrivateRoute";
import JoinGame from "./components/JoinGame/JoinGame";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPanel/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="" element={<Home/>}/>
            <Route
                path="/create-game"
                element={
                    <PrivateRoute>
                        <CreateGame/>
                    </PrivateRoute>
                }
            />

            <Route
                path="/game/:id"
                element={
                    <PrivateRoute>
                        <Game/>
                    </PrivateRoute>}
            />
            <Route
                path="/game/:id/join"
                element={
                    <PrivateRoute>
                        <JoinGame/>
                    </PrivateRoute>
                }
            />

        </Routes>
    );
}

export default App;
