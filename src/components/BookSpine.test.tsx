import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BookSpine from './BookSpine'
import type { Book } from '../types/Book'

const base: Book = {
  id: 'abc',
  title: 'Sample Title',
  authors: ['A. Author', 'B. Author'],
  cover: 'https://example.com/cover.jpg',
  pageCount: 300,
  publishedDate: '1999',
  genre: ['Fiction', 'Drama'],
  description: '',
}

function spineWidth(book: Book) {
  const { container } = render(<BookSpine book={book} />)
  return (container.querySelector('.book-spine') as HTMLElement).style.width
}

describe('BookSpine', () => {
  it('renders the title on the spine', () => {
    render(<BookSpine book={base} />)
    expect(screen.getByText('Sample Title')).toBeInTheDocument()
  })

  it.each([
    [0, '25px'],
    [50, '18px'],
    [150, '24px'],
    [300, '32px'],
    [500, '40px'],
    [900, '48px'],
  ])('sizes a %i-page book to %s', (pages, width) => {
    expect(spineWidth({ ...base, pageCount: pages })).toBe(width)
  })

  it('gives the same book the same colour every time', () => {
    const color = () => {
      const { container, unmount } = render(<BookSpine book={base} />)
      const c = (container.querySelector('.book-spine') as HTMLElement).style.backgroundColor
      unmount()
      return c
    }
    expect(color()).toBe(color())
  })

  it('hides the tooltip until hovered, then shows details', () => {
    const { container } = render(<BookSpine book={base} />)
    expect(container.querySelector('.book-tooltip')).toBeNull()

    fireEvent.mouseEnter(container.querySelector('.book-spine-wrapper')!)
    expect(screen.getByText('A. Author, B. Author')).toBeInTheDocument()
    expect(screen.getByText('1999')).toBeInTheDocument()
    expect(screen.getByText('Fiction, Drama')).toBeInTheDocument()
    expect(screen.getByText('300 pages')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Sample Title' })).toHaveAttribute('src', base.cover)

    fireEvent.mouseLeave(container.querySelector('.book-spine-wrapper')!)
    expect(container.querySelector('.book-tooltip')).toBeNull()
  })

  it('omits optional tooltip fields when empty', () => {
    const { container } = render(
      <BookSpine book={{ ...base, cover: '', pageCount: 0, publishedDate: '', genre: [] }} />
    )
    fireEvent.mouseEnter(container.querySelector('.book-spine-wrapper')!)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.queryByText(/pages/)).toBeNull()
    expect(container.querySelector('.book-tooltip-date')).toBeNull()
    expect(container.querySelector('.book-tooltip-genre')).toBeNull()
  })
})
