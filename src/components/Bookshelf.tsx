import './Bookshelf.css'

interface BookshelfProps {
  shelfCount: number
}

function Bookshelf({ shelfCount }: BookshelfProps) {
  return (
    <div className="bookshelf">
      <div className="bookshelf-side bookshelf-left" />
      <div className="bookshelf-center">
        {Array.from({ length: shelfCount }, (_, i) => (
          <div key={i} className="shelf">
            <div className="shelf-books" />
            <div className="shelf-board" />
          </div>
        ))}
      </div>
      <div className="bookshelf-side bookshelf-right" />
    </div>
  )
}

export default Bookshelf
