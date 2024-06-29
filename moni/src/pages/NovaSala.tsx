import { Link, useNavigate } from "react-router-dom";
import logo1 from "../assets/images/logo_transparente.png";
import logo from "../assets/images/MONI.gif";
import { FormEvent, useState } from "react";
import "../styles/pagina-inicial.scss";
import { Button } from "../components/Button";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { database } from "../services/firebase";
import { set, ref, push } from "firebase/database";

export function NovaSala() {
  const { usuario } = useAutenticacao();
  const [novaSala, setNovaSala] = useState("");
  const navigate = useNavigate();

  async function CriarSala(event: FormEvent) {
    event.preventDefault();

    if (novaSala.trimEnd() === "") {
      return;
    }
    const SalaRef = ref(database, "salas");

    const novaSalaRef = push(SalaRef);
    const novaSalaKey = novaSalaRef.key;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const firebaseSala = set(novaSalaRef, {
      title: novaSala,
      author: usuario?.id,
    });

    navigate(`/salas/${novaSalaKey}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={logo1} alt="Logo" />
        <strong>Crie sua sala e tire dúvidas</strong>
        <p>Auxilie os alunos a entenderem os conteúdos</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logo} alt="MoniApp" />
          <h1>Bem-vindo {usuario?.nome}</h1>
          <h2>Criar uma nova Sala</h2>
          <form onSubmit={CriarSala}>
            <input
              type="text"
              placeholder="Nome da Sala"
              onChange={(event) => setNovaSala(event.target.value)}
              value={novaSala}
            />
            <Button type="submit">Crie a sala</Button>
          </form>
          <p>
            Quer entrar em uma Sala? <Link to="/">Clique</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
