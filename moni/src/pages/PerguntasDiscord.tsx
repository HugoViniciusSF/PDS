import "../styles/perguntas-discord.scss";
import Logo from "../assets/images/logo.png";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { ref, onValue } from "firebase/database";

type FirebaseQuestions = Record<string, {
  server_name: string;
  message_id: string;
  reacted_users: Record<string, string>;
  reaction_count: number;
  user_message: string;
  username: string;
}>;

export function PerguntasDiscord() {
  const [questions, setQuestions] = useState<FirebaseQuestions>({});

  useEffect(() => {
    const questionsRef = ref(database, "perguntas");

    onValue(questionsRef, (snapshot) => {
      const databaseQuestions = snapshot.val();
      setQuestions(databaseQuestions);
    });
  }, []);

  return (
    <div id="pagina-perguntas-discord">
      <header>
        <div className="conteudo">
          <img src={Logo} alt="MoniApp" />
        </div>
      </header>

      <main>
        <div className="perguntas-titulo">
          <h1>Perguntas do Discord</h1>
          {Object.keys(questions).length > 0 && (
            <span>{Object.keys(questions).length} perguntas</span>
          )}
        </div>

        {Object.entries(questions).map(([key, value]) => {
          return (
            <div key={key} className="pergunta-discord">
              <div className="pergunta-info">
                <div className="usuario-info">
                  <img
                    src={`https://cdn.discordapp.com/avatars/${value.message_id}/${value.message_id}.png`}
                    alt={value.username}
                  />
                  <span>{value.username}</span>
                </div>
                <div className="servidor-info">
                  <span title={value.server_name}>{value.server_name}</span>
                </div>
              </div>
              <p className="pergunta-mensagem">{value.user_message}</p>
              <div className="reacoes-info">
                <span>{value.reaction_count} reações</span>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}