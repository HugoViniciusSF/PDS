import { useContext } from 'react';
import { Autenticacao } from '../contexts/Autenticacao';

export function useAutenticacao(){
    const value = useContext(Autenticacao);

    return value;
}