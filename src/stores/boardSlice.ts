// src/store/boardSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Board {
  id: string;
  title: string;
  background: string;
  backgroundType: "image" | "color";
  isStarred: boolean;
  isClosed: boolean;
  createdAt: string;
}

interface BoardState {
  boards: Board[];
  loading: boolean;
}

const initialState: BoardState = {
  boards: [],
  loading: false,
};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    // Set all boards (when loading from server)
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },

    // Add a new board
    addBoard: (state, action: PayloadAction<Board>) => {
      state.boards.push(action.payload);
    },

    // Update an existing board
    updateBoard: (state, action: PayloadAction<Board>) => {
      const index = state.boards.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
    },

    // Delete a board
    deleteBoard: (state, action: PayloadAction<string>) => {
      state.boards = state.boards.filter(b => b.id !== action.payload);
    },

    // Toggle star on a board
    toggleStar: (state, action: PayloadAction<string>) => {
      const board = state.boards.find(b => b.id === action.payload);
      if (board) {
        board.isStarred = !board.isStarred;
      }
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setBoards,
  addBoard,
  updateBoard,
  deleteBoard,
  toggleStar,
  setLoading,
} = boardSlice.actions;

export default boardSlice.reducer;