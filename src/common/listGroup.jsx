function ListGroup({
  genres,
  onItemSelect,

  selectedGenre,
}) {
  return (
    <ul className="list-group">
      {genres.map((genre) => (
        <li
          onClick={() => onItemSelect(genre)}
          key={genre.id}
          className={
            selectedGenre === genre
              ? "list-group-item active"
              : "list-group-item"
          }
        >
          {genre.name}
        </li>
      ))}
    </ul>
  );
}

export default ListGroup;
