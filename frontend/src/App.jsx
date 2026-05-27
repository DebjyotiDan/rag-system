import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/landing";
import Login from "./pages/login";
import SignUp from "./pages/signUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
