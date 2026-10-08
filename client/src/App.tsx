import { Route, Switch } from 'wouter';
import HomePage from './pages/HomePage';
import AcademyPage from './pages/AcademyPage';
import AcademyClassroomPage from './pages/AcademyClassroomPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/academia" component={AcademyPage} />
      <Route path="/academia/aula/:slug" component={AcademyClassroomPage} />
      <Route path="/arko-admin-secure-dashboard-2024" component={AdminDashboardPage} />
      <Route>
        {/* 404 fallback */}
        <HomePage />
      </Route>
    </Switch>
  );
}

export default App;
