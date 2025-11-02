import { ThemeProvider } from './providers/theme/themeProvider';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { router } from './providers/router/router';
import PageLoader from '../shared/components/PageLoader';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '../shared/store/store';

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider defaultTheme='dark'>
          <Suspense fallback={<PageLoader />}>
            <RouterProvider router={router} />
          </Suspense>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
