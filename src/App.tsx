import './App.css';
import { ThemeProvider } from './app/providers/theme/themeProvider';

import RegisterForm from './features/auth/ui/RegisterForm';

function App() {
  return (
    <ThemeProvider>
      <RegisterForm />
    </ThemeProvider>
  );
}

export default App;
