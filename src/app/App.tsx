import { ThemeProvider } from './providers/theme/themeProvider';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import { store } from './providers/store/store';
import { router } from './providers/router/router';
import PageLoader from '../shared/ui/PageLoader';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme='dark'>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
