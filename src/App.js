import React from 'react';
import { UserProvider } from './context/user.context';
import { QueryClient, QueryClientProvider } from 'react-query';
//import Scss
import './assets/scss/themes.scss';

//imoprt Route
import Route from './Routes';

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";

// Fake Backend 
import fakeBackend from "./helpers/AuthType/fakeBackend";

// Activating fake backend
fakeBackend();

// const firebaseConfig = {
//   apiKey: process.env.REACT_APP_APIKEY,
//   authDomain: process.env.REACT_APP_AUTHDOMAIN,
//   databaseURL: process.env.REACT_APP_DATABASEURL,
//   projectId: process.env.REACT_APP_PROJECTID,
//   storageBucket: process.env.REACT_APP_STORAGEBUCKET,
//   messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
//   appId: process.env.REACT_APP_APPID,
//   measurementId: process.env.REACT_APP_MEASUREMENTID,
// };

// init firebase backend
// initFirebaseBackend(firebaseConfig);
const queryClient = new QueryClient()


function App(props) {
  return (
    <React.Fragment>
      <UserProvider initialUser={props?.user}>
        <QueryClientProvider client={queryClient}>
          <Route />
        </QueryClientProvider>
      </UserProvider>
    </React.Fragment>
  );
}

export default App;
