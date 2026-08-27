// One-time script to convert a Goodreads export CSV into src/data/books.json.
//
// Usage:
//   node scripts/import-goodreads.mjs path/to/goodreads_library_export.csv
//
// Only books on your "read" shelf are included. Run this again any time you
// have a newer export and want to regenerate the seed data.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '../src/data/books.json')
const NON_GENRE_SHELVES = new Set(['read', 'to-read', 'currently-reading'])

function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      row.push(field)
      field = ''
    } else if (char === '\r') {
      // ignore, \n handles the line break
    } else if (char === '\n') {
      row.push(field)
      rows.push(row)
      row = []
      field = ''
    } else {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field)
    rows.push(row)
  }

  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''))
}

function cleanIsbn(raw) {
  // Goodreads exports ISBNs as an Excel formula, e.g. ="9780141439518"
  return (raw || '').replace(/^="?|"$/g, '').trim()
}

function toBook(record) {
  const isbn13 = cleanIsbn(record['ISBN13'])
  const isbn = cleanIsbn(record['ISBN'])
  const coverIsbn = isbn13 || isbn

  const authors = [record['Author']].filter(Boolean)
  if (record['Additional Authors']) {
    authors.push(
      ...record['Additional Authors']
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean)
    )
  }

  const genre = (record['Bookshelves'] || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s && !NON_GENRE_SHELVES.has(s.toLowerCase()))

  const publishedDate = record['Original Publication Year'] || record['Year Published'] || ''

  return {
    id: `goodreads-${record['Book Id']}`,
    title: record['Title'] || 'Unknown Title',
    authors: authors.length > 0 ? authors : ['Unknown Author'],
    cover: coverIsbn ? `https://covers.openlibrary.org/b/isbn/${coverIsbn}-M.jpg` : '',
    pageCount: parseInt(record['Number of Pages'], 10) || 0,
    publishedDate: String(publishedDate),
    genre,
    description: '',
  }
}

function main() {
  const csvPath = process.argv[2]
  if (!csvPath) {
    console.error('Usage: node scripts/import-goodreads.mjs path/to/goodreads_library_export.csv')
    process.exit(1)
  }

  const text = readFileSync(csvPath, 'utf-8')
  const rows = parseCSV(text)
  if (rows.length === 0) {
    console.error('No rows found in that CSV.')
    process.exit(1)
  }

  const header = rows[0]
  const books = []

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const record = {}
    header.forEach((key, idx) => {
      record[key] = row[idx] ?? ''
    })

    const shelf = (record['Exclusive Shelf'] || '').trim().toLowerCase()
    if (shelf !== 'read') continue
    if (!record['Title']) continue

    books.push(toBook(record))
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(books, null, 2) + '\n')
  console.log(`Wrote ${books.length} book(s) to ${path.relative(process.cwd(), OUTPUT_PATH)}`)
}

main()
