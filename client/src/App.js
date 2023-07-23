
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';

function App() {
  return (
    <div className="App">
                <BrowserRouter>
                  <Routes>
                      <Route path="/" element={<Login/>} />
                      <Route path="/register" element={<Register/>} /> 
                      {/* <Route path="/home" element={<Home/>} />
                      <Route path="/page2" element={<Project />} /> 
                      <Route path="/page3" element={<Play/>} />  */}
                  </Routes>
                </BrowserRouter>
    </div>
  );
}

export default App;
