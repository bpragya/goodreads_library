import { useState, useEffect, useRef } from 'react'
import { searchBooks } from '../services/googleBooks'
import type { Book } from '../types/Book'
import './BookSearch.css'

interface BookSearchProps {
  onAddBook: (book: Book) => void
}

function BookSearch({ onAddBook }: BookSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      const books = await searchBooks(query)
      setResults(books)
      setShowDropdown(true)
      setLoading(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(book: Book) {
    onAddBook(book)
    setQuery('')
    setResults([])
    setShowDropdown(false)
  }

  return (
    <div className="autocomplete" ref={wrapperRef}>
      <input
        type="text"
        className="autocomplete-input"
        placeholder="Add a book..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
      />
      {showDropdown && (
        <div className="autocomplete-dropdown">
          {loading && <div className="autocomplete-loading">Searching...</div>}
          {!loading && results.length === 0 && query.trim() && (
            <div className="autocomplete-empty">No results found</div>
          )}
          {results.map((book) => (
            <div
              key={book.id}
              className="autocomplete-item"
              onClick={() => handleSelect(book)}
            >
              {book.cover && <img src={book.cover} alt={book.title} />}
              <div className="autocomplete-item-info">
                <span className="autocomplete-item-title">{book.title}</span>
                <span className="autocomplete-item-author">{book.authors.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookSearch
