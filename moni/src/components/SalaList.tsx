import React from "react";
import "../styles/salaList.scss";

interface Sala {
  id: number;
  name: string;
  description: string;
}

interface SalaListProps {
  salas: Sala[];
}

const SalaList: React.FC<SalaListProps> = ({ salas }) => {
  return (
    <div className="sala-list">
      <ul>
        {salas.map((sala) => (
          <li key={sala.id}>
            <div className="sala-info">
              <h3>{sala.name}</h3>
              <p>{sala.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SalaList;
