import axios from "axios"
import type { Note } from "../types/note"
const token = import.meta.env.VITE_NOTEHUB_TOKEN

export interface FetchNotesResponse {
    notes: Note[],
    totalPages: number
}

export const fetchNotes = async (page: number, perPage: number, search?: string): Promise<FetchNotesResponse> => {
    const res = await axios.get<FetchNotesResponse>('https://notehub-public.goit.study/api/notes', {
        params: {
            page,
            perPage,
            search
        },
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return (
        res.data
    )
}

interface requestBodyProps {
    "title": string,
    "content": string,
    "tag": string
}

export const createNote = async (requestBody: requestBodyProps) => {
    const res = await axios.post('https://notehub-public.goit.study/api/notes',
        requestBody,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    return res.data
}

export const deleteNote = async (id: string) => {
    const res = await axios.delete(`https://notehub-public.goit.study/api/notes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return res.data
}
