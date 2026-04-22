import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../store/booksSlice';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();
  const info = book.volumeInfo;
  const thumbnail = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail;
  const category = info.categories ? info.categories[0] : '';

  return (
    <div className="book-card" onClick={() => navigate(`/book/${book.id}`)}>
      <div className="card-image-container">
        {thumbnail ? <img src={thumbnail} alt={info.title} /> : <div className="placeholder-img" />}
      </div>
      <div className="card-info">
        <span className="category">{category}</span>
        <h4 className="title">{info.title}</h4>
        <span className="author">{info.authors?.join(', ')}</span>
      </div>
    </div>
  );
};

export default BookCard;