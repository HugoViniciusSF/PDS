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
    }
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
          {questoes.length > 0 && <span>{questoes.length} pergunta(s)</span>}
        </div>

        <div className="questao-lista">
          {questoes.map((questao) => {
            return (
              <Questao
                key={questao.id}
                content={questao.content}
                author={questao.author}
              >
                <button type="button" onClick={() => deletaQuestao(questao.id)}>
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
