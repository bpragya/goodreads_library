import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { searchBooks } from './services/bookSearch'
import type { Book } from './types/Book'

vi.mock('./services/bookSearch', () => ({ searchBooks: vi.fn() }))

const newBook: Book = {
  id: '/works/NEW1',
  title: 'Brand New Book',
  authors: ['New Author'],
  cover: '',
  pageCount: 200,
  publishedDate: '2024',
  genre: [],
  description: '',
}

beforeEach(() => {
  vi.mocked(searchBooks).mockReset()
})

describe('App', () => {
  it('shows seeded books on the shelf', () => {
    const { container } = render(<App />)
    expect(container.querySelectorAll('.book-spine').length).toBeGreaterThan(0)
  })

  it('adds a book chosen from search results and persists it', async () => {
    vi.mocked(searchBooks).mockResolvedValue([newBook])
    const user = userEvent.setup()
    const { container } = render(<App />)
    const before = container.querySelectorAll('.book-spine').length

    await user.type(screen.getByPlaceholderText('Add a book...'), 'brand')
    await user.click(await screen.findByText('New Author'))

    await waitFor(() =>
      expect(container.querySelectorAll('.book-spine').length).toBe(before + 1)
    )
    const saved = JSON.parse(localStorage.getItem('goodreads-library-books')!)
    expect(saved.some((b: Book) => b.id === newBook.id)).toBe(true)
  })

  it('does not add a duplicate title/author', async () => {
    vi.mocked(searchBooks).mockResolvedValue([newBook, { ...newBook, id: '/works/NEW2' }])
    const user = userEvent.setup()
    const { container } = render(<App />)
    const input = screen.getByPlaceholderText('Add a book...')

    await user.type(input, 'brand')
    await user.click((await screen.findAllByText('New Author'))[0])
    const afterFirst = container.querySelectorAll('.book-spine').length

    await user.type(input, 'brand')
    await user.click((await screen.findAllByText('New Author'))[1])

    expect(container.querySelectorAll('.book-spine').length).toBe(afterFirst)
  })
})
