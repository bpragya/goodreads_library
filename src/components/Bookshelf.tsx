import { useRef, useState, useEffect } from 'react'
import type { Book } from '../types/Book'
import BookSpine from './BookSpine'
import './Bookshelf.css'

interface BookshelfProps {
  books: Book[]
}

const SCROLL_AMOUNT = 400

function Bookshelf({ books }: BookshelfProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  function updateScrollButtons() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
  }

  useEffect(() => {
    updateScrollButtons()
    window.addEventListener('resize', updateScrollButtons)
    return () => window.removeEventListener('resize', updateScrollButtons)
  }, [books])

  function scrollByAmount(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <div className="bookshelf">
      <div className="shelf">
        <div className="shelf-carousel">
          <button
            type="button"
            className="shelf-arrow shelf-arrow-left"
            onClick={() => scrollByAmount(-SCROLL_AMOUNT)}
            disabled={!canScrollLeft}
            aria-label="Scroll shelf left"
          >
            &#8249;
          </button>
          <div className="shelf-books" ref={scrollRef} onScroll={updateScrollButtons}>
            {books.map((book) => (
              <BookSpine key={book.id} book={book} />
            ))}
          </div>
          <button
            type="button"
            className="shelf-arrow shelf-arrow-right"
            onClick={() => scrollByAmount(SCROLL_AMOUNT)}
            disabled={!canScrollRight}
            aria-label="Scroll shelf right"
          >
            &#8250;
          </button>
        </div>
        <div className="shelf-board" />
      </div>
    </div>
  )
}

export default Bookshelf
