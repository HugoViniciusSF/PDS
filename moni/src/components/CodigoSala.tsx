import copyImg from "../assets/images/copy.svg";
import "../styles/codigo-sala.scss";

type CodigoSalaProps = {
  code: string;
};
export function CodigoSala(props: CodigoSalaProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code);
  }
  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div>
        <img src={copyImg} alt="copiar codigo do quarto" />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  );
}
