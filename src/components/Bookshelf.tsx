import { useRef, useState, useEffect } from 'react'
import type { Book } from '../types/Book'
import BookSpine from './BookSpine'
import './Bookshelf.css'

interface BookshelfProps {
  shelfCount: number
  books: Book[]
}

function getSpineWidth(pageCount: number) {
  if (pageCount <= 0) return 25
  if (pageCount < 100) return 18
  if (pageCount < 200) return 24
  if (pageCount < 400) return 32
  if (pageCount < 600) return 40
  return 48
}

function Bookshelf({ shelfCount, books }: BookshelfProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shelfWidth, setShelfWidth] = useState(window.innerWidth)

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setShelfWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const shelves: Book[][] = Array.from({ length: shelfCount }, () => [])
  let currentShelf = 0
  let currentWidth = 0

  for (const book of books) {
    const width = getSpineWidth(book.pageCount)
    if (currentWidth + width > shelfWidth && currentShelf < shelfCount - 1) {
      currentShelf++
      currentWidth = 0
    }
    shelves[currentShelf].push(book)
    currentWidth += width
  }

  return (
    <div className="bookshelf" ref={containerRef}>
      {shelves.map((shelfBooks, i) => (
        <div key={i} className="shelf">
          <div className="shelf-books">
            {shelfBooks.map((book) => (
              <BookSpine key={book.id} book={book} />
            ))}
          </div>
          <div className="shelf-board" />
        </div>
      ))}
    </div>
  )
}

export default Bookshelf
