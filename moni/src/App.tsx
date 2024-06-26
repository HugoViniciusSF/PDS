import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AutenticacaoProvider } from "./contexts/AutenticacaoContext";
import { NovaSala } from "./pages/NovaSala";
import { PaginaInicial } from "./pages/PaginaInicial";
import { Sala } from "./pages/Sala";
import { AdminSala } from "./pages/AdminSala";
import { PerguntasDiscord } from "./pages/PerguntasDiscord";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import { EscolhaSistema } from "./pages/EscolhaSistema";
import { PaginaInicialJogos } from "./pages/PaginaInicialJogos";
import { NovaSalaJogos } from "./pages/NovaSalaJogos";
import { SalaJogos } from "./pages/SalaJogos";
function App() {
  return (
    <BrowserRouter>
      <AutenticacaoProvider>
        <Routes>
          <Route path="/" element={<EscolhaSistema />} />
          <Route path="/jogos" element={<PaginaInicialJogos />} />
          <Route path="/moniapp" element={<PaginaInicial />} />
          <Route path="/salas/nova" element={<NovaSala />} />
          <Route path="/salas/novaSalaJogos" element={<NovaSalaJogos />} />
          <Route path="/salas/:id" element={<Sala />} />
          <Route path="/salasJogos/:id" element={<SalaJogos />} />
          <Route path="/admin/salas/:id" element={<AdminSala />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="overview" element={<Dashboard />} />
            <Route path="discord" element={<PerguntasDiscord />} />
          </Route>
        </Routes>
      </AutenticacaoProvider>
    </BrowserRouter>
  );
}
export default App;
