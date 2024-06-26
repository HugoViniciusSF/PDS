import { Link, useNavigate } from "react-router-dom";
import logo1 from "../assets/images/logo_transparente.png";
import logo from "../assets/images/logo.png";
import { FormEvent, useState } from "react";
import "../styles/pagina-inicial.scss";
import { Button } from "../components/Button";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { database } from "../services/firebase";
import { set, ref, push } from "firebase/database";

export function NovaSalaJogos() {
  const { usuario } = useAutenticacao();
  const [novaSala, setNovaSala] = useState("");
  const [genero, setGenero] = useState("");
  const [plataforma, setPlataforma] = useState("");
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
      genero: genero,
      plataforma: plataforma,
    });

    navigate(`/salasJogos/${novaSalaKey}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={logo1} alt="Logo" />
        <strong>Crie sua sala e jogue!</strong>
        <p>Escolha o gênero e a plataforma dos jogos</p>{" "}
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
            <input
              type="text"
              placeholder="Gênero dos jogos"
              onChange={(event) => setGenero(event.target.value)}
              value={genero}
            />
            <input
              type="text"
              placeholder="Plataforma dos jogos"
              onChange={(event) => setPlataforma(event.target.value)}
              value={plataforma}
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
