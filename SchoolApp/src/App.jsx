import './App.css'
import { Routes, Route} from 'react-router-dom';
import LoginPage from './Pages/LoginPage';
import AdminPage from './Pages/AdminPage';
import StudentPage from './Pages/StudentPage';

function App() {

  return (
    <Routes>
     <Route path="/" element={<LoginPage/>} />  
     <Route path="/adminPage" element={<AdminPage/>} />
     <Route path="/studentPage" element ={<StudentPage/>} />
    </Routes>
  )
}

export default App
