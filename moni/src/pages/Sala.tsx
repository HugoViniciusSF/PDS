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
import { useSala } from "../hooks/useSala";

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
  };
};

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
};

type SalaParams = {
  id: string;
};

export function Sala() {
  const { usuario, signInWithGoogle } = useAutenticacao();
  const params = useParams<SalaParams>();

  const [novaQuestao, setNovaQuestao] = useState("");
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

    setNovaQuestao("");
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
      // Se o usuário já deu like, remove o like
      await set(questaoLikesRef, { likeId: null });
    } else {
      // Se o usuário ainda não deu like, adiciona o like
      await push(questaoLikesRef, { authorId: usuario.id });
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

        {questoes.map((questao) => (
          <Questao
            key={questao.id}
            content={questao.content}
            author={questao.author}
          >
            <button
              className={`like-button ${questao.likeId ? "liked" : ""}`}
              type="button"
              aria-label="Marcar como gostei"
              onClick={() => LikeQuestao(questao.id, questao.likeId)}
            >
              {questao.likeCount > 0 && <span>{questao.likeCount}</span>}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z"
                  stroke="#737380"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </Questao>
        ))}
      </main>
    </div>
  );
}
