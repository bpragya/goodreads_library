import { useEffect, useState } from 'react'
import './App.css'
import Bookshelf from './components/Bookshelf'
import BookSearch from './components/BookSearch'
import type { Book } from './types/Book'
import { loadBooks, saveBooks } from './services/storage'

function bookKey(book: Book) {
  return `${book.title.trim().toLowerCase()}|${book.authors[0]?.trim().toLowerCase() ?? ''}`
}

function App() {
  const [books, setBooks] = useState<Book[]>(() => loadBooks())

  useEffect(() => {
    saveBooks(books)
  }, [books])

  function handleAddBook(book: Book) {
    setBooks((prev) => (prev.some((b) => bookKey(b) === bookKey(book)) ? prev : [...prev, book]))
  }

  return (
    <div className="app">
      <h1 className="library-title">Welcome to my library!</h1>
      <BookSearch onAddBook={handleAddBook} />
      <Bookshelf books={books} />
    </div>
  )
}

export default App
