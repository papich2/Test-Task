import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchBooks, setSearchParams } from '../store/booksSlice';
import BookCard from '../components/BookCard';
import Header from '../components/Header';

const Home: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, totalItems, status, currentQuery, currentCategory, currentSort, startIndex, error } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    if (items.length === 0 && status === 'idle') {
      const q = 'JS';
      dispatch(setSearchParams({ query: q, category: 'all', sort: 'relevance' }));
      dispatch(fetchBooks({ query: q, category: 'all', sort: 'relevance', startIndex: 0 }));
    }
  }, [dispatch, items.length, status]);

  const handleLoadMore = () => {
    dispatch(fetchBooks({ query: currentQuery, category: currentCategory, sort: currentSort, startIndex }));
  };

  return (
    <>
      <Header />
      <main className="home-container">
        {error && <div className="error-msg">Ошибка: {error}</div>}
        
        {status === 'loading' && startIndex === 0 ? (
          <div className="loader">Загрузка книг...</div>
        ) : (
          <>
            {totalItems > 0 && <h3 className="results-count">Найдено книг: {totalItems}</h3>}
            <div className="books-grid">
              {items.map((book, idx) => <BookCard key={`${book.id}-${idx}`} book={book} />)}
            </div>
            {status === 'loading' && <div className="loader">Подгружаем...</div>}
            {items.length > 0 && items.length < totalItems && status !== 'loading' && (
              <button className="load-more" onClick={handleLoadMore}>Загрузить еще</button>
            )}
          </>
        )}
      </main>
    </>
  );
};

export default Home;
