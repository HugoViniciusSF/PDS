import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AutenticacaoProvider } from "./contexts/Autenticacao";
import { NovaSala } from "./pages/NovaSala";
import { PaginaInicial } from "./pages/PaginaInicial";
import { Sala } from "./pages/Sala";

export default function App() {
  return (
    <BrowserRouter>
      <AutenticacaoProvider>
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/rooms/new" element={<NovaSala />} />
          <Route path="/rooms/:id" element={<Sala />} />
        </Routes>
      </AutenticacaoProvider>
    </BrowserRouter>
  );
}
