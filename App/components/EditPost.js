import React, { useState, useEffect, useContext } from "react";
import Page from "./Page";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingIcon from "./LoadingIcon";
import ReactMarkdown from "react-markdown";
import ReactToolTip from "react-tooltip";
import { useImmerReducer } from "use-immer";
import StateContext from "../StateContext";

function EditPost() {
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
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);
  const appState = useContext(StateContext);

  useEffect(() => {
    const ourRequest = Axios.CancelToken.source();

    try {
      async function fetchData() {
        const response = await Axios.get(`/post/${state.id}`, {
          CancelToken: ourRequest.token,
        });
        dispatch({ type: "fetchCompleted", value: response.data });
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
          await Axios.post(
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

  if (state.isFetching) {
    return (
      <Page title="Loading">
        <LoadingIcon />
      </Page>
    );
  } else {
    function handleSubmit(e) {
      e.preventDefault();
      dispatch({
        type: "handleSubmit",
      });
    }
    return (
      <Page title="Edit Post">
        <form onSubmit={handleSubmit}>
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
}

export default EditPost;
