import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function EventModal({ eventId, currentUser, onClose, onAuthRequired }) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [tickets, setTickets] = useState(null)
  const [bought, setBought] = useState(false)

  useEffect(() => {
    api.getEvent(eventId)
      .then(data => {
        setEvent(data)
        setTickets(data.tickets_available)
        setSubscribed(data.subscribed)
      })
      .catch(() => onClose())
      .finally(() => setLoading(false))
  }, [eventId])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleBuy = async () => {
    if (!currentUser) { onAuthRequired(); return }
    setActionLoading(true)
    try {
      const res = await api.buyTicket(eventId)
      setTickets(res.tickets_available)
      setBought(true)
    } catch (e) {
      alert(e.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!currentUser) { onAuthRequired(); return }
    setActionLoading(true)
    try {
      await api.subscribeToEvent(eventId)
      setSubscribed(true)
    } catch (e) {
      alert(e.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setActionLoading(true)
    try {
      await api.unsubscribeFromEvent(eventId)
      setSubscribed(false)
    } catch (e) {
      alert(e.message)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fff',
        borderRadius: 10,
        maxWidth: 680,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 1,
            background: 'rgba(0,0,0,0.4)', border: 'none',
            color: '#fff', borderRadius: '50%',
            width: 32, height: 32, fontSize: 18,
            cursor: 'pointer', lineHeight: '32px', textAlign: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
        >×</button>

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#999' }}>Загрузка...</div>
        ) : event && (
          <>
            {/* Постер */}
            <div style={{
              height: 300,
              backgroundImage: `url(/${event.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '10px 10px 0 0',
            }} />

            {/* Контент */}
            <div style={{ padding: '24px 28px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: '1.4em', fontWeight: 700, lineHeight: 1.3 }}>{event.name}</h2>
                <span style={{
                  background: '#f5f5f5', padding: '4px 10px',
                  borderRadius: 4, fontSize: '0.85em', whiteSpace: 'nowrap', color: '#555',
                }}>{event.age_restriction}</span>
              </div>

              <div style={{ display: 'flex', gap: 24, color: '#555', fontSize: '0.95em', marginBottom: 20, flexWrap: 'wrap' }}>
                <span>📅 {event.date}</span>
                <span>📍 {event.place}</span>
                {event.price && <span style={{ color: '#d31f26', fontWeight: 600 }}>от {event.price} ₽</span>}
              </div>

              {/* Билеты */}
              <div style={{
                padding: '16px 20px',
                borderRadius: 8,
                background: tickets > 0 ? '#f0faf0' : '#fff5f5',
                border: `1px solid ${tickets > 0 ? '#b2dfb2' : '#f5b8b8'}`,
                marginBottom: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
              }}>
                <div>
                  {tickets > 0 ? (
                    <>
                      <div style={{ fontWeight: 600, color: '#2e7d32' }}>Билеты в наличии</div>
                      <div style={{ fontSize: '0.85em', color: '#555', marginTop: 2 }}>Осталось: {tickets} шт.</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight: 600, color: '#c0392b' }}>Билетов нет</div>
                      <div style={{ fontSize: '0.85em', color: '#555', marginTop: 2 }}>Уведомим, когда появятся</div>
                    </>
                  )}
                </div>

                {bought ? (
                  <div style={{ color: '#2e7d32', fontWeight: 600 }}>✓ Билет куплен!</div>
                ) : tickets > 0 ? (
                  <button
                    onClick={handleBuy}
                    disabled={actionLoading}
                    style={{
                      padding: '12px 32px', fontSize: '1em', fontWeight: 700,
                      background: '#d31f26', color: '#fff', border: 'none',
                      borderRadius: 6, cursor: actionLoading ? 'not-allowed' : 'pointer',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                      opacity: actionLoading ? 0.6 : 1,
                      boxShadow: '0 4px 14px rgba(211,31,38,0.35)',
                      transition: 'box-shadow 0.2s',
                    }}
                    onMouseEnter={e => { if (!actionLoading) e.currentTarget.style.boxShadow = '0 6px 20px rgba(211,31,38,0.5)' }}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(211,31,38,0.35)'}
                  >
                    {actionLoading ? '...' : 'Купить билет'}
                  </button>
                ) : subscribed ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <div style={{ color: '#888', fontSize: '0.9em' }}>✓ Вы подписаны на уведомления</div>
                    <button
                      onClick={handleUnsubscribe}
                      disabled={actionLoading}
                      style={{
                        background: 'none', border: 'none', padding: 0,
                        color: '#aaa', fontSize: '0.8em', cursor: 'pointer',
                        textDecoration: 'underline', textDecorationStyle: 'dotted',
                        opacity: actionLoading ? 0.5 : 1,
                      }}
                    >
                      Отписаться
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleSubscribe}
                    disabled={actionLoading}
                    style={{
                      padding: '12px 28px', fontSize: '1em', fontWeight: 600,
                      background: '#fff', color: '#d31f26',
                      border: '2px solid #d31f26', borderRadius: 6,
                      cursor: actionLoading ? 'not-allowed' : 'pointer',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                      opacity: actionLoading ? 0.6 : 1,
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => { if (!actionLoading) { e.currentTarget.style.background = '#d31f26'; e.currentTarget.style.color = '#fff' } }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#d31f26' }}
                  >
                    {actionLoading ? '...' : 'Уведомить о билетах'}
                  </button>
                )}
              </div>

              {!currentUser && (
                <div style={{ color: '#888', fontSize: '0.9em', textAlign: 'center' }}>
                  <span
                    onClick={() => { onClose(); onAuthRequired() }}
                    style={{ color: '#d31f26', cursor: 'pointer', textDecoration: 'underline' }}
                  >Войдите</span>, чтобы купить билет или подписаться на уведомления
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
