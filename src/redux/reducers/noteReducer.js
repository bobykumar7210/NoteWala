import {
  FETCH_NOTES_REQUEST,
  FETCH_NOTES_SUCCESS,
  FETCH_NOTES_FAILURE,
  ADD_NOTE_SUCCESS,
  UPDATE_NOTE_SUCCESS,
  DELETE_NOTE_SUCCESS,
  ARCHIVE_NOTE_SUCCESS,
  RESTORE_NOTE_SUCCESS,
  SET_ACTIVE_NOTE,
  CLEAR_ACTIVE_NOTE,
  SET_SEARCH_QUERY,
  SET_ACTIVE_TAB,
  SET_NOTE_TO_DELETE,
  CLEAR_NOTE_TO_DELETE,
  SET_IS_DELETING,
} from "../types/noteTypes";
import { NOTE_STATUS } from "../../utils/constants";

const initialState = {
  notes: [],
  isLoadingNotes: true,
  activeNote: null,
  searchQuery: "",
  activeTab: NOTE_STATUS.ACTIVE,
  noteToDelete: null,
  isDeleting: false,
  error: null,
};

/**
 * Traditional Redux Pure Reducer for Notes State
 */
export function noteReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_NOTES_REQUEST:
      return {
        ...state,
        isLoadingNotes: true,
        error: null,
      };

    case FETCH_NOTES_SUCCESS:
      return {
        ...state,
        isLoadingNotes: false,
        notes: action.payload,
        error: null,
      };

    case FETCH_NOTES_FAILURE:
      return {
        ...state,
        isLoadingNotes: false,
        error: action.payload,
      };

    case ADD_NOTE_SUCCESS:
      return {
        ...state,
        notes: [action.payload, ...state.notes],
      };

    case UPDATE_NOTE_SUCCESS:
      return {
        ...state,
        notes: state.notes.map((note) =>
          note._id === action.payload._id ? { ...note, ...action.payload } : note
        ),
      };

    case DELETE_NOTE_SUCCESS:
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload),
        activeNote: state.activeNote?._id === action.payload ? null : state.activeNote,
      };

    case ARCHIVE_NOTE_SUCCESS:
    case RESTORE_NOTE_SUCCESS:
      return {
        ...state,
        notes: state.notes.filter((note) => note._id !== action.payload._id),
        activeNote: state.activeNote?._id === action.payload._id ? null : state.activeNote,
      };

    case SET_ACTIVE_NOTE:
      return {
        ...state,
        activeNote: action.payload,
      };

    case CLEAR_ACTIVE_NOTE:
      return {
        ...state,
        activeNote: null,
      };

    case SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      };

    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload,
      };

    case SET_NOTE_TO_DELETE:
      return {
        ...state,
        noteToDelete: action.payload,
      };

    case CLEAR_NOTE_TO_DELETE:
      return {
        ...state,
        noteToDelete: null,
      };

    case SET_IS_DELETING:
      return {
        ...state,
        isDeleting: action.payload,
      };

    default:
      return state;
  }
}
