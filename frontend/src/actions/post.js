import api from "../services/api";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST } from "./types";

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

export const addLike = id => async dispatch => {
  try {
    setAuthToken(localStorage.token);
    const res = await api.put(`/api/posts/${id}/like`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const removeLike = id => async dispatch => {
  try {
    setAuthToken(localStorage.token);
    const res = await api.put(`/api/posts/${id}/unlike`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

export const deletePost = id => async dispatch => {
  try {
    setAuthToken(localStorage.token);
    await api.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(setAlert("Post Removed", "success"));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
