import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Board from './Pages/Board';
import NavBar from './components/NavBar';
import NotFoundPage from './Pages/ErrorPage'; 
import './App.css'

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boards" element={<Home />} />
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
