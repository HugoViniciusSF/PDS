import "../styles/sala.scss";
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
  set,
  onValue,
  off,
  DatabaseReference,
  DataSnapshot,
} from "firebase/database";
import { Questao } from "../components/Questao";

type FirebaseQuestion = {
  [key: string]: {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
    likes: Record<string, { authorId: string }>;
    resposta?: string;
    respostas?: {
      [key: string]: {
        author: {
          name: string;
          avatar: string;
        };
        resposta: string;
      };
    };
  };
};

// eslint-disable-next-line @typescript-eslint/no-redeclare
type Questao = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
  resposta?: string;
  respostas?: {
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    resposta: string;
  }[];
};

type SalaParams = {
  id: string;
};

export function Sala() {
  const { usuario, signInWithGoogle } = useAutenticacao();
  const params = useParams<SalaParams>();

  const [novaQuestao, setNovaQuestao] = useState("");
  const [respostasEmEdicao, setRespostasEmEdicao] = useState<{
    [key: string]: string;
  }>({});
  const salaId = params.id;
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [titulo, setTitulo] = useState("");

  async function fazerLogin() {
    if (!usuario) {
      await signInWithGoogle();
    }
  }

  useEffect(() => {
    const salaRef: DatabaseReference = ref(database, `salas/${salaId}`);

    const fetchData = () => {
      onValue(
        salaRef,
        (snapshot: DataSnapshot) => {
          const salaData = snapshot.val();
          if (salaData) {
            const firebaseQuestions: FirebaseQuestion = salaData.questoes || {};
            const questoesAnalisadas = Object.entries(firebaseQuestions).map(
              ([key, value]) => {
                const likes = value.likes ?? {};
                return {
                  id: key,
                  content: value.content,
                  author: value.author,
                  isAnswered: value.isAnswered,
                  isHighlighted: value.isHighlighted,
                  likeCount: Object.values(likes).length,
                  likeId: Object.entries(likes).find(
                    ([, like]) => like.authorId === usuario?.id
                  )?.[0],
                  resposta: value.resposta, // Adicionando resposta à Questão
                  respostas: value.respostas
                    ? Object.entries(value.respostas).map(
                        ([respostaKey, respostaValue]) => ({
                          id: respostaKey,
                          ...respostaValue,
                        })
                      )
                    : [],
                };
              }
            );
            setTitulo(salaData.title);
            setQuestoes(questoesAnalisadas);
          }
        },
        {
          onlyOnce: false,
        }
      );
    };

    fetchData();

    return () => {
      off(salaRef);
    };
  }, [salaId, usuario]);

  async function enviarQuestao(event: FormEvent) {
    event.preventDefault();
    if (novaQuestao.trim() === "") {
      return;
    }

    if (!usuario) {
      throw new Error("Você precisa estar logado");
    }

    const questao = {
      content: novaQuestao,
      author: {
        name: usuario.nome,
        avatar: usuario?.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
      likes: {},
    };

    const questaoRef = ref(database, `salas/${salaId}/questoes`);
    const newQuestaoRef = push(questaoRef);
    await set(newQuestaoRef, questao);
    const questaoId = newQuestaoRef.key;
    setNovaQuestao("");

    const objeto = JSON.stringify({
      id: questaoId,
      nome: usuario.nome,
      fotoURL: usuario?.avatar,
      descricao: novaQuestao,
      respondido: false,
      prioridade: false,
    });

    // Conexão com o backend usando fetch
    fetch("http://localhost:3001/questoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: objeto,
    });
  }

  async function LikeQuestao(questaoId: string, likeId: string | undefined) {
    if (!usuario) {
      throw new Error("Você precisa estar logado");
    }

    const questaoLikesRef = ref(
      database,
      `salas/${salaId}/questoes/${questaoId}/likes`
    );

    if (likeId) {
      // Se o usuário já deu like, não pode mais mudar
    } else {
      // Se o usuário ainda não deu like, adiciona o like
      await push(questaoLikesRef, { authorId: usuario.id });
    }
  }

  async function enviarResposta(questaoId: string, resposta: string) {
    const questaoAtual = questoes.find((q) => q.id === questaoId);

    if (!questaoAtual) {
      console.error(`Questão com id ${questaoId} não encontrada.`);
      return;
    }

    // Atualiza localmente a resposta na questão correspondente
    const updatedQuestoes = questoes.map((q) =>
      q.id === questaoId ? { ...q, resposta } : q
    );
    setQuestoes(updatedQuestoes);

    // Limpa o campo de resposta localmente
    setRespostasEmEdicao({
      ...respostasEmEdicao,
      [questaoId]: "",
    });

    // Verifica se a resposta não está vazia antes de enviar para o Firebase
    if (resposta.trim() !== "") {
      const questaoRef = ref(
        database,
        `salas/${salaId}/questoes/${questaoId}/respostas`
      );
      const newRespostaRef = push(questaoRef);
      await set(newRespostaRef, {
        author: {
          name: usuario?.nome,
          avatar: usuario?.avatar,
        },
        resposta,
      });
    }
  }

  return (
    <div id="pagina-sala">
      <header>
        <div className="conteudo">
          <img src={Logo} alt="MoniApp" />
          <CodigoSala code={salaId ?? ""} />
        </div>
      </header>

      <main>
        <form onSubmit={enviarQuestao}>
          <div className="sala-titulo">
            <h1>Sala {titulo}</h1>
            {questoes.length > 0 && <span>{questoes.length} perguntas</span>}
          </div>

          <textarea
            placeholder="O que você quer perguntar?"
            onChange={(event) => setNovaQuestao(event.target.value)}
            value={novaQuestao}
          />
          <div className="form-rodape">
            {usuario ? (
              <div className="usuario-info">
                <img src={usuario.avatar} alt={usuario.nome} />
                <span>{usuario.nome}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta,{" "}
                <button onClick={fazerLogin}>faça seu login</button>
              </span>
            )}
            <Button type="submit" disabled={!usuario}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        {questoes
          .slice()
          .sort((a, b) =>
            a.isAnswered === b.isAnswered ? 0 : a.isAnswered ? 1 : -1
          )
          .map((questao) => (
            <div key={questao.id} className="questao-container">
              <Questao
                content={questao.content}
                author={questao.author}
                isAnswered={questao.isAnswered}
                isHighlighted={questao.isHighlighted}
                resposta={questao.resposta}
              >
                <button
                  className={`like-button ${questao.likeId ? "liked" : ""}`}
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={() => LikeQuestao(questao.id, questao.likeId)}
                >
                  {questao.likeCount > 0 && <span>{questao.likeCount}</span>}
                  Curtir
                </button>
                {!questao.isAnswered && (
                  <div className="resposta-container">
                    <textarea
                      placeholder="Digite sua resposta..."
                      value={respostasEmEdicao[questao.id] || ""}
                      onChange={(event) =>
                        setRespostasEmEdicao({
                          ...respostasEmEdicao,
                          [questao.id]: event.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() =>
                        enviarResposta(
                          questao.id,
                          respostasEmEdicao[questao.id] || ""
                        )
                      }
                    >
                      Enviar resposta
                    </button>
                  </div>
                )}
              </Questao>
              {questao.respostas && questao.respostas.length > 0 && (
                <div className="respostas">
                  <h3>Respostas:</h3>
                  {questao.respostas.map((resposta) => (
                    <div key={resposta.id} className="resposta">
                      <p>
                        <strong>{resposta.author.name}:</strong>{" "}
                        {resposta.resposta}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </main>
    </div>
  );
}
