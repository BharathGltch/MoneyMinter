import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Video from './components/Video';
import Layout from './components/Layout';
import Login from "./components/Login";
import TestVideo from './components/TestVideo';

function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={<Home/>} />
      <Route path="/video/:videoId" element={<Video/>}/>
      <Route path="/login" element={<Login/>} />
      <Route path="/testVideo" element={<TestVideo/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
   
      
    
  )
}

export default App
