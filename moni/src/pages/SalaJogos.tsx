import "../styles/salaJogos.scss";
import { useParams } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import { Button } from "../components/Button";
import { CodigoSala } from "../components/CodigoSala";
import { FormEvent, useEffect, useState } from "react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { database } from "../services/firebase";
import {
  ref,
  push,
  DatabaseReference,
  DataSnapshot,
  onValue,
  off,
  set,
} from "firebase/database";

type Jogo = {
  id: number;
  nome: string;
  imagemURL: string;
  descricao: string;
  generos: string | null;
  plataformas: string | null;
};

type Mensagem = {
  id: string;
  conteudo: string;
  autor: {
    nome: string;
    avatar: string;
  };
};

type SalaParams = {
  id: string;
};

const tiposTopico = ["Nome", "Plataforma", "Gênero"];

export function SalaJogos() {
  const { usuario, signInWithGoogle } = useAutenticacao();
  const params = useParams<SalaParams>();
  const salaId = params.id;

  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [titulo, setTitulo] = useState("");
  const [tipoTopico, setTipoTopico] = useState<string>("Nome");
  const [topico, setTopico] = useState<string>("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState<string>("");
  const [filtroJogos, setFiltroJogos] = useState<string>("");

  async function fazerLogin() {
    if (!usuario) {
      await signInWithGoogle();
    }
  }

  useEffect(() => {
    const salaRef: DatabaseReference = ref(database, `salas/${salaId}`);

    const fetchData = () => {
      const listener = onValue(
        salaRef,
        (snapshot: DataSnapshot) => {
          const salaData = snapshot.val();
          if (salaData) {
            const jogosData = salaData.jogos || {};
            const jogosArray: Jogo[] = Object.entries(jogosData).map(
              ([key, value]: [string, any]) => ({
                id: parseInt(key, 10), // Convertendo key para number
                nome: value.nome,
                imagemURL: value.imagemURL,
                descricao: value.descricao,
                generos: value.generos,
                plataformas: value.plataformas,
              })
            );
            setTitulo(salaData.titulo);
            setJogos(jogosArray);

            const mensagensData = salaData.mensagens || {};
            const mensagensArray: Mensagem[] = Object.entries(
              mensagensData
            ).map(([key, value]: [string, any]) => ({
              id: key,
              conteudo: value.conteudo,
              autor: value.autor,
            }));
            setMensagens(mensagensArray);
          }
        },
        {
          onlyOnce: false,
        }
      );

      return () => {
        off(salaRef, "value", listener);
      };
    };

    fetchData();
  }, [salaId]);

  async function enviarJogo(event: FormEvent) {
    event.preventDefault();
    if (topico.trim() === "") {
      return;
    }

    if (!usuario) {
      throw new Error("Você precisa estar logado");
    }

    try {
      console.log(`Fetching jogos for topico: ${topico}`);
      const response = await fetch(`http://localhost:3001/info/${topico}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar informações do jogo");
      }

      const data: Jogo[] = await response.json();
      console.log("Jogos fetched from API:", data);

      const jogosRef = ref(database, `salas/${salaId}/jogos`);
      const novosJogos: Jogo[] = [];

      for (const jogoData of data) {
        const novoJogoRef = push(jogosRef);
        const novoJogoId = Date.now();
        const novoJogo: Jogo = {
          id: novoJogoId,
          nome: jogoData.nome,
          imagemURL: jogoData.imagemURL,
          descricao: jogoData.descricao,
          generos: jogoData.generos || null,
          plataformas: jogoData.plataformas || null,
        };

        await set(novoJogoRef, novoJogo);
        novosJogos.push(novoJogo);
      }

      console.log("Novos jogos salvos no Firebase:", novosJogos);

      setJogos((jogos) => [...jogos, ...novosJogos]);
      setTopico("");
    } catch (error) {
      console.error("Erro ao adicionar jogo:", error);
    }
  }

  async function enviarMensagem(event: FormEvent) {
    event.preventDefault();
    if (novaMensagem.trim() === "") {
      return;
    }

    if (!usuario) {
      throw new Error("Você precisa estar logado");
    }

    const mensagem: Mensagem = {
      id: Date.now().toString(),
      conteudo: novaMensagem,
      autor: {
        nome: usuario.nome,
        avatar: usuario.avatar,
      },
    };

    const mensagensRef = ref(database, `salas/${salaId}/mensagens`);
    const novaMensagemRef = push(mensagensRef);

    await set(novaMensagemRef, mensagem);

    setNovaMensagem("");
  }

  return (
    <div id="pagina-sala-jogos">
      <header>
        <div className="conteudo">
          <img src={Logo} alt="MoniApp" />
          <CodigoSala code={salaId ?? ""} />
        </div>
      </header>

      <main>
        <div className="conteudo-principal">
          <form onSubmit={enviarJogo}>
            <div className="sala-titulo">
              <h1>Sala de Jogos: {titulo}</h1>
              {jogos.length > 0 && <span>{jogos.length} jogos</span>}
            </div>

            <div className="select-topico">
              <select
                value={tipoTopico}
                onChange={(event) => setTipoTopico(event.target.value)}
              >
                {tiposTopico.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              placeholder={`Digite o ${tipoTopico.toLowerCase()} do jogo`}
              onChange={(event) => setTopico(event.target.value)}
              value={topico}
            />

            <div className="form-rodape">
              {usuario ? (
                <div className="usuario-info">
                  <img src={usuario.avatar} alt={usuario.nome} />
                  <span>{usuario.nome}</span>
                </div>
              ) : (
                <span>
                  Para adicionar um jogo,{" "}
                  <button type="button" onClick={fazerLogin}>
                    faça seu login
                  </button>
                </span>
              )}
              <Button type="submit" disabled={!usuario}>
                Adicionar jogo
              </Button>
            </div>
          </form>

          <input
            type="text"
            className="barra-pesquisa"
            placeholder="Pesquisar jogos"
            value={filtroJogos}
            onChange={(event) => setFiltroJogos(event.target.value)}
          />

          <div className="jogos-lista">
            {jogos
              .filter((jogo) =>
                jogo.nome.toLowerCase().includes(filtroJogos.toLowerCase())
              )
              .map((jogo) => (
                <div key={jogo.id} className="jogo">
                  <h3>{jogo.nome}</h3>
                  <img src={jogo.imagemURL} alt={jogo.nome} />
                  <p>{jogo.descricao}</p>
                  <div className="adicionado-por">
                    <span>Plataformas: {jogo.plataformas}</span>
                    <span>Gêneros: {jogo.generos}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="chat">
          <form onSubmit={enviarMensagem}>
            <textarea
              placeholder="Digite sua mensagem"
              onChange={(event) => setNovaMensagem(event.target.value)}
              value={novaMensagem}
            />
            <Button type="submit" disabled={!usuario}>
              Enviar mensagem
            </Button>
          </form>

          <div className="mensagens-lista">
            {mensagens.map((mensagem) => (
              <div key={mensagem.id} className="mensagem">
                <img src={mensagem.autor.avatar} alt={mensagem.autor.nome} />
                <div>
                  <span>{mensagem.autor.nome}</span>
                  <p>{mensagem.conteudo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
