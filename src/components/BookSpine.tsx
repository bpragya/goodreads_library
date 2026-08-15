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
  const color = getSpineColor(book.id)
  const width = getSpineWidth(book.pageCount)

  return (
    <div
      className="book-spine"
      style={{
        backgroundColor: color,
        width: `${width}px`,
      }}
      title={`${book.title} — ${book.authors.join(', ')}`}
    >
      <span className="spine-title">{book.title}</span>
    </div>
  )
}

export default BookSpine
