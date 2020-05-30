import React, { useState, useEffect, useContext } from "react";
import Page from "./Page";
import { useParams, Link, withRouter } from "react-router-dom";
import Axios from "axios";
import LoadingIcon from "./LoadingIcon";
import ReactMarkdown from "react-markdown";
import ReactToolTip from "react-tooltip";
import { useImmerReducer } from "use-immer";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import NotFound from "./NotFound";

function EditPost(props) {
  const initialState = {
    title: {
      value: "",
      hasError: false,
      errorMessage: "",
    },
    body: {
      value: "",
      hasError: false,
      errorMessage: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "fetchCompleted":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
      case "titleUpdate":
        draft.title.value = action.value;
        return;
      case "bodyUpdate":
        draft.body.value = action.value;
        return;
      case "handleSubmit":
        draft.sendCount++;
        return;
      case "savingStarted":
        draft.isSaving = true;
        return;
      case "savingFinished":
        draft.isSaving = false;
        return;
      case "notFound":
        draft.notFound = true;
        return;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({
      type: "handleSubmit",
    });
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    try {
      async function fetchData() {
        const response = await Axios.get(`/post/${state.id}`, {
          CancelToken: ourRequest.token,
        });
        if (response.data) {
          dispatch({ type: "fetchCompleted", value: response.data });
          if (appState.user.username != response.data.author.username) {
            appDispatch({
              type: "flashMessages",
              value: "You do not have permission to edit this post!",
            });
            props.history.push(`/post/${state.id}`);
          }
        } else {
          dispatch({ type: "notFound" });
        }
      }
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    } catch (e) {
      console.log("There was some error.", e);
    }
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: "savingStarted" });
      const ourRequest = Axios.CancelToken.source();
      async function fetchData() {
        try {
          const response = await Axios.post(
            `/post/${state.id}/edit`,
            {
              title: state.title.value,
              body: state.body.value,
              token: appState.user.token,
            },
            {
              CancelToken: ourRequest.token,
            }
          );
          dispatch({ type: "savingFinished" });
          appDispatch({ type: "flashMessages", value: "Post is updated!" });
        } catch (e) {
          console.log("There was some error.", e);
        }
      }
      fetchData();
      return () => {
        ourRequest.cancel();
      };
    }
  }, [state.sendCount]);

  if (state.notFound) {
    return <NotFound />;
  }

  if (state.isFetching) {
    return (
      <Page title="Loading">
        <LoadingIcon />
      </Page>
    );
  }

  return (
    <Page title="Edit Post">
      <Link to={`/post/${state.id}`}>
        <div className="small font-wight-bold">&laquo; Back to Post</div>
      </Link>
      <form className="mt-3" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            value={state.title.value}
            onChange={(e) =>
              dispatch({ type: "titleUpdate", value: e.target.value })
            }
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            value={state.body.value}
            onChange={(e) =>
              dispatch({ type: "bodyUpdate", value: e.target.value })
            }
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            type="text"
            required
          ></textarea>
        </div>
        {state.isSaving ? (
          <div className="spinner-border" role="status">
            <span className="sr-only">Saving...</span>
          </div>
        ) : (
          <button className="btn btn-primary">Save Updates</button>
        )}
      </form>
    </Page>
  );
}

export default withRouter(EditPost);
