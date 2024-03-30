import { ButtonHTMLAttributes } from "react";
import "../styles/button.scss";

type BotaoProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Botao(props: BotaoProps) {
  return <button className="button" {...props} />;
}
