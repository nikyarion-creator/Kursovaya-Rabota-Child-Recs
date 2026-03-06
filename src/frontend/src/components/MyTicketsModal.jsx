import React, { useState, useEffect } from 'react'
import { api } from '../api'
import ReturnModal from './ReturnModal'

export default function MyTicketsModal({ onClose }) {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [returning, setReturning] = useState(null) // purchase object

  useEffect(() => {
    api.getMyTickets()
      .then(setPurchases)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleReturned = (purchaseId) => {
    setPurchases(prev => prev.map(p => p.id === purchaseId ? { ...p, status: 'returned' } : p))
    setReturning(null)
  }

  const active = purchases.filter(p => p.status === 'active')
  const returned = purchases.filter(p => p.status === 'returned')

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
        }}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <div style={{
          background: '#fff', borderRadius: 12, width: '100%', maxWidth: 620,
          maxHeight: '88vh', overflowY: 'auto',
          boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
          position: 'relative',
        }}>
          {/* Header */}
          <div style={{
            padding: '24px 28px 20px', borderBottom: '1px solid #f0f0f0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, background: '#fff', zIndex: 1,
          }}>
            <h2 style={{ margin: 0, fontSize: '1.2em', fontWeight: 700 }}>Мои билеты</h2>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(0,0,0,0.07)', border: 'none', borderRadius: '50%',
                width: 32, height: 32, fontSize: 18, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>
          </div>

          <div style={{ padding: '20px 28px 28px' }}>
            {loading ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>Загрузка...</div>
            ) : purchases.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5em', marginBottom: 12 }}>🎟</div>
                <div style={{ color: '#888', fontSize: '0.95em' }}>У вас пока нет купленных билетов</div>
              </div>
            ) : (
              <>
                {active.length > 0 && (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: '0.8em', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                      Активные — {active.length}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {active.map(p => (
                        <TicketCard key={p.id} purchase={p} onReturn={() => setReturning(p)} />
                      ))}
                    </div>
                  </div>
                )}

                {returned.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.8em', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
                      Возвращённые — {returned.length}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {returned.map(p => (
                        <TicketCard key={p.id} purchase={p} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {returning && (
        <ReturnModal
          purchase={returning}
          onClose={() => setReturning(null)}
          onReturned={handleReturned}
        />
      )}
    </>
  )
}

function TicketCard({ purchase, onReturn }) {
  const isReturned = purchase.status === 'returned'
  const date = new Date(purchase.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div style={{
      display: 'flex', gap: 16, alignItems: 'center',
      border: `1.5px solid ${isReturned ? '#f0f0f0' : '#e8e8e8'}`,
      borderRadius: 10, padding: '14px 16px',
      background: isReturned ? '#fafafa' : '#fff',
      opacity: isReturned ? 0.7 : 1,
    }}>
      {/* Poster thumb */}
      <div style={{
        width: 60, height: 60, borderRadius: 8, flexShrink: 0,
        backgroundImage: `url(/${purchase.event.image})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: isReturned ? 'grayscale(1) opacity(0.5)' : 'none',
      }} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 700, fontSize: '0.95em', marginBottom: 3,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          color: isReturned ? '#999' : '#222',
        }}>
          {purchase.event.name}
        </div>
        <div style={{ fontSize: '0.82em', color: '#888' }}>
          {purchase.event.date} · {purchase.event.place}
        </div>
        <div style={{ fontSize: '0.78em', color: '#aaa', marginTop: 2 }}>
          Куплен {date}
        </div>
      </div>

      {/* Status / action */}
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        {isReturned ? (
          <span style={{
            display: 'inline-block', padding: '4px 10px',
            background: '#f0f0f0', color: '#999',
            borderRadius: 20, fontSize: '0.78em', fontWeight: 600,
          }}>
            Возвращён
          </span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <span style={{
              display: 'inline-block', padding: '4px 10px',
              background: '#e8f5e9', color: '#2e7d32',
              borderRadius: 20, fontSize: '0.78em', fontWeight: 600,
            }}>
              Активен
            </span>
            <button
              onClick={onReturn}
              style={{
                background: 'none', border: 'none', padding: 0,
                color: '#d31f26', fontSize: '0.78em', cursor: 'pointer',
                textDecoration: 'underline', textDecorationStyle: 'dotted',
              }}
            >
              Вернуть билет
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
