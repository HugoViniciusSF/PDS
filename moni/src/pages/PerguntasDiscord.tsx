import { useEffect, useState } from 'react';
import { database } from '../services/firebase';
import { ref, onValue } from 'firebase/database';

type FirebaseQuestions = Record<string, {
  channel: string;
  message_id: string;
  reacted_users: Record<string, string>;
  reaction_count: number;
  user_message: string;
  username: string;
}>;

export function PerguntasDiscord() {
  const [questions, setQuestions] = useState<FirebaseQuestions>({});

  useEffect(() => {
    const questionsRef = ref(database, 'perguntas');

    onValue(questionsRef, (snapshot) => {
      const databaseQuestions = snapshot.val();
      setQuestions(databaseQuestions);
    });
  }, []);

  return (
    <div>
      <h1>Perguntas do Discord</h1>
      {Object.entries(questions).map(([key, value]) => {
        return (
          <div key={key}>
            <p>
              <strong>Usuário:</strong> {value.username}
            </p>
            <p>
              <strong>Mensagem:</strong> {value.user_message}
            </p>
            <p>
              <strong>Canal:</strong> {value.channel}
            </p>
            <p>
              <strong>Contagem de Reações:</strong> {value.reaction_count}
            </p>
            <hr />
          </div>
        );
      })}
    </div>
  );
}