import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'
import { AuthContext } from '../contexts/AuthContext'

import '../styles/home.scss'

export function NewRoom() {
    const { user } = useContext(AuthContext)

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
                    <h3>Crie uma nova sala</h3>

                    <form>
                        <input
                            type="text"
                            placeholder="Nome da sala"
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
