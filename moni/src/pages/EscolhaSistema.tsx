import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/option-selector.scss";

import monitoriaImage from "../assets/images/MONI_gif.gif";
import jogosImage from "../assets/images/select_gif.gif";
import reunioesImage from "../assets/images/reunion_gif.gif";

export function EscolhaSistema() {
  const navigate = useNavigate();

  const redirectTo = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container">
      <h1>
        <strong>Escolha um Sistema</strong>
      </h1>
      <div className="options">
        <div
          className="option-container monitoria"
          onClick={() => navigate("/moniapp")}
        >
          <div className="option-content">
            <img
              src={monitoriaImage}
              alt="Sistema de Monitoria"
              className="option-image"
            />
            <div className="option-text">Sistema de Monitoria</div>
          </div>
        </div>
        <div
          className="option-container jogos"
          onClick={() => redirectTo("/jogos")}
        >
          <div className="option-content">
            <img
              src={jogosImage}
              alt="Sistema de Jogos"
              className="option-image"
            />
            <div className="option-text">Sistema de Jogos</div>
          </div>
        </div>
        <div
          className="option-container reunioes"
          onClick={() => redirectTo("/reuniao")}
        >
          <div className="option-content">
            <img
              src={reunioesImage}
              alt="Sistema de Reuniões"
              className="option-image"
            />
            <div className="option-text">Sistema de Reuniões</div>
          </div>
        </div>
      </div>
    </div>
  );
}
