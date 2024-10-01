import { Routes, Route } from "react-router-dom";
import { useReducer } from "react";

import Movies from "./components/movies";
import Navbar from "./components/navbar";
import Costumers from "./components/customers";
import Rentals from "./components/rentals";
import NotFound from "./utils/notFound";
import LoginForm from "./components/loginForm";
import Register from "./components/register";
import { getGenres } from "./assets/fakeGenreService";
import NewMovie from "./common/newMovie";

const initialState = {
  movies: [],
  genres: [],
  pageSize: 4,
  searchQuery: "",
  selectedGenre: null,
  currentPage: 1,
  sortColumn: { path: "title", order: "asc" },
};

function reducer(state, { type, payload }) {
  const { movies } = state;
  switch (type) {
    case "initiateMovies":
      return {
        ...state,
        movies: payload,
        genres: getGenres(),
      };
    case "deleteMovie":
      return {
        ...state,
        movies: movies.filter((movie) => movie.id !== payload),
      };
    case "likeMovie":
      return {
        ...state,
        movies: movies.map((item) => {
          item._id === payload ? { ...item, liked: true } : { ...item };
        }),
      };

    case "onSort":
      return { ...state, sortColumn: payload };
    case "onGenreSelect":
      return {
        ...state,
        selectedGenre: payload,
        searchQuery: "",
        currentPage: 1,
      };

    case "setPage":
      return { ...state, currentPage: payload };

    case "onSearch":
      return {
        ...state,
        searchQuery: payload,
        selectedGenre: null,
        currentPage: 1,
      };

    case "addMovie":
      return {
        ...state,
        movies: [...state.movies, payload],
      };
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Movies state={state} dispatch={dispatch} />}
        />
        <Route
          path="movies/:id"
          element={<NewMovie dispatch={dispatch} state={state} />}
        />
        <Route path="login" element={<LoginForm />} />
        <Route path="register" element={<Register />} />
        <Route path="costumers" element={<Costumers />} />
        <Route path="rentals" element={<Rentals />} />
        <Route path="not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
