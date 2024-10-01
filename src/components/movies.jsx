import MoviesTable from "./moviesTable";
import Pagination from "../common/pagination";
import getPageData from "../utils/getPageData";
import { useEffect } from "react";
import SearchBox from "./searchBox";
import { Link } from "react-router-dom";
import ListGroup from "../common/listGroup";

function Movies({ state, dispatch }) {
  const {
    movies,
    pageSize,
    currentPage,
    searchQuery,
    selectedGenre,
    sortColumn,
    genres,
  } = state;

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("http://localhost:8000/movies");
        const data = await res.json();

        dispatch({ type: "initiateMovies", payload: data });
      } catch (error) {
        console.log(error);
      }
    }

    fetchMovies();
  }, [dispatch]);

  async function handleDelete(movie_id) {
    // Save the current state to revert in case of API failure
    const originalMovies = [...state.movies];

    // Optimistically update the UI by dispatching the delete action
    dispatch({ type: "deleteMovie", payload: movie_id });

    try {
      // Make the API call to delete the movie
      const res = await fetch(`http://localhost:8000/movies/${movie_id}`, {
        method: "DELETE",
      });

      // If the API call fails, throw an error to trigger the catch block
      if (!res.ok) throw new Error("Failed to delete the movie");
    } catch (error) {
      // Revert to the original state on failure
      dispatch({ type: "initiateMovies", payload: originalMovies });
      console.log(error);

      // Notify the user of the error
      alert("Failed to delete the movie. Please try again.");
    }
  }

  function handleLike(movie) {
    dispatch({ type: "likeMovie", payload: movie });
  }

  function handleSort(sortColumn) {
    dispatch({ type: "onSort", payload: sortColumn });
  }

  function handleGenreSelect(genre) {
    dispatch({ type: "onGenreSelect", payload: genre });
  }

  function handleSearch(query) {
    dispatch({ type: "onSearch", payload: query });
  }

  function handlePageChange(page) {
    dispatch({ type: "setPage", payload: page });
  }

  const { totalCount, data } = getPageData(state);

  if (movies.length === 0)
    return <p className="m-3">There are no movies in the database</p>;

  return (
    <main className="container">
      <div className="row">
        <div className="col-3 m-2">
          <ListGroup
            genres={genres}
            onItemSelect={handleGenreSelect}
            selectedGenre={selectedGenre}
          />
        </div>
        <div className="col">
          <Link
            className="btn btn-primary"
            style={{ marginBottom: 20 }}
            to="/movies/new"
          >
            New movie
          </Link>

          <p className="m-3">Showing {totalCount} movies in the database</p>

          <SearchBox value={searchQuery} onChange={handleSearch} />
          <MoviesTable
            movies={data}
            onDelete={handleDelete}
            onLike={handleLike}
            onSort={handleSort}
            sortColumn={sortColumn}
          />

          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    </main>
  );
}

export default Movies;
