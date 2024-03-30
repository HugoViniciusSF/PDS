import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";

type Usuario = {
  id: string;
  nome: string;
  avatar: string;
};

type AutenticacaoType = {
  usuario: Usuario | undefined;
  signInWithGoogle: () => Promise<void>;
};
type AutenticacaoProviderProps = {
  children: ReactNode;
};

export const AutenticacaoContext = createContext({} as AutenticacaoType);

export function AutenticacaoProvider(props: AutenticacaoProviderProps) {
  const [usuario, setUsuario] = useState<Usuario>();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((usuario) => {
      if (usuario) {
        const {
          displayName: nome,
          photoURL: fotoURL,
          uid: identificador,
        } = usuario;

        if (!nome || !fotoURL) {
          throw new Error("Falta alguma informação na sua conta Google");
        }

        setUsuario({
          id: identificador,
          nome: nome,
          avatar: fotoURL,
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    if (result.user) {
      const {
        displayName: Nome,
        photoURL: fotoUrl,
        uid: identificador,
      } = result.user;

      if (!Nome || !fotoUrl) {
        throw new Error("Alguma informação ausente na sua conta Google");
      }

      setUsuario({
        id: identificador,
        nome: Nome,
        avatar: fotoUrl,
      });
    }
  }
  return (
    <AutenticacaoContext.Provider
      value={{ usuario: usuario, signInWithGoogle }}
    >
      {props.children}
    </AutenticacaoContext.Provider>
  );
}
