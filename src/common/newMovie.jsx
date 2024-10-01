import { useEffect, useState } from "react";
import Joi from "joi";
import Input from "./input";
import DropDown from "./dropDown";
import { getGenres } from "../assets/fakeGenreService";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const schema = Joi.object({
  _id: Joi.string(),
  title: Joi.string().min(5).max(100).required().label("Title"),
  genreId: Joi.string().required().label("Genre"),
  numberInStock: Joi.number()
    .integer()
    .min(0)
    .max(100)
    .required()
    .label("Number in stock"),
  dailyRentalRate: Joi.number()
    .min(0)
    .max(10)
    .required()
    .label("Daily Rental Rate"),
});

const validate = (data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (!error) return null;

  const errors = {};
  error.details.forEach((item) => {
    errors[item.path[0]] = item.message;
  });
  return errors;
};

const validateProperty = ({ name, value }) => {
  const { error } = schema.extract(name).validate(value);
  return error ? error.details[0].message : null;
};

const NewMovie = ({ state }) => {
  const [errors, setErrors] = useState({});
  const [genres, setGenres] = useState([]);
  const [data, setData] = useState({
    dailyRentalRate: "",
    genreId: "",
    numberInStock: "",
    title: "",
  });
  const [searchParams] = useSearchParams();
  const genre = searchParams.get("genre");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    if (id === "new") return;
    const movie = state.movies.find((m) => m.id === id);
    if (movie) {
      const { dailyRentalRate, numberInStock, title } = movie;

      setData((movie) => ({
        ...movie,
        dailyRentalRate: dailyRentalRate,
        genreId: genre,
        numberInStock: numberInStock,
        title: title,
      }));
    }
  }, [id, state.movies, genre]);

  useEffect(() => {
    const genre = getGenres();
    setGenres(genre);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(data);
    setErrors(errors || {});

    if (errors) {
      return errors;
    } else {
      doSubmit(saveMovie(data));
    }
  };

  const doSubmit = async (movie) => {
    try {
      const response = await fetch("http://localhost:8000/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie),
      });

      if (!response.ok) {
        throw new Error("something went wrong");
      }

      const addedMovie = await response.json();
      navigate("/");
      return addedMovie;
    } catch (error) {
      console.error("Error adding movie:", error);
    }
  };

  const handleChange = ({ target: input }) => {
    const newErrors = { ...errors };
    const errorMessage = validateProperty(input);

    errorMessage
      ? (newErrors[input.name] = errorMessage)
      : delete newErrors[input.name];

    setData((data) => ({
      ...data,
      [input.name]: input.value,
    }));
    setErrors(newErrors);
  };

  function saveMovie(movie) {
    let movieInDb = state.movies.find((m) => m.id === movie.id) || {};
    movieInDb.title = movie.title;
    movieInDb.genre = genres.find((g) => g.id === movie.genreId);
    movieInDb.numberInStock = movie.numberInStock;
    movieInDb.dailyRentalRate = movie.dailyRentalRate;

    if (!movieInDb._id) {
      movieInDb.id = Date.now().toString();
      state.movies.push(movieInDb);
    }

    return movieInDb;
  }

  return (
    <main className="container">
      <form onSubmit={handleSubmit}>
        <h2>Movie Form</h2>
        <Input
          type="text"
          name="title"
          label="Name of movie"
          value={data.title}
          onChange={handleChange}
          placeholder="Title"
          error={errors.title}
        />

        <Input
          type="text"
          name="numberInStock"
          label="Number In Stock"
          value={data.numberInStock}
          onChange={handleChange}
          placeholder="Number in stock"
          error={errors.numberInStock}
        />

        <DropDown
          name="genreId"
          value={data.genreId}
          label="Genre"
          options={genres}
          onChange={handleChange}
          error={errors.genreId}
        />

        <Input
          type="text"
          name="dailyRentalRate"
          label="Daily Rental Rate"
          value={data.dailyRentalRate}
          onChange={handleChange}
          placeholder="Rate"
          error={errors.dailyRentalRate}
        />

        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </form>
    </main>
  );
};

export default NewMovie;
