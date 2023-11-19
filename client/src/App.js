import React, {useEffect, useState} from 'react';
import {isMobile} from 'react-device-detect';
import MiddleRoutes from "./components/routing/MiddleRoutes";
import { Provider } from 'react-redux';
import {CreateStore} from "./store";

import { loadUser } from './actions/auth';

import './App.css';
import setAuthToken from "./utils/setAuthToken";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    const [store, setStore] = useState(null);

    useEffect(() => {
      if (!isMobile){
          setStore(CreateStore());
      }
  }, []);

    useEffect(() => {
      if (store){
          store.dispatch(loadUser());
      }
        // store.dispatch(loadUser());
  }, [store]);

    if (isMobile) {
        return (
            <div
                className='play_error'
            >
                <label>We sorry!</label>
                <label></label>
                <label>This content is unavailable on this screen</label>
            </div>
        )
    }


    if (!store)
        return <></>;

  return (
    <Provider store={store}>
        <MiddleRoutes/>
    </Provider>
  );
};

export default App;
