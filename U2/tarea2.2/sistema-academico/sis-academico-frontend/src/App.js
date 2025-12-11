import './App.css';
import { useState, useEffect } from 'react';
import Estudiantes from './pages/estudiantes';
import Login2 from './pages/login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay token en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="App">
      {isAuthenticated ? (
        <div>
          <Estudiantes onLogout={handleLogout} />
        </div>
      ) : (
        <Login2 onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
