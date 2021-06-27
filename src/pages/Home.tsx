import React, { FormEvent, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { database } from '../services/firebase'

import illustrationImg from '../assets/images/illustration.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import logoImg from '../assets/images/logo.svg'

import { toastErrorAlert } from '../utils/toastAlerts'

import { Button } from '../components/Button'
import { AuthContext } from '../contexts/AuthContext'

import '../styles/home.scss'

export function Home() {
    const history = useHistory()
    const { user, signInWithGoogle } = useContext(AuthContext)
    const [roomCode, setRoomCode] = useState('')

    async function handleGoogleSignAndCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    async function handleEnteredRoom(event: FormEvent) {
        event.preventDefault()

        if (roomCode.trim() === '') {
            return toastErrorAlert('Uma sala deve ser informada...')
        }

        const room = await database.ref(`rooms/${roomCode}`).get()

        if (!room.exists()) {
            return toastErrorAlert('A sala informada não existe.')
        }

        if (room.val().closedAt) {
            return toastErrorAlert('Esta sala já foi encerrada.')
        }

        history.push(`/admin/rooms/${roomCode}`)
    }

    return (
        <div id="page-home">
            <Toaster />
            <aside>
                <img src={illustrationImg} alt="Illustration" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>

            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <button
                        onClick={handleGoogleSignAndCreateRoom}
                        className="google-button"
                    >
                        <img src={googleIconImg} alt="Google" />
                        Crie sua sala com o Google
                    </button>

                    <div className="divider">ou entre em uma sala</div>

                    <form onSubmit={handleEnteredRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
                        />
                        <Button type="submit">
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
