import { useState } from 'react'
import './App.css'
import Bookshelf from './components/Bookshelf'
import BookSearch from './components/BookSearch'
import type { Book } from './types/Book'

function App() {
  const [books, setBooks] = useState<Book[]>([])

  function handleAddBook(book: Book) {
    setBooks([...books, book])
  }

  return (
    <div className="app">
      <h1 className="library-title">Welcome to my library!</h1>
      <BookSearch onAddBook={handleAddBook} />
      <button className="button" onClick={() => console.log('clicked')}>
        What are you looking for?
      </button>
      <Bookshelf shelfCount={3} />
    </div>
  )
}

export default App
