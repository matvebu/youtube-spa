import { ThemeProvider } from './providers/theme/themeProvider';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './providers/store/store';
import { router } from './providers/router/router';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme='dark'>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
