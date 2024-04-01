import { Link, useNavigate } from "react-router-dom";
import logo1 from "../assets/images/logo_transparente.png";
import logo from "../assets/images/logo.png";

import { FormEvent, useState } from "react";
import "../styles/pagina-inicial";
import { Button } from "../components/Button";
import { useAutenticacao } from "../hooks/useAutenticacao";
import { database } from "../services/firebase";
import { set, ref, push } from "firebase/database";
export function NovaSala() {
  const { usuario } = useAutenticacao();
  const [novaSala, setNovaSala] = useState("");
  const navigate = useNavigate();

  async function CriarSala(event: FormEvent) {
    event.preventDefault();

    if (novaSala.trimEnd() === "") {
      return;
    }
    const SalaRef = ref(database, "salas");

    const novaSalaRef = push(SalaRef);
    const novaSalaKey = novaSalaRef.key;

    const firebaseSala = set(novaSalaRef, {
      title: novaSala,
      author: usuario?.id,
    });

    navigate(`/salas/${novaSalaKey}`);
  }

  return <div>sala nova</div>;
}
