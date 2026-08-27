import type { Book } from '../types/Book'
import seedBooks from '../data/books.json'

const STORAGE_KEY = 'goodreads-library-books'
const SEEDED_KEY = 'goodreads-library-seeded'

export function loadBooks(): Book[] {
  try {
    // Only seed once: an empty localStorage array is a valid "user cleared
    // their shelf" state and must not be overwritten by the seed data again.
    if (localStorage.getItem(SEEDED_KEY) !== 'true') {
      return seedBooks as Book[]
    }
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return seedBooks as Book[]
  }
}

export function saveBooks(books: Book[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
    localStorage.setItem(SEEDED_KEY, 'true')
  } catch {
    // ignore storage errors (e.g. quota exceeded or unavailable)
  }
}
