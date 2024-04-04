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
    <button className="sala-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="copiar codigo do quarto" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
}
