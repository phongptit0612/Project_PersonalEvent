// src/stores/boardSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface List {
  id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  id: string;
  title: string;
  background: string;
  backgroundType: "image" | "color";
  isStarred: boolean;
  isClosed: boolean;
  createdAt: string;
  lists: List[];
}

interface BoardState {
  boards: Board[];
  loading: boolean;
  currentBoardId: string | null;
}

const initialState: BoardState = {
  boards: [],
  loading: false,
  currentBoardId: null,
};

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    // Set all boards (when loading from server)
    setBoards: (state, action: PayloadAction<Board[]>) => {
      state.boards = action.payload;
    },

    // Set current board ID
    setCurrentBoardId: (state, action: PayloadAction<string | null>) => {
      state.currentBoardId = action.payload;
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

    // ========== LIST ACTIONS ==========
    // Add a new list
    addList: (state, action: PayloadAction<{ boardId: string; list: List }>) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board) {
        if (!board.lists) board.lists = [];
        board.lists.push(action.payload.list);
      }
    },

    // Update a list
    updateList: (state, action: PayloadAction<{ boardId: string; list: List }>) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board && board.lists) {
        const index = board.lists.findIndex(l => l.id === action.payload.list.id);
        if (index !== -1) {
          board.lists[index] = action.payload.list;
        }
      }
    },

    // Delete a list
    deleteList: (state, action: PayloadAction<{ boardId: string; listId: string }>) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board && board.lists) {
        board.lists = board.lists.filter(l => l.id !== action.payload.listId);
      }
    },

    // ========== TASK ACTIONS ==========
    // Add a new task
    addTask: (state, action: PayloadAction<{ boardId: string; listId: string; task: Task }>) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board && board.lists) {
        const list = board.lists.find(l => l.id === action.payload.listId);
        if (list) {
          if (!list.tasks) list.tasks = [];
          list.tasks.push(action.payload.task);
        }
      }
    },

    // Update a task
    updateTask: (state, action: PayloadAction<{ boardId: string; listId: string; task: Task }>) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board && board.lists) {
        const list = board.lists.find(l => l.id === action.payload.listId);
        if (list && list.tasks) {
          const index = list.tasks.findIndex(t => t.id === action.payload.task.id);
          if (index !== -1) {
            list.tasks[index] = action.payload.task;
          }
        }
      }
    },

    // Delete a task
    deleteTask: (state, action: PayloadAction<{ boardId: string; listId: string; taskId: string }>) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board && board.lists) {
        const list = board.lists.find(l => l.id === action.payload.listId);
        if (list && list.tasks) {
          list.tasks = list.tasks.filter(t => t.id !== action.payload.taskId);
        }
      }
    },

    // Toggle task completion
    toggleTaskComplete: (state, action: PayloadAction<{ boardId: string; listId: string; taskId: string }>) => {
      const board = state.boards.find(b => b.id === action.payload.boardId);
      if (board && board.lists) {
        const list = board.lists.find(l => l.id === action.payload.listId);
        if (list && list.tasks) {
          const task = list.tasks.find(t => t.id === action.payload.taskId);
          if (task) {
            task.isCompleted = !task.isCompleted;
          }
        }
      }
    },
  },
});

export const {
  setBoards,
  setCurrentBoardId,
  addBoard,
  updateBoard,
  deleteBoard,
  toggleStar,
  setLoading,
  addList,
  updateList,
  deleteList,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} = boardSlice.actions;

export default boardSlice.reducer;