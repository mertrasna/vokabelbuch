import { BrowserRouter, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage.jsx';
import MyListPage from './pages/MyListPage.jsx';
import PlayPage from './pages/PlayPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import RegisterPage from './pages/Register.jsx';


function App() {

  return (
    <BrowserRouter>
      <Routes>
         <Route path='/' element={<LandingPage />} />
         <Route path='/register' element={<RegisterPage />} />
         <Route path='/welcome' element={<WelcomePage />} />
         <Route path='/my-list' element={<MyListPage />} />
         <Route path='/play' element={<PlayPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
