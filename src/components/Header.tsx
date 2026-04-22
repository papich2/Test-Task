import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../store';
import { fetchBooks, setSearchParams } from '../store/booksSlice';

const Header: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('relevance');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    navigate('/');
    dispatch(setSearchParams({ query, category, sort }));
    dispatch(fetchBooks({ query, category, sort, startIndex: 0 }));
  };

  return (
    <header className="header">
      <div className="header-logo"><h2 onClick={() => navigate('/')}>Modsen Books</h2></div>
      <div className="header-content">
        <h1>Мир мечты для книголюбов ждет вас!</h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Найти книгу..." 
            value={query} 
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={() => handleSearch()}>Поиск</button>
        </div>
        <div className="filters">
          <div className="filter-group">
            <label>Категории</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">Все</option>
              <option value="art">Искусство</option>
              <option value="biography">Биография</option>
              <option value="computers">Компьютеры</option>
              <option value="history">История</option>
              <option value="medical">Медицина</option>
              <option value="poetry">Поэзия</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Сортировка</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="relevance">По релевантности</option>
              <option value="newest">Сначала новые</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;