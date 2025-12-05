import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Main from "./components/Main";
import TodoAi from "./components/TodoAi";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/aiAgent" element={<TodoAi />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
