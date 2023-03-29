import { useState, useRef, useCallback } from "react";
import UseBookSearch from "./UseBookSearch";

function App() {

  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const { loading,
          error,
          hasMore,
          books } = UseBookSearch(query, pageNumber)
  
  const observer = useRef()
    // using intersection oberser for infinite scrolling along with useRef hook
  const lastBookElementRef = useCallback(node => {
    if(loading)  return
    if(observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore){
        setPageNumber(prevPageNumber => prevPageNumber + 1) 
      }
    })
    if(node) observer.current.observe(node)
  }, [loading, hasMore])

  function handleSearch(e){
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <>
      <div>
        <input type="text" value = {query} onChange={handleSearch}/>
        {books && books.map((book, index) => {
          if(books.length === index + 1){               // to check if the element that is going to render is last element or not
            return <div ref = {lastBookElementRef} key={book}>{book}</div>
          }
          else{
            return <div key={book}>{book}</div>
          }
        })}
        {error && <div>Error...</div>}
        {loading && <div>Loading...</div>}  
      </div>
    </>
    );
}

export default App;
