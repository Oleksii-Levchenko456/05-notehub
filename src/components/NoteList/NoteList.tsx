import css from './NoteList.module.css'
import type { Note } from '../../types/note'
import { deleteNote } from '../../services/noteService'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface NoteListProps {
    data?: Note[]
}

export default function NoteList({ data }: NoteListProps) {
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: (id: string) => deleteNote(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
        },
    })

    return (
        <ul className={css.list}>
            {data?.map(note => (
                <li key={note.id} className={css.listItem}>
                    <h2 className={css.title}>{note.title}</h2>
                    <p className={css.content}>{note.content}</p>
                    <div className={css.footer}>
                        <span className={css.tag}>{note.tag}</span>
                        <button className={css.button} onClick={() => { mutation.mutate(note.id) }}>Delete</button>
                    </div>
                </li>
            ))}

        </ul>

    )
}