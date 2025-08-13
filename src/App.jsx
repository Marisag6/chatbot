import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ChatBot from "./pages/ChatBot";

function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Mi Portafolio</h1>
      <Link to="/chatbot" className="text-blue-500 underline">
        Ir al ChatBot
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<ChatBot />} />
      </Routes>
    </Router>
  );
}

export default App;
