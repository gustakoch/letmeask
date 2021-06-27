import toast from 'react-hot-toast'

export function toastErrorAlert(message: string) {
    toast.error(message, {
        position: 'top-right',
        style: {
            border: '2px solid red'
        }
    })
}
