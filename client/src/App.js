
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { Home } from './components/Home/Home';
import {Settings} from "./components/Settings/Settings";
import { EditComposition } from './components/EditComposition/EditComposition';
import Cookies from 'universal-cookie';

export const cookies = new Cookies();

function App() {
  return (
    <div className="App">
                <BrowserRouter>
                  <Routes>
                      <Route path="/" element={<Login/>} />
                      <Route path="/register" element={<Register/>} /> 
                      <Route path="/home" element={<Home/>} />
                      <Route path="/settings" element={<Settings/>} />
                      <Route path="/editComposition/:songId" element={<EditComposition/>} />
                  </Routes>
                </BrowserRouter>
    </div>
  );
}

export default App;
