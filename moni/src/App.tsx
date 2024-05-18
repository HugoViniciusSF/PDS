import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AutenticacaoProvider } from "./contexts/AutenticacaoContext";
import { NovaSala } from "./pages/NovaSala";
import { PaginaInicial } from "./pages/PaginaInicial";
import { Sala } from "./pages/Sala";
import { AdminSala } from "./pages/AdminSala";
import { PerguntasDiscord } from "./pages/PerguntasDiscord";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
function App() {
  return (
    <BrowserRouter>
      <AutenticacaoProvider>
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/salas/nova" element={<NovaSala />} />
          <Route path="/salas/:id" element={<Sala />} />
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
