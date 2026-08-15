import type { Book } from '../types/Book'

export async function searchBooks(query: string): Promise<Book[]> {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
  )
  const data = await response.json()

  if (!data.docs) return []

  return data.docs.map((doc: any) => {
    const coverId = doc.cover_i
    const cover = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : ''

    return {
      id: doc.key,
      title: doc.title || 'Unknown Title',
      authors: doc.author_name || ['Unknown Author'],
      cover,
      pageCount: doc.number_of_pages_median || 0,
      publishedDate: doc.first_publish_year?.toString() || '',
      genre: doc.subject?.slice(0, 3) || [],
      description: '',
    }
  })
}
