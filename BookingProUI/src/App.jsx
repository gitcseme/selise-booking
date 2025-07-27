import { NavLink, Outlet } from 'react-router'
import './App.css'

function App() {


  return (
    <div>
      <header style={{ background: '#f0f0f0', padding: '10px' }}>
        <NavLink to="/studios">Studios</NavLink>
        <NavLink to="/bookings" style={{ marginLeft: '10px' }}>Bookings</NavLink>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
