import copyImg from "../assets/images/copiar.svg";
import "../styles/codigo-sala.scss";

type CodigoSalaProps = {
  code: string;
};
export function CodigoSala(props: CodigoSalaProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
  }
  return (
    <button
      className="sala-code"
      onClick={copyRoomCodeToClipboard}
      title="Copiar código da sala"
    >
      <div>
        <img src={copyImg} alt="copiar codigo do quarto" />
      </div>
      <span>#{props.code}</span>
    </button>
  );
}
