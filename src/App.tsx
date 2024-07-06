// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';
import RepositoriesList from './pages/RepositoriesList';
import RepositoryDetail from './pages/RepositoryDetail';
import { Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<RepositoriesList />} />
        <Route path="/repository/:id" element={<RepositoryDetail />} />
      </Routes>
    </>
  );
};

export default App;
