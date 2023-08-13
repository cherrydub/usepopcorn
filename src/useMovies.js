import { useState, useEffect } from "react";
import axios from "axios";

const KEY = "1eb0ec4a";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    //this AbortConttoller is so that it cancels the fetches
    //that happen before user is done typing
    callback?.();

    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");
        const res = await axios.get(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (res.status !== 200) {
          throw new Error("Something wrong with fetching movies manggg");
        }

        if (res.data.Response === "False") {
          throw new Error("Movie not found");
        }

        setMovies(res.data.Search);
        setError("");
      } catch (err) {
        // console.log("<<<<", err.name);
        if (err.name !== "AbortError" || err.name !== "CanceledError") {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    //this will close it whenever a new search is typed
    // handleCloseMovie();

    fetchMovies();

    return function () {
      controller.abort();
    };
  }, [query]);

  return { movies, isLoading, error };
}
