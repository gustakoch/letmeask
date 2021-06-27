import React, { useContext, FormEvent } from 'react'
import { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'
import { AuthContext } from '../contexts/AuthContext'

import { database } from '../services/firebase'
import { toastErrorAlert } from '../utils/toastAlerts'

import '../styles/home.scss'

export function NewRoom() {
    const { user } = useContext(AuthContext)
    const [newRoom, setNewRoom] = useState('')
    const history = useHistory()

    function handleCreateRoom(event: FormEvent) {
        event.preventDefault()

        if (newRoom.trim() === '') {
            return toastErrorAlert('O nome da sala deve ser informado.')
        }

        const roomRef = database.ref('rooms')
        const firebaseRoom = roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        history.push(`/admin/rooms/${firebaseRoom.key}`)
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
                    <h3>Crie uma nova sala</h3>

                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>
                        Deseja entrar numa sala já existente? <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
