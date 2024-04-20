import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { useAutenticacao } from "./useAutenticacao";
import { ref, onValue, off } from "firebase/database";

type FirebaseQuestoes = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>

type QuestaoType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
}

export function useSala(salaId: string) {
  const { usuario } =  useAutenticacao();
  const [questoes, setQuestoes] = useState<QuestaoType[]>([]);
  const [titulo, setTitulo] = useState('');

  useEffect(() => {
    const salaRef = ref(database, `salas/${salaId}`);

    const fetchData = (snapshot: any) => {
      const dbSala = snapshot.val();
      const firebaseQuestoes: FirebaseQuestoes = dbSala.questoes ?? {};

      const questoesAnalisadas = Object.entries(firebaseQuestoes).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === usuario?.id)?.[0],
        }
      });

      setTitulo(dbSala.title);
      setQuestoes(questoesAnalisadas);
    };

    onValue(salaRef, fetchData);

    return () => {
        off(salaRef, 'value', fetchData); 
      };
  }, [salaId, usuario?.id]);

  return { questoes: questoes, titulo: titulo };
}
