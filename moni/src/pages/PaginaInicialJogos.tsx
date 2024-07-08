import { useNavigate } from "react-router-dom";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
import { get, ref } from "firebase/database";
import logo1 from "../assets/images/select_gif.gif";
import logo from "../assets/images/select_2.png";
import { Button } from "../components/Button";
import "../styles/pagina-inicial-jogos.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function PaginaInicialJogos() {
  const navigate = useNavigate();
  const { usuario, signInWithGoogle } = useAutenticacao();
  const [codigoSala, setCodigoSala] = useState("");

  const notificacaoAlerta = () =>
    toast.warn("Sala Inexistente", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const notificacaoErro = () =>
    toast.error("Sala Finalizada", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const notificacaoInfo = () =>
    toast.info("Antes de clicar, escreva o código da sala", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const notificacaoSucesso = () =>
    toast.success("UHUUU, VAMOS LÁ", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  async function criarSala() {
    if (!usuario) {
      await signInWithGoogle();
    }
    navigate("/salas/novaSalaJogos");
  }

  async function entrarSala(event: FormEvent) {
    event.preventDefault();
    if (codigoSala.trim() === "") {
      notificacaoInfo();
      return;
    }

    const salaRef = await get(ref(database, `salas/${codigoSala}`));

    if (!salaRef.exists()) {
      notificacaoAlerta();
      return;
    }
    if (salaRef.val().endedAt) {
      notificacaoErro();
      return;
    }
    notificacaoSucesso();
    setTimeout(() => {
      navigate(`/salasJogos/${codigoSala}`);
    }, 3000);
  }

  return (
    <div id="page-auth-jogos">
      <aside>
        <img src={logo1} alt="Ilustração da logo" />
        <strong>Conecte com seus amigos e jogue!</strong>
        <p>Escolha uma sala ou crie a sua própria</p>
      </aside>
      <main>
        <ToastContainer />
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
