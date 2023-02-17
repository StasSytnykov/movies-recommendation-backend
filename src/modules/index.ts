import axios from "axios";
import { IMovie, Movies } from "./movies/entities/Movies";
import { Movie } from "./movies/entities/Movie";

const API_KEY = process.env.API_KEY;
const DEFAULT_URL = process.env.DEFAULT_URL;

export const getPopular = async (page = 1, language: string) => {
  const result = await axios.get(
    `${DEFAULT_URL}/movie/popular?api_key=${API_KEY}&language=${language}&page=${page}`
  );

  return new Movies(result.data);
};

export const getDetails = async (movieIds: string[], language: string) => {
  const requests = movieIds.map(async (id) =>
    axios.get(
      `${DEFAULT_URL}/movie/${id}?api_key=${API_KEY}&language=${language}&`
    )
  );
  const data = await Promise.all(requests);
  return data.map((movie) => new Movie(movie.data));
};

export const getFoundMovies = async (
  page = 1,
  searchQuery: string,
  language: string
) => {
  const result = await axios.get(
    `${DEFAULT_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=last&page=1&include_adult=false`
  );

  console.log(result.data.results);
  return result.data.results.map((movie: IMovie) => new Movie(movie));
};
