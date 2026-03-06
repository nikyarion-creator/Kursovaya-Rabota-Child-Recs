import React, { useState, useEffect, useCallback } from 'react'
import { api } from './api'
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import EventsSection from './components/EventsSection'
import Footer from './components/Footer'
import CategoryMenu from './components/CategoryMenu'
import MyTicketsModal from './components/MyTicketsModal'

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' })
  const [myTicketsOpen, setMyTicketsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [eventCounts, setEventCounts] = useState({ detjam: 0, total: 0 })
  const [activeCategory, setActiveCategory] = useState('detjam')

  useEffect(() => {
    api.me()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
      .finally(() => setAuthLoading(false))
    api.getEventCounts()
      .then(setEventCounts)
      .catch(() => {})
  }, [])

  const loadNotifications = useCallback(() => {
    api.getNotifications()
      .then(setNotifications)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!currentUser) { setNotifications([]); return }
    loadNotifications()
    const interval = setInterval(loadNotifications, 30_000)
    return () => clearInterval(interval)
  }, [currentUser, loadNotifications])

  const handleNotificationsOpen = () => {
    api.markNotificationsRead()
      .then(loadNotifications)
      .catch(() => {})
  }

  const openAuth = (mode = 'login') => setAuthModal({ open: true, mode })
  const closeAuth = () => setAuthModal({ open: false, mode: 'login' })

  const handleAuthSuccess = (user) => {
    setCurrentUser(user)
    closeAuth()
  }

  const handleLogout = async () => {
    await api.logout()
    setCurrentUser(null)
    setNotifications([])
  }

  if (authLoading) return null

  return (
    <>
      <Header
        currentUser={currentUser}
        onLoginClick={() => openAuth('login')}
        onLogout={handleLogout}
        onMyTickets={() => setMyTicketsOpen(true)}
        notifications={notifications}
        onNotificationsOpen={handleNotificationsOpen}
      />

      <section id="welcome">
        <section id="bg" style={{ background: 'url(/images/main_image_poster.jpg) center/cover' }} />
        <div className="container" role="container">
          <div className="welcome">
            <h1>Официальные билеты на мероприятия</h1>
          </div>
        </div>
      </section>

      <CategoryMenu
        eventCounts={eventCounts}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {(activeCategory === 'detjam' || activeCategory === 'all_classes') && (
        <EventsSection
          currentUser={currentUser}
          onAuthRequired={() => openAuth('login')}
          showEditProfile={activeCategory === 'detjam'}
        />
      )}

      {authModal.open && (
        <AuthModal
          mode={authModal.mode}
          onSuccess={handleAuthSuccess}
          onClose={closeAuth}
        />
      )}

      {myTicketsOpen && (
        <MyTicketsModal onClose={() => setMyTicketsOpen(false)} />
      )}

      <Footer />
    </>
  )
}
