import { useNavigate } from "react-router-dom";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
import { get, ref } from "firebase/database";
import logo1 from "../assets/images/logo_transparente.png";
import logo from "../assets/images/logo.png";
import { Button } from "../components/Button";
import "../styles/pagina-inicial.scss";
export function PaginaInicial() {
  const navigate = useNavigate();
  const { usuario, signInWithGoogle } = useAutenticacao();
  const [codigoSala, setCodigoSala] = useState("");

  async function criarSala() {
    if (!usuario) {
      await signInWithGoogle();
    }

    navigate("/salas/nova");
  }

  async function entrarSala(event: FormEvent) {
    event.preventDefault();
    if (codigoSala.trim() === "") {
      return;
    }

    const salaRef = await get(ref(database, `salas/${codigoSala}`));

    if (!salaRef.exists()) {
      alert("Sala inexistente");
      return;
    }
    if (salaRef.val().endedAt) {
      alert("Room already closed.");
      return;
    }
    navigate(`/salas/${codigoSala}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={logo1} alt="Ilustração da logo" />
        <strong>Conecte com seus alunos</strong>
        <p>Tire as dúvidas dos estudantes</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="MoniApp" />
          <form onSubmit={entrarSala}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setCodigoSala(event.target.value)}
              value={codigoSala}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
          <div className="separator">ou crie sua sala</div>
          <button onClick={criarSala} className="create-room">
            Crie sua sala com o Google
          </button>
        </div>
      </main>
    </div>
  );
}
