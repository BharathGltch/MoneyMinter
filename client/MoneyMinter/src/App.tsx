import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import Video from './components/Video';
import Layout from './components/Layout';

function App() {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout/>}>
      <Route index element={<Home/>} />
      <Route path="/video" element={<Video/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
   
      
    
  )
}

export default App
