import { useState, useRef } from 'react'
import type { Book } from '../types/Book'
import './BookSpine.css'

interface BookSpineProps {
  book: Book
}

const SPINE_COLORS = [
  '#8B4513', '#2F4F4F', '#8B0000', '#191970',
  '#556B2F', '#4A235A', '#1B4F72', '#7B241C',
  '#0E6655', '#6C3483', '#1A5276', '#784212',
]

function getSpineColor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return SPINE_COLORS[Math.abs(hash) % SPINE_COLORS.length]
}

function getSpineWidth(pageCount: number) {
  if (pageCount <= 0) return 25
  if (pageCount < 100) return 18
  if (pageCount < 200) return 24
  if (pageCount < 400) return 32
  if (pageCount < 600) return 40
  return 48
}

function BookSpine({ book }: BookSpineProps) {
  const [hovered, setHovered] = useState(false)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const spineRef = useRef<HTMLDivElement>(null)
  const color = getSpineColor(book.id)
  const width = getSpineWidth(book.pageCount)

  function handleMouseEnter() {
    setHovered(true)
    if (spineRef.current) {
      const rect = spineRef.current.getBoundingClientRect()
      let left = rect.left + rect.width / 2 - 110
      if (left < 8) left = 8
      if (left + 220 > window.innerWidth - 8) left = window.innerWidth - 228
      setTooltipPos({
        top: rect.top - 12,
        left,
      })
    }
  }

  return (
    <div
      className="book-spine-wrapper"
      ref={spineRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="book-spine"
        style={{
          backgroundColor: color,
          width: `${width}px`,
        }}
      >
        <span className="spine-title">{book.title}</span>
      </div>
      {hovered && (
        <div
          className="book-tooltip"
          style={{
            position: 'fixed',
            top: `${tooltipPos.top}px`,
            left: `${tooltipPos.left}px`,
            transform: 'translateY(-100%)',
          }}
        >
          {book.cover && <img src={book.cover} alt={book.title} />}
          <div className="book-tooltip-info">
            <span className="book-tooltip-title">{book.title}</span>
            <span className="book-tooltip-author">{book.authors.join(', ')}</span>
            {book.publishedDate && (
              <span className="book-tooltip-date">{book.publishedDate}</span>
            )}
            {book.genre.length > 0 && (
              <span className="book-tooltip-genre">{book.genre.join(', ')}</span>
            )}
            {book.pageCount > 0 && (
              <span className="book-tooltip-pages">{book.pageCount} pages</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BookSpine
