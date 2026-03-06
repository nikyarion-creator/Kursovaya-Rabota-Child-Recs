import React, { useState, useEffect } from 'react'
import { api } from '../api'
import ChildProfileForm from './ChildProfileForm'
import EventCard from './EventCard'
import EventModal from './EventModal'

const TABS = [
  { key: 'thismonth', label: 'На месяц' },
  { key: 'thisweek', label: 'На неделю' },
  { key: 'weekend', label: 'На выходные' },
]

export default function EventsSection({ currentUser, onAuthRequired, showEditProfile = true }) {
  const [activeTab, setActiveTab] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [profileFilled, setProfileFilled] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [modalEventId, setModalEventId] = useState(null)

  useEffect(() => {
    if (!currentUser) {
      setProfileFilled(false)
      return
    }
    api.getChildProfile()
      .then(data => setProfileFilled(!!data))
      .catch(() => setProfileFilled(false))
  }, [currentUser])

  useEffect(() => {
    if (profileFilled) {
      api.getRecommendations(activeTab)
        .then(setRecommendations)
        .catch(() => {})
    }
  }, [profileFilled, activeTab])

  const handleCtaClick = () => {
    if (!currentUser) {
      onAuthRequired()
      return
    }
    setShowForm(true)
  }

  const handleFormSaved = async () => {
    try {
      const data = await api.getRecommendations()
      setRecommendations(data)
      setProfileFilled(true)
      setShowForm(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleEditProfile = () => {
    setIsEditing(true)
    setProfileFilled(false)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setShowForm(false)
    setProfileFilled(true)
  }

  return (
    <>
      {!profileFilled && !showForm && (
        <section style={{ background: '#f8f8f8', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', padding: '40px 0' }}>
          <div className="container" role="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ fontSize: '1.3em', fontWeight: 700, marginBottom: 6 }}>
                  Подберём мероприятия для вашего ребёнка
                </div>
                <div style={{ color: '#666', fontSize: '0.95em' }}>
                  Заполните анкету — и мы покажем события, которые ему точно понравятся
                </div>
              </div>
              <button
                onClick={handleCtaClick}
                style={{
                  padding: '14px 36px',
                  fontSize: '1em',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  background: '#d31f26',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  boxShadow: '0 4px 14px rgba(211,31,38,0.35)',
                  transition: 'box-shadow 0.2s, transform 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(211,31,38,0.5)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(211,31,38,0.35)'}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                Заполнить анкету
              </button>
            </div>
          </div>
        </section>
      )}

      {showForm && (
        <ChildProfileForm
          onSaved={handleFormSaved}
          onCancel={isEditing ? handleCancelEdit : undefined}
        />
      )}

      {profileFilled && (
        <>
          <section className="popular-menu">
            <div className="container" role="container">
              <div className="popular-menu-items">
                {TABS.map(t => (
                  <div
                    key={t.key}
                    className={`menu-item${activeTab === t.key ? ' active' : ''}`}
                    onClick={() => setActiveTab(prev => prev === t.key ? null : t.key)}
                  >
                    {t.label}
                  </div>
                ))}
                {showEditProfile && (
                  <div className="menu-item menu-item--edit" onClick={handleEditProfile}>
                    <span style={{ marginRight: 5 }}>✎</span>Изменить анкету
                  </div>
                )}
              </div>
            </div>
          </section>

          {recommendations.length > 0 && (
            <section className="events-cards-container">
              <section className="event">
                <div className="container" role="container">
                  <div className="event-title">
                    <h2 className="event-title">Рекомендации для вашего ребёнка</h2>
                  </div>
                  <div className="event-list-container">
                    {recommendations.map(event => (
                      <EventCard key={event.id} event={event} onClick={e => setModalEventId(e.id)} />
                    ))}
                  </div>
                </div>
              </section>
            </section>
          )}
        </>
      )}
      {modalEventId && (
        <EventModal
          eventId={modalEventId}
          currentUser={currentUser}
          onClose={() => setModalEventId(null)}
          onAuthRequired={() => { setModalEventId(null); onAuthRequired() }}
        />
      )}
    </>
  )
}
