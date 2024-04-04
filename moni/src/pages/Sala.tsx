import "../styles/sala.scss";
import { useParams } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import { Button } from "../components/Button";
import { CodigoSala } from "../components/CodigoSala";
import { FormEvent, useEffect, useState } from "react";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { onValue, push, ref, set } from "firebase/database";
import { database } from "../services/firebase";

type FirebaseQuestions = Record<
  string,
  {
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
  }
>;

type Questao = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};
type RoomParams = {
  id: string;
};

export function Sala() {
  const { usuario } = useAutenticacao();
  const params = useParams<RoomParams>();

  const [novaQuestao, setNovaQuestao] = useState("");
  const salaId = params.id;
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [titulo, setTitulo] = useState("");

  useEffect(() => {
    const salaRef = ref(database, `salas/${salaId}`);

    const fetchData = () => {
      onValue(
        salaRef,
        (sala) => {
          const salaData = sala.val();
          const firebaseQuestoes: FirebaseQuestions = salaData.questoes ?? {};
          const parsedQuestions = Object.entries(firebaseQuestoes).map(
            ([key, value]) => {
              return {
                id: key,
                content: value.content,
                author: value.author,
                isAnswered: value.isAnswered,
                isHighlighted: value.isHighlighted,
              };
            }
          );
          setTitulo(salaData.title);
          setQuestoes(parsedQuestions);
          //   console.log(parsedQuestions);
          //    console.log(roomData);
        },
        {
          onlyOnce: false,
        }
      );
    };

    fetchData();
  }, [salaId]);

  async function enviarQuestao(event: FormEvent) {
    event.preventDefault();
    if (novaQuestao.trim() === "") {
      return;
    }

    if (!usuario) {
      // Seria legal usar um toast Site: react-hot-toast.com
      throw new Error("você precisa estar logado");
    }

    const questao = {
      content: novaQuestao,
      author: {
        name: usuario.nome,
        avatar: usuario?.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    const questaoRef = await ref(database, `salas/${salaId}/questoes`);
    const newQuestaoRef = await push(questaoRef);
    const firebaseQuestion = await set(newQuestaoRef, questao);

    setNovaQuestao("");
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
                Para enviar uma pergunta, <button>faça seu login</button>
              </span>
            )}
            <Button type="submit" disabled={!usuario}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        {JSON.stringify(questoes)}
      </main>
    </div>
  );
}
