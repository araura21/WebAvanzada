import React, { useState } from 'react';
import './App.css';
import ClientesForm from './components/clientesForm';
import ClientesList from './components/clientesList';
import Estadisticas from './components/estadisticas';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClienteGuardado = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Banco Bandido de Peluche</h1>
      </header>

      <div className="container">
        <Estadisticas key={`stats-${refreshKey}`} />

        <div className="content-wrapper" style={{ marginTop: '30px' }}>
          <div className="form-section">
            <ClientesForm onClienteGuardado={handleClienteGuardado} />
          </div>

          <div className="list-section">
            <ClientesList key={`list-${refreshKey}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


