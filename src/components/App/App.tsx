import css from './App.module.css'
import NoteList from '../NoteList/NoteList'
import { fetchNotes } from '../../services/noteService'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import SearchBox from '../SearchBox/SearchBox'
import Pagination from '../Pagination/Pagination'
import Modal from '../Modal/Modal'
import { useDebouncedCallback } from 'use-debounce'
import Loader from '../Loader/Loader'
import NoteForm from '../NoteForm/NoteForm'
export default function App() {
    const [page, setPage] = useState(1)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [searchValue, setSearchValue] = useState('')

    const handleSearch = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => { setSearchValue(e.target.value) }, 700)

    const closeModal = () => {
        setIsOpenModal(false)
    }

    useEffect(() => {
        setPage(1)
    }, [searchValue])
    // тут прослуховування Page

    const { data, isFetching, } = useQuery({
        queryKey: ['notes', page, searchValue],
        queryFn: () => fetchNotes(page, 12, searchValue),
        placeholderData: keepPreviousData
    })
    return (
        <div className={css.app}>
            <header className={css.toolbar}>

                <SearchBox value={searchValue} onChange={handleSearch} />
                {data && data.totalPages > 1 && <Pagination totalPages={data.totalPages} page={page} setPage={setPage} />}
                <button className={css.button} onClick={() => { setIsOpenModal(true) }}>Create note +</button>
            </header>
            {isFetching && <Loader />}
            {isOpenModal && (
                <Modal onClose={closeModal}>
                    <NoteForm onClose={closeModal} />
                </Modal>)}
            {data?.notes.length !== 0 ? <NoteList data={data?.notes} /> : <p>Empty...</p>
            }
        </div>

    )
}
