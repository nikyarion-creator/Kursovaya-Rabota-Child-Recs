import React, { useState, useEffect } from 'react'
import { api } from '../api'

export default function ChildProfileForm({ onSaved, onCancel }) {
  const [form, setForm] = useState({
    age: '', birth_date: '', gender: '',
    hobby: '', fav_sport: '', fav_character: '', fav_book: '', fav_food: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getChildProfile().then(data => {
      if (data) setForm(f => ({ ...f, ...data }))
    }).catch(() => {})
  }, [])

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  const setGender = (g) => setForm(f => ({ ...f, gender: g }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.saveChildProfile(form)
      setSuccess(true)
      setTimeout(() => onSaved(), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section id="child-form-section">
        <div className="container" role="container">
          <div className="child-form-inline">
            <div className="child-form-success">
              <h3>Анкета успешно заполнена!</h3>
              <p>Подбираем рекомендации...</p>
              <div className="child-form-spinner" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="child-form-section">
      <div className="container" role="container">
        <div className="child-form-inline">
          <h2>Анкета ребёнка</h2>
          <p className="child-form-desc">
            Заполните анкету — и мы подберём мероприятия, которые понравятся вашему ребёнку.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="child-form-grid">
              <div className="input-with-label">
                <input
                  type="number" name="age" min="1" max="17"
                  placeholder=" " className="field-grey"
                  value={form.age} onChange={handleChange}
                />
                <label>Возраст ребёнка</label>
              </div>
              <div className="input-with-label">
                <input
                  type="text" name="birth_date"
                  placeholder=" " className="field-grey"
                  value={form.birth_date} onChange={handleChange}
                />
                <label>Дата рождения (дд.мм.гг)</label>
              </div>
              <div className="input-with-label gender-field">
                <span className="gender-label">Пол ребёнка</span>
                <div className="gender-buttons">
                  <button
                    type="button"
                    className={`gender-btn${form.gender === 'М' ? ' active' : ''}`}
                    onClick={() => setGender('М')}
                  >М</button>
                  <button
                    type="button"
                    className={`gender-btn${form.gender === 'Ж' ? ' active' : ''}`}
                    onClick={() => setGender('Ж')}
                  >Ж</button>
                </div>
              </div>
              <div className="input-with-label">
                <input
                  type="text" name="hobby"
                  placeholder=" " className="field-grey"
                  value={form.hobby} onChange={handleChange}
                />
                <label>Хобби ребёнка</label>
              </div>
              <div className="input-with-label">
                <input
                  type="text" name="fav_sport"
                  placeholder=" " className="field-grey"
                  value={form.fav_sport} onChange={handleChange}
                />
                <label>Любимый спорт</label>
              </div>
              <div className="input-with-label">
                <input
                  type="text" name="fav_character"
                  placeholder=" " className="field-grey"
                  value={form.fav_character} onChange={handleChange}
                />
                <label>Любимый персонаж</label>
              </div>
              <div className="input-with-label">
                <input
                  type="text" name="fav_book"
                  placeholder=" " className="field-grey"
                  value={form.fav_book} onChange={handleChange}
                />
                <label>Любимая книга</label>
              </div>
              <div className="input-with-label">
                <input
                  type="text" name="fav_food"
                  placeholder=" " className="field-grey"
                  value={form.fav_food} onChange={handleChange}
                />
                <label>Любимая еда</label>
              </div>
            </div>
            <div className="child-form-actions" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {error && <div style={{ color: '#d31f26', marginBottom: 8, fontSize: 13 }}>{error}</div>}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 40px',
                  fontSize: '1em',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  background: '#fff',
                  color: '#d31f26',
                  border: '2px solid #d31f26',
                  borderRadius: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  transition: 'background 0.15s, color 0.15s',
                  opacity: loading ? 0.6 : 1,
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#d31f26'; e.currentTarget.style.color = '#fff' } }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#d31f26' }}
              >
                {loading ? '...' : 'Сохранить'}
              </button>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  style={{
                    padding: '12px 40px',
                    fontSize: '1em',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: '#fff',
                    color: '#555',
                    border: '2px solid #bbb',
                    borderRadius: 6,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#222'; e.currentTarget.style.borderColor = '#666' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#bbb' }}
                >
                  Отмена
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
