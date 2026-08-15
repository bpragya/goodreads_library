import type { Book } from '../types/Book'

const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

export async function searchBooks(query: string): Promise<Book[]> {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${API_KEY}`
  )
  const data = await response.json()

  if (!data.items) return []

  return data.items.map((item: any) => {
    const info = item.volumeInfo
    return {
      id: item.id,
      title: info.title || 'Unknown Title',
      authors: info.authors || ['Unknown Author'],
      cover: info.imageLinks?.thumbnail || '',
      pageCount: info.pageCount || 0,
      publishedDate: info.publishedDate || '',
      genre: info.categories || [],
      description: info.description || '',
    }
  })
}