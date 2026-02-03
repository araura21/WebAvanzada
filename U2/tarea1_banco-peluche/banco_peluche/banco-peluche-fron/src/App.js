import React, { useState } from 'react';
import './App.css';
import ClientesForm from './components/clientesForm';
import ClientesList from './components/clientesList';
import Estadisticas from './components/estadisticas';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleClienteGuardado = () => {
    setRefreshKey(oldKey => oldKey + 1);
    setSelectedClient(null);
  };

  const handleSeleccionarCliente = (cliente) => {
    setSelectedClient(cliente);
  };

  const handleCancelarEdicion = () => {
    setSelectedClient(null);
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
            <ClientesForm
              onClienteGuardado={handleClienteGuardado}
              selectedClient={selectedClient}
              onCancel={handleCancelarEdicion}
            />
          </div>

          <div className="list-section">
            <ClientesList
              key={`list-${refreshKey}`}
              onSeleccionarCliente={handleSeleccionarCliente}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


