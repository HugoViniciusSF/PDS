import "../styles/salaReuniao.scss";
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

type Reuniao = {
  id: number;
  nome: string;
  imagemURL: string;
  descricao: string;
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

const tiposTopico = ["Noticia"];

export function SalaReuniao() {
  const { usuario, signInWithGoogle } = useAutenticacao();
  const params = useParams<SalaParams>();
  const salaId = params.id;

  const [reuniao, setReuniao] = useState<Reuniao[]>([]);
  const [titulo, setTitulo] = useState("");
  const [tipoTopico, setTipoTopico] = useState<string>("Noticia");
  const [topico, setTopico] = useState<string>("");
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState<string>("");
  const [filtroNoticias, setFiltroNoticias] = useState<string>("");

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
            const ReuniaoData = salaData.reuniao || {};
            const reuniaoArray: Reuniao[] = Object.entries(ReuniaoData).map(
              ([key, value]: [string, any]) => ({
                id: parseInt(key, 10),
                nome: value.nome,
                imagemURL: value.imagemURL,
                descricao: value.descricao,
              })
            );
            setTitulo(salaData.titulo);
            setReuniao(reuniaoArray);

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

  async function enviarReuniao(event: FormEvent) {
    event.preventDefault();
    if (topico.trim() === "") {
      return;
    }

    if (!usuario) {
      throw new Error("Você precisa estar logado");
    }

    try {
      console.log(`Fetching noticias for topico: ${topico}`);
      const response = await fetch(`http://localhost:3001/info/${topico}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar informações da noticia");
      }
      console.log(response);

      const data: Reuniao[] = await response.json();
      console.log("Noticias fetched from API:", data);

      const noticiasRef = ref(database, `salas/${salaId}/noticias`);
      const novasNoiticias: Reuniao[] = [];

      for (const noticiaData of data) {
        const novaNoticiaRef = push(noticiasRef);
        const novaNoticiaId = Date.now();
        const novaNoticia: Reuniao = {
          id: novaNoticiaId,
          nome: noticiaData.nome,
          imagemURL: noticiaData.imagemURL,
          descricao: noticiaData.descricao,
        };

        await set(novaNoticiaRef, novaNoticia);
        novasNoiticias.push(novaNoticia);
      }

      console.log("Novas noticias salvas no Firebase:", novasNoiticias);

      setReuniao((noticias) => [...noticias, ...novasNoiticias]);
      setTopico("");
    } catch (error) {
      console.error("Erro ao adicionar noticia:", error);
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
    <div id="pagina-sala-reuniao">
      <header>
        <div className="conteudo">
          <img src={Logo} alt="MoniApp" />
          <CodigoSala code={salaId ?? ""} />
        </div>
      </header>

      <main>
        <div className="conteudo-principal">
          <form onSubmit={enviarReuniao}>
            <div className="sala-titulo">
              <h1>Sala de Reuniao: {titulo}</h1>
              {reuniao.length > 0 && <span>{reuniao.length} noticias</span>}
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
              placeholder={`Digite o ${tipoTopico.toLowerCase()} da noticia`}
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
                  Para adicionar uma noticia,{" "}
                  <button type="button" onClick={fazerLogin}>
                    faça seu login
                  </button>
                </span>
              )}
              <Button type="submit" disabled={!usuario}>
                Adicionar noticia
              </Button>
            </div>
          </form>

          <input
            type="text"
            className="barra-pesquisa"
            placeholder="Pesquisar noticias"
            value={filtroNoticias}
            onChange={(event) => setFiltroNoticias(event.target.value)}
          />

          <div className="reuniao-lista">
            {reuniao
              .filter((noticia) =>
                noticia.nome
                  .toLowerCase()
                  .includes(filtroNoticias.toLowerCase())
              )
              .map((noticia) => (
                <div key={noticia.id} className="reuniao">
                  <h3>{noticia.nome}</h3>
                  <img src={noticia.imagemURL} alt={noticia.nome} />
                  <p>{noticia.descricao}</p>
                  <div className="adicionado-por"></div>
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
