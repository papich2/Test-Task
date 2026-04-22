import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchBookById, clearCurrentBook } from '../store/booksSlice';
import DOMPurify from 'dompurify';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentBook, status } = useSelector((state: RootState) => state.books);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }
    return () => {
      dispatch(clearCurrentBook());
    };
  }, [id, dispatch]);

  useEffect(() => {
  if (currentBook) {
    document.title = `${currentBook.volumeInfo.title} | Modsen Books`;
  }
  return () => {
    document.title = 'Modsen Books'; // Возвращаем назад при уходе со страницы
  };
}, [currentBook]);

  if (status === 'loading' || !currentBook) {
    return <div className="loader">Загрузка информации о книге...</div>;
  }

  const info = currentBook.volumeInfo;
  const image = info.imageLinks?.extraLarge || info.imageLinks?.large || info.imageLinks?.thumbnail;
  const descriptionHtml = info.description ? DOMPurify.sanitize(info.description) : 'Описание отсутствует.';

  return (
    <div className="book-details-page">
      <header className="details-header">
        <h2 onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Modsen Books</h2>
      </header>
      <div className="details-content">
        <div className="details-sidebar">
          <h1>{info.title}</h1>
          <h3>{info.authors?.join(', ')}</h3>
          {image && <img src={image} alt={info.title} className="cover-image" />}
        </div>
        <div className="details-main">
          <p className="category-tag"><strong>Категория:</strong> {info.categories?.join(', ') || 'Не указана'}</p>
          <p className="author-tag"><strong>Автор:</strong> {info.authors?.join(', ') || 'Не указан'}</p>
          <div className="about-section">
            <h2>Об этой книге</h2>
            <div className="description" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          </div>
          <button className="back-btn" onClick={() => navigate(-1)}>Назад</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;