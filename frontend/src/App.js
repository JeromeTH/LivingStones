import LoginPanel from "./components/Login/Login"
import {Routes, Route} from "react-router-dom";
import Register from "./components/Register/Register"
import Home from "./components/Home/Home"
import CreateGame from "./components/CreateGame/CreateGame";
import Game from "./components/Game/Game";
import PrivateRoute from "./PrivateRoute";
import JoinGame from "./components/JoinGame/JoinGame";
import ActiveGames from "./components/ActiveGames/ActiveGames";
import EndedGames from "./components/EndedGames/EndedGames";
import reportWebVitals from "./reportWebVitals";
import Summary from "./components/Game/Summary";
import Profile from "components/Profile/Profile";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPanel/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="" element={<Home/>}/>
            <Route path="/active-games" element={<ActiveGames/>}/>
            <Route path="/ended-games" element={<EndedGames/>}/>

            {/*<Route path="/create-game" element={<CreateGame/>}/>*/}
            {/*<Route path="/game/:id" element={<Game/>}/>*/}
            {/*<Route path="/game/:id/join" element={<JoinGame/>}/>*/}
             <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <Profile/>
                    </PrivateRoute>
                }/>

            <Route
                path="/game/:id/summary"
                element={
                    <PrivateRoute>
                        <Summary/>
                    </PrivateRoute>
                }/>

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

reportWebVitals();
export default App;
