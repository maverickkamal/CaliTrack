import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { App } from './App'
import './index.css'

declare const __APP_VERSION__: string

const CACHE_RESET_KEY = 'calitrack-pwa-build-version'

async function clearOldPwaCacheOnce() {
  if (!('serviceWorker' in navigator) || !('caches' in window)) return
  if (localStorage.getItem(CACHE_RESET_KEY) === __APP_VERSION__) return

  localStorage.setItem(CACHE_RESET_KEY, __APP_VERSION__)

  const registrations = await navigator.serviceWorker.getRegistrations()
  await Promise.all(registrations.map((registration) => registration.unregister()))

  const cacheNames = await caches.keys()
  await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))

  window.location.reload()
}

clearOldPwaCacheOnce().catch(() => {
  localStorage.setItem(CACHE_RESET_KEY, __APP_VERSION__)
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
