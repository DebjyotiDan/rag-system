import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signUp";
import Dashboard from "./pages/dashboard";
import Upload from "./pages/upload";
import ChatPage from "./pages/chatPage";


function App() {

    return (
        <BrowserRouter>

            <Routes>
                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />
                <Route
                    path="/logout"
                    element={<Landing />}
                />

                <Route
                    path="/upload"
                    element={<Upload />}
                />

                <Route
                    path="/chat"
                    element={<ChatPage />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;