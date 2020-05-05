import api from "../services/api";
import setAuthToken from "../utils/setAuthToken";
import { setAlert } from "./alert";

import { GET_PROFILE, PROFILE_ERROR } from "./types";

export const getCurrentProfile = () => async dispatch => {
  setAuthToken(localStorage.token);
  try {
    const res = await api.get("/api/profiles/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
