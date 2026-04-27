import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { App } from './App'
import './index.css'

const CACHE_RESET_VERSION = 'calitrack-pwa-cache-reset-2026-04-27-2'

async function clearOldPwaCacheOnce() {
  if (!('serviceWorker' in navigator) || !('caches' in window)) return
  if (localStorage.getItem(CACHE_RESET_VERSION) === 'done') return

  localStorage.setItem(CACHE_RESET_VERSION, 'done')

  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.all(registrations.map((registration) => registration.unregister()))

  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))

  window.location.reload()
}

clearOldPwaCacheOnce().catch(() => {
  localStorage.setItem(CACHE_RESET_VERSION, 'done')
})

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    updateSW(true)
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
