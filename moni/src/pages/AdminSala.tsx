import { useNavigate, useParams } from "react-router-dom";
import logoImg from "../assets/images/logo.png";
import deleteImg from "../assets/images/delete.svg";
import { Button } from "../components/Button";
import { Questao } from "../components/Questao";
import { CodigoSala } from "../components/CodigoSala";
import { useSala } from "../hooks/useSala";
import { ref, update, remove } from "firebase/database";
import { database } from "../services/firebase";
import "../styles/sala.scss";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";
type SalaParams = {
  id: string;
};

export function AdminSala() {
  const navigate = useNavigate();
  const params = useParams<SalaParams>();
  const salaId = params.id || "";
  const salaRef = ref(database, `salas/${salaId}`);
  const { titulo, questoes } = useSala(salaId);

  async function encerrarSala() {
    if (window.confirm("Tem certeza que você deseja excluir esta sala?")) {
      await update(salaRef, { endedAt: new Date() });
      navigate("/");
    }
  }

  async function deletaQuestao(questaoId: string) {
    if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
      await remove(ref(database, `salas/${salaId}/questoes/${questaoId}`));

      try {
        const response = await fetch(
          `http://localhost:3001/questoes/${questaoId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Erro HTTP! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Erro na requisição fetch:", error);
      }
    }
  }

  async function questaoStatus(questaoId: string) {
    await update(ref(database, `salas/${salaId}/questoes/${questaoId}`), {
      isAnswered: true,
    });

    try {
      const response = await fetch(
        `http://localhost:3001/questoes/${questaoId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ respondido: true }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP! status: ${response.status}`);
      }

      const data = await response.json().catch(() => {
        return null;
      });

      if (data) {
        console.log("Dados da resposta:", data);
      } else {
        console.log("A resposta estava vazia ou não era JSON.");
      }
    } catch (error) {
      console.error("Erro na requisição fetch:", error);
    }
  }

  async function responderQuestao(questaoId: string) {
    await update(ref(database, `salas/${salaId}/questoes/${questaoId}`), {
      isHighlighted: true,
    });
  }

  return (
    <div id="pagina-sala">
      <header>
        <div className="conteudo">
          <img src={logoImg} alt="MoniApp" />
          <div>
            <CodigoSala code={salaId} />
            <Button isOutlined onClick={encerrarSala}>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="sala-titulo">
          <h1>Sala {titulo}</h1>
          {questoes.length > 0 && <span>{questoes.length} Pergunta(s)</span>}

          {questoes.filter((questao) => questao.isAnswered).length > 0 && (
            <span className="respondidas">
              {questoes.filter((questao) => questao.isAnswered).length}{" "}
              Respondida(s)
            </span>
          )}

          {questoes.filter((questao) => !questao.isAnswered).length > 0 && (
            <span className="falta-responder">
              {questoes.filter((questao) => !questao.isAnswered).length}{" "}
              Responder
            </span>
          )}
        </div>

        <div className="questao-lista">
          {questoes
            .slice()
            .sort((a, b) =>
              a.isAnswered === b.isAnswered ? 0 : a.isAnswered ? 1 : -1
            )
            .map((questao) => {
              return (
                <Questao
                  key={questao.id}
                  content={questao.content}
                  author={questao.author}
                  isAnswered={questao.isAnswered}
                  isHighlighted={questao.isHighlighted}
                >
                  {!questao.isAnswered && (
                    <>
                      <button
                        type="button"
                        onClick={() => questaoStatus(questao.id)}
                      >
                        <img src={checkImg} alt="Respondido" />
                      </button>
                      <button
                        type="button"
                        onClick={() => responderQuestao(questao.id)}
                      >
                        <img src={answerImg} alt="Destaque" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => deletaQuestao(questao.id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Questao>
              );
            })}
        </div>
      </main>
    </div>
  );
}
