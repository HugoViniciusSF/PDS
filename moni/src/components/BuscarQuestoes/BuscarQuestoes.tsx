import { useState } from "react";
import "./styles.scss";
import minhaFoto from "../../assets/images/logo.png";

type BuscarQuestoesProps = {
  onBuscar: (questoes: QuestoesStack[]) => void;
};

type QuestoesStack = {
  id: number;
  nome: string;
  imagemURL: string;
  descricao: string;
};

export function BuscarQuestoes({ onBuscar }: BuscarQuestoesProps) {
  const [topico, setTopico] = useState("");
  const [questoesBuscadas, setQuestoesBuscadas] = useState<QuestoesStack[]>([]);

  async function handleBuscar() {
    try {
      console.log(`Fetching questoes for topico: ${topico}`);
      const response = await fetch(`http://localhost:3001/info/${topico}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar informações das questoes");
      }

      const data: QuestoesStack[] = await response.json();
      // Atualiza o estado com as questões buscadas
      setQuestoesBuscadas(
        data.map((questao) => ({
          ...questao,
          // Verifica se a imagemURL está vazia e define um fallback para sua foto local
          imagemURL: questao.imagemURL.trim() ? questao.imagemURL : minhaFoto,
        }))
      );
      onBuscar(data); // Envia as questões buscadas para o componente pai, se necessário
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="buscar-questoes">
      {questoesBuscadas.length >= 0 && (
        <div className="questoes-buscadas">
          <input
            type="text"
            placeholder="Digite o tópico"
            value={topico}
            onChange={(e) => setTopico(e.target.value)}
          />
          <button onClick={handleBuscar}>Buscar</button>
          <h2>Questões Buscadas</h2>
          {questoesBuscadas.map((questao) => (
            <div key={questao.id} className="questao-buscada">
              <img
                src={questao.imagemURL}
                alt={questao.nome}
                onError={(e) => {
                  e.currentTarget.src = minhaFoto;
                }}
              />
              <div>
                <h3>{questao.nome}</h3>
                <p>{questao.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
