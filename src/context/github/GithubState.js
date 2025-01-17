import React, { useReducer } from "react";
import GithubContext from "./githubContext";
import GithubReducer from "./githubReducer";
import axios from "axios";
import {
  SEARCH_USERS,
  GET_REPOS,
  GET_USER,
  SET_LOADING,
  CLEAR_USERS
} from "../types";

let github_client_id;
let github_client_secret;

if (process.env.NODE_ENV !== "production") {
  github_client_id = process.env.REACT_APP_GITHUB_CLIENT_ID;
  github_client_secret = process.env.REACT_APP_GITHUB_CLIENT_SECRET;
} else {
  github_client_id = process.env.GITHUB_CLIENT_ID;
  github_client_secret = process.env.GITHUB_CLIENT_SECRET;
}

const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false
  };
  const [state, dispatch] = useReducer(GithubReducer, initialState);

  //Search Users
  const searchUsers = async text => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    //const res = await fetch("https://api.github.com/users");
    //const data = await res.json();

    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items
    });
  };
  //clear Users

  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  //get user

  const getUser = async username => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    //const res = await fetch("https://api.github.com/users");
    //const data = await res.json();
    dispatch({
      type: GET_USER,
      payload: res.data
    });
  };
  //get repos

  const getUserRepos = async username => {
    setLoading();
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    //const res = await fetch("https://api.github.com/users");
    //const data = await res.json();

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  };
  //Set loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
