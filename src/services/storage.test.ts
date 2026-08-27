import { describe, it, expect } from 'vitest'
import { loadBooks, saveBooks } from './storage'
import seedBooks from '../data/books.json'
import type { Book } from '../types/Book'

const book: Book = {
  id: 'b1',
  title: 'Test Book',
  authors: ['Someone'],
  cover: '',
  pageCount: 100,
  publishedDate: '2020',
  genre: [],
  description: '',
}

describe('storage', () => {
  it('returns the seed books on first load', () => {
    expect(loadBooks()).toEqual(seedBooks)
  })

  it('round-trips saved books', () => {
    saveBooks([book])
    expect(loadBooks()).toEqual([book])
  })

  it('does not re-seed after the user empties their shelf', () => {
    saveBooks([])
    expect(loadBooks()).toEqual([])
  })

  it('falls back to the seed when stored JSON is corrupt', () => {
    localStorage.setItem('goodreads-library-seeded', 'true')
    localStorage.setItem('goodreads-library-books', '{not json')
    expect(loadBooks()).toEqual(seedBooks)
  })

  it('returns an empty list when stored data is not an array', () => {
    localStorage.setItem('goodreads-library-seeded', 'true')
    localStorage.setItem('goodreads-library-books', '{"a":1}')
    expect(loadBooks()).toEqual([])
  })
})
