import './App.css';
import { ThemeProvider } from './app/providers/theme/themeProvider';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { store } from './shared/api/store';
import { router } from './app/providers/router/router';

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
