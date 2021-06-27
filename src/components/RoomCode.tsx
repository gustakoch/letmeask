import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
    codeRoom: string
}

export function RoomCode({ codeRoom }: RoomCodeProps) {
    function copyCodeRoomToClipboard() {
        navigator.clipboard.writeText(codeRoom)
    }

    return (
        <button
            className="room-code"
            onClick={copyCodeRoomToClipboard}
            title="Copiar para área de transferência"
        >
            <div>
                <img src={copyImg} alt=" Copiar" />
            </div>
            <span>Sala #{codeRoom}</span>
        </button>
    )
}
