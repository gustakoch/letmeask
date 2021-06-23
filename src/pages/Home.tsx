import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'
import { AuthContext } from '../contexts/AuthContext'

import '../styles/home.scss'

export function Home() {
    const history = useHistory()
    const { user, signInWithGoogle } = useContext(AuthContext)

    async function handleGoogleSignAndCreateRoom() {
        if (!user) {
            await signInWithGoogle()
        }

        history.push('/rooms/new')
    }

    return (
        <div id="page-home">
            <aside>
                <img src={illustrationImg} alt="Illustration" />
                <strong>Crie salas de Q&amp;E ao-vivo</strong>
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

                    <form action="">
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
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
