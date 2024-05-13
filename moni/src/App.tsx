import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AutenticacaoProvider } from "./contexts/AutenticacaoContext";
import { NovaSala } from "./pages/NovaSala";
import { PaginaInicial } from "./pages/PaginaInicial";
import { Sala } from "./pages/Sala";
import { AdminSala } from "./pages/AdminSala";
import { PerguntasDiscord } from "./pages/PerguntasDiscord";
function App() {
  return (
    <BrowserRouter>
      <AutenticacaoProvider>
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/salas/nova" element={<NovaSala />} />
          <Route path="/salas/:id" element={<Sala />} />
          <Route path="/admin/salas/:id" element={<AdminSala />} />
          <Route path="/discord/" element={<PerguntasDiscord />} />
        </Routes>
      </AutenticacaoProvider>
    </BrowserRouter>
  );
}
export default App;
