import React from "react";
import "../styles/questoesList.scss";

type Questao = {
  id: number;
  nome: string;
  fotoURL: string;
  descricao: string;
  respondido: boolean;
  prioridade: boolean;
};

interface QuestoesListProps {
  questoes: Questao[];
}

const QuestoesList: React.FC<QuestoesListProps> = ({ questoes }) => {
  return (
    <div className="questoes-list">
      <ul>
        {questoes.map((questao, index) => (
          <div className="questao-info" key={index}>
            <h3>{questao.nome}</h3>
            <h3>{questao.descricao}</h3>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default QuestoesList;
