import { Route, Switch } from 'wouter';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route>
        {/* 404 fallback */}
        <HomePage />
      </Route>
    </Switch>
  );
}

export default App;