import _ from "lodash";
import { paginate } from "./paginate";

const getPageData = (state) => {
  let filtered = state.movies;

  if (state.searchQuery) {
    filtered = state.movies.filter((m) =>
      m.title.toLowerCase().startsWith(state.searchQuery.toLowerCase())
    );
  } else if (state.selectedGenre && state.selectedGenre._id) {
    filtered = state.movies.filter(
      (m) => m.genre._id === state.selectedGenre._id
    );
  }

  const sorted = _.orderBy(
    filtered,
    [state.sortColumn.path],
    [state.sortColumn.order]
  );

  const paginatedMovies = paginate(sorted, state.currentPage, state.pageSize);

  return { totalCount: filtered.length, data: paginatedMovies };
};

export default getPageData;
