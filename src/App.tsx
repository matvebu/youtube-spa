import './App.css';
import { ThemeProvider } from './app/providers/themeProvider';
import { Button } from './components/ui/button';

function App() {
  return (
    <ThemeProvider defaultTheme={'light'}>
      <Button>Create</Button>
    </ThemeProvider>
  );
}

export default App;
