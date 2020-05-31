import React, { useContext, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import { useImmer } from "use-immer";
import Axios from "axios";
import { Link } from "react-router-dom";

function Search() {
  const [state, setState] = useImmer({
    searchTerm: "",
    requestCount: 0,
    results: [],
    show: "neither",
  });
  const appDispatch = useContext(DispatchContext);

  useEffect(() => {
    const delay = setTimeout(() => {
      setState((draft) => {
        draft.requestCount++;
      });
    }, 750);

    return () => clearTimeout(delay);
  }, [state.searchTerm]);

  useEffect(() => {
    if (state.requestCount) {
      const ourRequest = Axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await Axios.post(
            "/search",
            { searchTerm: state.searchTerm },
            { CancelToken: ourRequest.token }
          );
          setState((draft) => {
            draft.results = response.data;
          });
        } catch (e) {
          console.log("There was some error.", e);
        }
      }
      fetchData();
      return () => ourRequest.cancel();
    }
  }, [state.requestCount]);

  function handleSearch(e) {
    let value = e.target.value;
    setState((draft) => {
      draft.searchTerm = value;
    });
  }

  function getDate(createdDate) {
    const date = new Date(createdDate);
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;
    return formattedDate;
  }

  return (
    <div className="search-overlay">
      <div className="search-overlay-top shadow-sm">
        <div className="container container--narrow">
          <label htmlFor="live-search-field" className="search-overlay-icon">
            <i className="fas fa-search"></i>
          </label>
          <input
            autoFocus
            onChange={handleSearch}
            type="text"
            autoComplete="off"
            id="live-search-field"
            className="live-search-field"
            placeholder="What are you interested in?"
          />
          <span
            onClick={() => appDispatch({ type: "searchClose" })}
            className="close-live-search"
          >
            <i className="fas fa-times-circle"></i>
          </span>
        </div>
      </div>

      <div className="search-overlay-bottom">
        <div className="container container--narrow py-3">
          <div className="live-search-results live-search-results--visible">
            <div className="list-group shadow-sm">
              <div className="list-group-item active">
                <strong>Search Results</strong> ({state.results.length}{" "}
                {state.results.length > 1 ? "items " : "item "}
                found)
              </div>
              {state.results.map((result) => (
                <Link
                  onClick={() => appDispatch({ type: "searchClose" })}
                  key={result._id}
                  to={`/post/${result._id}`}
                  className="list-group-item list-group-item-action"
                >
                  <img className="avatar-tiny" src={result.author.avatar} />{" "}
                  <strong>{result.title}</strong>{" "}
                  <span className="text-muted small">
                    by {result.author.username} on {getDate(result.createdDate)}{" "}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Search;
