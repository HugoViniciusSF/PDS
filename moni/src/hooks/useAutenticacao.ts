import { useContext } from 'react';
import { AutenticacaoContext } from '../contexts/AutenticacaoContext';

export function useAutenticacao(){
    const value = useContext(AutenticacaoContext);

    return value;
}