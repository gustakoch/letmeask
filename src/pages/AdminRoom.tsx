import { useContext, useEffect  } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import swal from 'sweetalert'

import { database } from '../services/firebase'
import { AuthContext } from '../contexts/AuthContext'

import { Question } from '../components/Question'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useRoom } from '../hooks/useRoom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import emptyQuestionsImg from '../assets/images/empty-questions.svg'

import '../styles/room.scss'

type RoomParams = {
    id: string
}

export function AdminRoom() {
    const { user } = useContext(AuthContext)
    const params = useParams<RoomParams>()
    const history = useHistory()

    const roomId = params.id
    const { title, questions, roomAuthorId } = useRoom(roomId)

    useEffect(() => {
        if (roomAuthorId) {
            if (roomAuthorId !== user?.id) {
                history.push(`/rooms/${roomId}`)
            }
        }
    }, [roomAuthorId, history, roomId, user?.id])

    async function handleAnswerQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

    async function handleHighlighQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })
    }

    async function handleDeleteQuestion(questionId: string) {
        const deleteQuestion = window.confirm('Tem certeza de que deseja excluir a pergunta?')

        if (deleteQuestion) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleEndRoom(roomId: string) {
        swal({
            title: "Encerrar a sala?",
            text: "A sala ser?? fechada e n??o poder?? mais ser acessada.",
            icon: "warning",
            buttons: {
                confirm: {
                    text: 'Sim, encerrar',
                    value: true,
                    visible: true,
                    closeModal: true
                },
                cancel: {
                    text: "Cancel",
                    value: false,
                    visible: true,
                    closeModal: true,
                }
            },
            closeOnEsc: true,
            className: 'swal-alert-caralho',
            dangerMode: true,
        }).then(deleteAction => {
                if (deleteAction) {
                    database.ref(`rooms/${roomId}`).update({
                        closedAt: new Date()
                    })

                    history.push('/')
                }
            })

        // const endRoom = window.confirm('Tem certeza de que deseja encerrar a sala?')

        // if (endRoom) {
        //     await database.ref(`rooms/${roomId}`).update({
        //         closedAt: new Date()
        //     })

        //     history.push('/')
        // }
    }

    return(
        <div id="page-room">
            <Toaster />
            <header>
                <div className="content">
                    <Link to="/">
                        <img src={logoImg} alt="Letmeask" />
                    </Link>
                    <div>
                        <RoomCode codeRoom={roomId} />
                        <Button
                            isOutlined
                            onClick={() => handleEndRoom(roomId)}
                        >Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <article>
                <div className="room-title">
                    <h1>Sala | {title}</h1>
                    {questions.length > 0 &&
                        <span>{questions.length} pergunta(s)</span>
                    }
                </div>

                {questions.length > 0 ? (
                    <div className="question-list">
                        {questions.map(question => (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isHighlighted={question.isHighlighted}
                                isAnswered={question.isAnswered}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleAnswerQuestion(question.id)}
                                            aria-label="Marcar pergunta como respondida"
                                            title="Marcar pergunta como respondida"
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlighQuestion(question.id)}
                                            aria-label="Destacar pergunta"
                                            title="Destacar pergunta"
                                        >
                                            <img src={answerImg} alt="Destacar pergunta" />
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    aria-label="Remover pergunta"
                                    title="Remover pergunta"
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        ))}
                    </div>
                ) : (
                    <div className="empty-questions">
                        <img src={emptyQuestionsImg} alt="Sem perguntas" />
                        <strong>Nenhuma pergunta por aqui ainda!</strong>
                        <p>Envie o c??digo da sala para seus amigos e comece a responder perguntas.</p>
                    </div>
                )}
            </article>
        </div>
    )
}
