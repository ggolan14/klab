import axios from 'axios';
import {CURRENT_URL} from "./current_url";
import {GetStore} from "../store";
import {LOGOUT} from "../actions/types";

const api_upload = axios.create({
  baseURL: CURRENT_URL()+'/api',
  headers: {
    'Content-Type': 'multipart/form-data'
  },
});


/**
 intercept any Error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
**/

api_upload.interceptors.response.use(
    res => {
      return res;
    },
    err => {
      if (err.response.status === 401) {
        GetStore().dispatch({ type: LOGOUT });
      }
      if (err.response.status === 404) {
        // return err;
      }
      return Promise.reject(err);
    }
);


export default api_upload;
