import { useContext } from "react"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

import { AuthContext } from "../contexts/AuthContext"
import { database } from "../services/firebase"

type FirebaseQuestion = Record<string, {
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likes: Record<string, {
        authorId: string
    }>
}>

type QuestionType = {
    id: string,
    author: {
        name: string,
        avatar: string
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean,
    likeCount: number,
    likeId: string | undefined
}

export function useRoom(roomId: string) {
    const { user } = useContext(AuthContext)
    const [questions, setQuestions] = useState<QuestionType[]>([])
    const [title, setTitle] = useState('')
    const [roomAuthorId, setRoomAuthorId] = useState('')

    const history = useHistory()

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {
            const dataRoom = room.val()

            if (!dataRoom) {
                history.push('/rooms/new')
            }

            const firebaseQuestions: FirebaseQuestion = dataRoom.questions ?? {}
            const parsedQuestions = Object.entries(firebaseQuestions)

            const resultQuestions = parsedQuestions.map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            })

            setRoomAuthorId(dataRoom.authorId)
            setTitle(dataRoom.title)
            setQuestions(resultQuestions)
        })

        return () => {
            roomRef.off('value')
        }

    }, [roomId, user?.id, history])

    return { title, questions, roomAuthorId }
}
