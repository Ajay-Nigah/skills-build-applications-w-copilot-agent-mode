import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import './App.css'

const navigation = [
  { to: '/activities', label: 'Activities' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/teams', label: 'Teams' },
  { to: '/users', label: 'Users' },
  { to: '/workouts', label: 'Workouts' },
]

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <nav className="navbar navbar-expand-lg navbar-dark container">
          <NavLink className="navbar-brand d-flex align-items-center gap-2" to="/activities">
            <img src="/octofitapp-small.png" alt="" width="40" height="40" />
            <span>OctoFit Tracker</span>
          </NavLink>
          <div className="navbar-nav ms-auto flex-row flex-wrap">
            {navigation.map(({ to, label }) => (
              <NavLink
                className={({ isActive }) => `nav-link px-3${isActive ? ' active' : ''}`}
                key={to}
                to={to}
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="container py-4 py-lg-5">
        <Routes>
          <Route element={<Activities />} path="/activities" />
          <Route element={<Leaderboard />} path="/leaderboard" />
          <Route element={<Teams />} path="/teams" />
          <Route element={<Users />} path="/users" />
          <Route element={<Workouts />} path="/workouts" />
          <Route element={<Navigate replace to="/activities" />} path="/" />
          <Route element={<Navigate replace to="/activities" />} path="*" />
        </Routes>
      </main>

      <footer className="app-footer mt-auto py-3">
        <div className="container text-center">Move together. Get stronger together.</div>
      </footer>
    </div>
  )
}

export default App
