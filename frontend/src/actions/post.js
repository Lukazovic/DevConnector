import api from "../services/api";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import { GET_POSTS, POST_ERROR } from "./types";

export const getPosts = () => async dispatch => {
  try {
    setAuthToken(localStorage.token);
    const res = await api.get("/api/posts");

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
