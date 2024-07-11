import React, { useState } from "react";
import "../styles/notificacao.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Notificacao: React.FC = () => {
  const [to, setTo] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [strategy, setStrategy] = useState<string>("email");
  const [error, setError] = useState<string>("");
  const notificacaoErro = () =>
    toast.error("Erro ao enviar notificação", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const notificacaoSucesso = () =>
    toast.success("Notificação enviada com sucesso", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!to || !subject || !body || !strategy) {
      setError("All fields are required.");
      return;
    }

    if (strategy === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
      setError("Invalid email address.");
      return;
    }

    const objeto = JSON.stringify({
      to,
      subject,
      body,
      strategy,
    });

    try {
      const response = await fetch("http://localhost:3001/notification/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: objeto,
      });

      if (!response.ok) {
        throw new Error("Failed to send notification.");
      }

      setError("");
      notificacaoSucesso();

      setTo("");
      setSubject("");
      setBody("");
      setStrategy("email");
    } catch (error) {
      setError("Failed to send notification.");
      notificacaoErro();
    }
  };

  return (
    <>
      <ToastContainer />
      <form className="notification-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="to">Para:</label>
          <input
            type="text"
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Assunto:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="body">Conteúdo:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="strategy">Método de envio:</label>
          <select
            id="strategy"
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Enviar notificação</button>
      </form>
    </>
  );
};

export default Notificacao;
