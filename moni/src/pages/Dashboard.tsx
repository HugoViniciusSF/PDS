"use client";
import React, { useEffect, useState } from "react";
import SalaList from "../components/SalaList";
import UserList from "../components/UserList";
import QuestoesList from "../components/QuestoesList";

const salas = [
  { id: 1, name: "Sala 1", description: "Descrição da Sala 1" },
  { id: 2, name: "Sala 2", description: "Descrição da Sala 2" },
  { id: 3, name: "Sala 3", description: "Descrição da Sala 3" },
  { id: 4, name: "Sala 4", description: "Descrição da Sala 4" },
  { id: 5, name: "Sala 5", description: "Descrição da Sala 5" },
];

type Questao = {
  id: number;
  nome: string;
  fotoURL: string;
  descricao: string;
  respondido: boolean;
  prioridade: boolean;
};
const Dashboard = () => {
  const [questoes, setQuestoes] = useState<Questao[]>([]);

  const fetchQuestoes = async () => {
    try {
      const response = await fetch("http://localhost:3001/questoes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data: Questao[] = await response.json();
      setQuestoes(data);
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
    }
  };
  useEffect(() => {
    fetchQuestoes();

    const intervalId = setInterval(fetchQuestoes, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const questoesNaoRespondidas = questoes.filter(
    (questao) => !questao.respondido
  );
  const nomes = Array.from(new Set(questoes.map((questao) => questao.nome)));
  const usersFromQuestoes = nomes.map((nome, index) => ({
    name: nome,
  }));
  const nomesUnicos = new Set(questoes.map((questao) => questao.nome)).size;

  return (
    <div>
      <section className="dashboard-main-section">
        <h1>Visão Geral</h1>
        <div className="dashboard-cards">
          <div className="card">
            <div className="card qtsEnviada">
              <h3>ENVIADAS:</h3>
              <b>
                <h2>{questoes.length}</h2>
              </b>
            </div>
          </div>
          <div className="card">
            <div className="card qtsRespondidas">
              <h3>RESPONDIDAS:</h3>
              <b>
                <h2>{questoes.length - questoesNaoRespondidas.length}</h2>
              </b>
            </div>
          </div>
          <div className="card">
            <div className="card qtsNRespondidas">
              <h3>NÃO RESPONDIDAS:</h3>
              <b>
                <h2>{questoesNaoRespondidas.length}</h2>
              </b>
            </div>
          </div>
          <div className="card">
            <div className="card alunosCadastrados">
              <h3>ALUNOS CADASTRADOS:</h3>
              <b>
                <h2>{nomesUnicos}</h2>
              </b>
            </div>
          </div>
        </div>
      </section>
      {/* <h2>Lista de Salas</h2>
      <div className="section-spacing"></div> */}

      {/* <section className="dashboard-main-section sala-list-section">
        <SalaList salas={salas} />
      </section> */}
      <h2>Lista de Usuários</h2>
      <div className="section-spacing"></div>
      <section className="dashboard-section user-list-section">
        <UserList users={usersFromQuestoes} />
      </section>
      <div className="section-spacing"></div>
      <h2>Lista de Questões</h2>
      <section className="dashboard-section questoes-list-section">
        <QuestoesList questoes={questoes} />
      </section>
    </div>
  );
};

export default Dashboard;
