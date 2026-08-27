import { describe, it, expect, vi, afterEach } from 'vitest'
import { searchBooks } from './bookSearch'

function mockFetch(body: unknown) {
  const fn = vi.fn().mockResolvedValue({ json: async () => body })
  vi.stubGlobal('fetch', fn)
  return fn
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('searchBooks', () => {
  it('maps Open Library docs to Book objects', async () => {
    mockFetch({
      docs: [
        {
          key: '/works/OL1W',
          title: 'Dune',
          author_name: ['Frank Herbert'],
          cover_i: 123,
          number_of_pages_median: 412,
          first_publish_year: 1965,
          subject: ['Sci-fi', 'Desert', 'Politics', 'Extra'],
        },
      ],
    })

    expect(await searchBooks('dune')).toEqual([
      {
        id: '/works/OL1W',
        title: 'Dune',
        authors: ['Frank Herbert'],
        cover: 'https://covers.openlibrary.org/b/id/123-M.jpg',
        pageCount: 412,
        publishedDate: '1965',
        genre: ['Sci-fi', 'Desert', 'Politics'],
        description: '',
      },
    ])
  })

  it('applies defaults for missing fields', async () => {
    mockFetch({ docs: [{ key: '/works/OL2W' }] })

    const [book] = await searchBooks('x')
    expect(book).toMatchObject({
      title: 'Unknown Title',
      authors: ['Unknown Author'],
      cover: '',
      pageCount: 0,
      publishedDate: '',
      genre: [],
    })
  })

  it('returns an empty array when the response has no docs', async () => {
    mockFetch({})
    expect(await searchBooks('x')).toEqual([])
  })

  it('URL-encodes the query', async () => {
    const fetchFn = mockFetch({ docs: [] })
    await searchBooks('war & peace')
    expect(fetchFn.mock.calls[0][0]).toContain('q=war%20%26%20peace')
  })
})
