import './App.css'
import Bookshelf from './components/Bookshelf'

function App() {
  return (
    <div className="app">
      <h1 className="library-title">Welcome to my library!</h1>
      <button className="add-book-button" onClick={()=> console.log('clicked')}>
        Add a book
      </button>
      
      <button className="button" onClick={() => console.log('clicked')}>
        What are you looking for?
      </button>
      <Bookshelf shelfCount={3} />
    </div>
  )
}

export default App
