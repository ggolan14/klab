import api from "./api";
import api_upload from "./api_upload";
import api_download from "./api_download";

const setAuthToken = token => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
    api_upload.defaults.headers.common['x-auth-token'] = token;
    api_download.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
    delete api_upload.defaults.headers.common['x-auth-token'];
    delete api_download.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
