import "../styles/perguntas-discord.scss";
import Logo from "../assets/images/logo.png";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { ref, onValue } from "firebase/database";

type FirebaseQuestions = Record<
  string,
  {
    server_name: string;
    channel: string;
    message_id: string;
    reacted_users: Record<string, string>;
    reaction_count: number;
    user_message: string;
    username: string;
    user_avatar_url: string;
    invite_link: string;
  }
>;

export function PerguntasDiscord() {
  const [questions, setQuestions] = useState<FirebaseQuestions>({});

  useEffect(() => {
    const questionsRef = ref(database, "perguntas");
    onValue(questionsRef, (snapshot) => {
      const databaseQuestions = snapshot.val();
      console.log(databaseQuestions);
      setQuestions(databaseQuestions || {});

      if (databaseQuestions) {
        Object.keys(databaseQuestions).forEach((questaoId) => {
          const questao = databaseQuestions[questaoId];
          const objeto = JSON.stringify({
            id: questaoId,
            nome: questao.username,
            fotoURL: questao.user_avatar_url,
            descricao: questao.user_message,
            respondido: false,
            prioridade: false,
          });

          fetch("http://localhost:3001/questoes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: objeto,
          })
            .then((response) => response.json())
            .then((data) => console.log("Success:", data))
            .catch((error) => console.error("Error:", error));
        });
      }
    });
  }, []);

  return (
    <div id="pagina-perguntas-discord">
      <header>
        <div className="conteudo">
          <img src={Logo} alt="MoniApp" />
          <h1>Perguntas do Discord</h1>
        </div>
      </header>

      <main className="card-view">
        <div className="perguntas-titulo">
          {Object.keys(questions).length > 0 ? (
            <span>{Object.keys(questions).length} perguntas</span>
          ) : (
            <h1>Carregando</h1>
          )}
        </div>

        {Object.entries(questions).map(([key, value]) => {
          return (
            <div key={key} className="pergunta-discord">
              <div className="pergunta-info">
                <div className="usuario-info">
                  <img
                    src={value.user_avatar_url}
                    alt={value.username}
                    className="avatar"
                  />
                  <span>{value.username}</span>
                </div>
                <div className="servidor-canal-info">
                  <a
                    href={value.invite_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="servidor-info" title={value.server_name}>
                      {value.server_name}
                    </button>
                  </a>
                  <span className="canal-info" title={value.channel}>
                    #{value.channel}
                  </span>
                </div>
              </div>
              <p className="pergunta-mensagem">{value.user_message}</p>
              <div className="reacoes-info">
                <span>reações: {value.reaction_count}</span>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
