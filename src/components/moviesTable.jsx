import Table from "../common/table";
import Like from "../common/like";
import { Link } from "react-router-dom";

function MoviesTable({ movies, sortColumn, onSort, onLike, onDelete }) {
  const columns = [
    {
      path: "title",
      label: "Title",
      content: (movie) => (
        <Link to={`movies/${movie.id}?genre=${movie.genre.id}`}>
          {movie.title}
        </Link>
      ),
    },
    { path: "genre.name", label: "Genre" },
    { path: "numberInStock", label: "Stock" },
    { path: "dailyRentalRate", label: "Rate" },
    {
      key: "like",
      content: (movie) => (
        <Like liked={movie.liked} onClick={() => onLike(movie)} />
      ),
    },
    {
      key: "delete",
      content: (movie) => (
        <button
          onClick={() => onDelete(movie.id)}
          className="btn btn-danger btn-sm"
        >
          Delete
        </button>
      ),
    },
  ];
  return (
    <Table
      data={movies}
      sortColumn={sortColumn}
      onSort={onSort}
      columns={columns}
    />
  );
}

export default MoviesTable;
