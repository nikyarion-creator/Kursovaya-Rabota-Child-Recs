import React, { useState, useRef, useEffect } from 'react'

export default function Header({ currentUser, onLoginClick, onLogout, onMyTickets, notifications, onNotificationsOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [isWhite, setIsWhite] = useState(false)
  const dropdownCloseTimer = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    function handleScroll() {
      const filterMenu = document.querySelector('.top-category-main-menu')
      if (!filterMenu) return
      setIsWhite(filterMenu.getBoundingClientRect().top < 105)
    }
    document.addEventListener('scroll', handleScroll, { passive: true })
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter(n => !n.is_read).length

  const handleNotifOpen = () => {
    setNotifOpen(o => !o)
    if (!notifOpen && unreadCount > 0) onNotificationsOpen()
  }

  const openDropdown = () => {
    clearTimeout(dropdownCloseTimer.current)
    setDropdownOpen(true)
  }
  const closeDropdown = () => {
    dropdownCloseTimer.current = setTimeout(() => setDropdownOpen(false), 120)
  }

  const color = isWhite ? '#333' : '#fff'

  return (
    <section className={`header${isWhite ? ' white' : ''}`}>
      <div className="container" role="container">
        <div className="cell">
          <div className="logo">
            <a href="/" title="Афиша"><div className="logo-et4" /></a>
          </div>
          
        </div>

        <div className="cell">
          <div className="lang"><a>RU</a></div>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>

              {/* Bell */}
              <div ref={notifRef} style={{ position: 'relative' }}>
                <button
                  onClick={handleNotifOpen}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '6px 10px', position: 'relative',
                    color, display: 'flex', alignItems: 'center',
                    opacity: notifOpen ? 0.65 : 1, transition: 'opacity 0.15s',
                  }}
                  title="Уведомления"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute', top: 3, right: 5,
                      background: '#d31f26', color: '#fff',
                      borderRadius: '50%', width: 16, height: 16,
                      fontSize: 9, fontWeight: 700, lineHeight: '16px', textAlign: 'center',
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 6px)',
                    background: '#fff', border: '1px solid #eee',
                    borderRadius: 8, boxShadow: '0 8px 28px rgba(0,0,0,0.13)',
                    width: 320, zIndex: 200, overflow: 'hidden',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', fontWeight: 700, fontSize: '0.9em', color: '#333' }}>
                      Уведомления
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '20px 16px', textAlign: 'center', color: '#aaa', fontSize: '0.88em' }}>
                        Уведомлений пока нет
                      </div>
                    ) : (
                      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                        {notifications.map(n => (
                          <div key={n.id} style={{
                            padding: '12px 16px',
                            background: n.is_read ? '#fff' : '#fff8f8',
                            borderBottom: '1px solid #f5f5f5',
                            display: 'flex', gap: 12, alignItems: 'flex-start',
                          }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                              background: '#fce8e8', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d31f26" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                              </svg>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.88em', color: '#333', lineHeight: 1.4 }}>{n.message}</div>
                              <div style={{ fontSize: '0.75em', color: '#aaa', marginTop: 3 }}>
                                {new Date(n.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                              </div>
                            </div>
                            {!n.is_read && (
                              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#d31f26', flexShrink: 0, marginTop: 5 }} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile */}
              <div
                style={{ position: 'relative' }}
                onMouseEnter={openDropdown}
                onMouseLeave={closeDropdown}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  cursor: 'default', padding: '0 2px',
                  color, fontWeight: 600, fontSize: '0.85em',
                  textTransform: 'uppercase', letterSpacing: '0.03em',
                  lineHeight: '40px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  {currentUser.name}
                </div>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: '100%',
                    background: '#fff', border: '1px solid #eee',
                    borderRadius: 8, boxShadow: '0 8px 28px rgba(0,0,0,0.13)',
                    minWidth: 200, zIndex: 200, overflow: 'hidden',
                    paddingTop: 4,
                  }}>
                    <div style={{ padding: '10px 16px', color: '#aaa', fontSize: '0.9em', borderBottom: '1px solid #f0f0f0' }}>
                      {currentUser.email}
                    </div>
                    <DropdownItem
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z"/>
                          <polyline points="15 3 15 9 21 9"/>
                          <line x1="9" y1="14" x2="15" y2="14"/>
                          <line x1="9" y1="17" x2="12" y2="17"/>
                        </svg>
                      }
                      label="Мои билеты"
                      onClick={() => { onMyTickets(); setDropdownOpen(false) }}
                    />
                    <DropdownItem
                      icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                      }
                      label="Выйти"
                      onClick={() => { onLogout(); setDropdownOpen(false) }}
                      danger
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="authorization" onClick={onLoginClick} style={{ cursor: 'pointer' }}>
              Авторизация
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function DropdownItem({ icon, label, onClick, danger }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '11px 16px', cursor: 'pointer', fontSize: '0.9em',
        color: danger ? '#d31f26' : '#333',
        background: hovered ? '#f9f9f9' : 'transparent',
        transition: 'background 0.15s',
        display: 'flex', alignItems: 'center', gap: 10,
      }}
    >
      <span style={{ display: 'flex', opacity: danger ? 0.75 : 0.4, flexShrink: 0 }}>{icon}</span>
      {label}
    </div>
  )
}
