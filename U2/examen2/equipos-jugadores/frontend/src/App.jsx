import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import EquiposPage from "./pages/EquiposPage";
import JugadoresPage from "./pages/JugadoresPage";
import "./App.css";

function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <div className="layout">
          <Routes>
            <Route path="/" element={<EquiposPage />} />
            <Route path="/jugadores/:equipoId" element={<JugadoresPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
