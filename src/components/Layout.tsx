import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Layout() {
  const location = useLocation()

  return (
    <div className="flex flex-col h-full min-h-0">
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20 min-h-0">
        <div key={location.pathname} className="page-enter min-h-full">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
