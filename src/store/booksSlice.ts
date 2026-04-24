import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_KEY = 'AIzaSyAd6dhgrYNyVhwnxjLdlsk5taZJKZz3fkE';
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
      extraLarge?: string;
      large?: string;
    };
  };
}

interface FetchParams {
  query: string;
  category: string;
  sort: string;
  startIndex: number;
}

interface BooksState {
  items: Book[];
  totalItems: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentQuery: string;
  currentCategory: string;
  currentSort: string;
  startIndex: number;
  currentBook: Book | null;
}

const initialState: BooksState = {
  items: [],
  totalItems: 0,
  status: 'idle',
  error: null,
  currentQuery: '',
  currentCategory: 'all',
  currentSort: 'relevance',
  startIndex: 0,
  currentBook: null,
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async ({ query, category, sort, startIndex }: FetchParams) => {
    const categoryQuery = category === 'all' ? '' : `+subject:${category}`;
    const url = `${BASE_URL}?q=${query}${categoryQuery}&orderBy=${sort}&startIndex=${startIndex}&maxResults=30&key=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (id: string) => {
    const url = `${BASE_URL}/${id}?key=${API_KEY}`;
    const response = await axios.get(url);
    return response.data;
  }
);

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearchParams(state, action: PayloadAction<{ query: string; category: string; sort: string }>) {
      state.currentQuery = action.payload.query;
      state.currentCategory = action.payload.category;
      state.currentSort = action.payload.sort;
      state.startIndex = 0;
      state.items = [];
    },
    clearCurrentBook(state) {
      state.currentBook = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload.items) {
          if (state.startIndex === 0) {
            state.items = action.payload.items;
          } else {
            state.items = [...state.items, ...action.payload.items];
          }
          state.startIndex += 30; 
        }
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Ошибка загрузки';
      })
      .addCase(fetchBookById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentBook = action.payload;
      });
  },
});

export const { setSearchParams, clearCurrentBook } = booksSlice.actions;
export default booksSlice.reducer;
