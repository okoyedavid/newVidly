export const genres = [
  { id: "", name: "All genres" },
  { id: "5b21ca3eeb7f6fbccd471818", name: "Action" },
  { id: "5b21ca3eeb7f6fbccd471814", name: "Comedy" },
  { id: "5b21ca3eeb7f6fbccd471820", name: "Thriller" },
];

export function getGenres() {
  return genres.filter((g) => g);
}

const movies = [];

export function getMovie(id) {
  return movies.find((m) => m._id === id);
}

export function deleteMovie(id) {
  let movieInDb = movies.find((m) => m._id === id);
  movies.splice(movies.indexOf(movieInDb), 1);
  return movieInDb;
}
