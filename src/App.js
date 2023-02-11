import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './assets/scss/themes.scss';
import Route from './Routes';
const queryClient = new QueryClient()


function App(props) {
  return (
    <React.Fragment>
        <QueryClientProvider client={queryClient}>
          <Route />
        </QueryClientProvider>
    </React.Fragment>
  );
}

export default App;
