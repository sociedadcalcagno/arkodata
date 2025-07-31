import { Route, Switch } from 'wouter';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/arko-admin-secure-dashboard-2024" component={AdminDashboardPage} />
      <Route>
        {/* 404 fallback */}
        <HomePage />
      </Route>
    </Switch>
  );
}

export default App;