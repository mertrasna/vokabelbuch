import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import PlayPage from './pages/PlayPage.jsx';


function App() {

  return (
    <BrowserRouter>
      <Routes>
         <Route path='/' element={<WelcomePage />} />
         <Route path='/my-list' element={<MyListPage />} />
         <Route path='/play' element={<PlayPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
