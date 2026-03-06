import React, { useState } from 'react'
import { api } from '../api'

export default function AuthModal({ mode: initialMode, onSuccess, onClose }) {
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = mode === 'register'
        ? await api.register(form)
        : await api.login({ email: form.email, password: form.password })
      onSuccess(user)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="authorize" style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 1000, alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />
      <div className="authorize-window" style={{ position: 'relative', zIndex: 1, background: '#fff', padding: '32px', borderRadius: '8px', width: '360px', maxWidth: '90vw' }}>
        <div className="close" onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer', fontSize: 20 }}>✕</div>
        <h2 style={{ marginBottom: 20 }}>{mode === 'login' ? 'Войти' : 'Регистрация'}</h2>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="field" style={{ marginBottom: 12 }}>
              <input
                type="text"
                name="name"
                placeholder="Имя"
                value={form.name}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
          )}
          <div className="field" style={{ marginBottom: 12 }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <div className="field" style={{ marginBottom: 16 }}>
            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: 4, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          {error && <div style={{ color: '#d31f26', marginBottom: 12, fontSize: 13 }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '1em',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              background: '#d31f26',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 14px rgba(211,31,38,0.3)',
              transition: 'opacity 0.15s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? '...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>
        <div style={{ marginTop: 16, textAlign: 'center', fontSize: 13, color: '#666' }}>
          {mode === 'login' ? (
            <span>Нет аккаунта?{' '}
              <a href="#" style={{ color: '#d31f26' }} onClick={e => { e.preventDefault(); setMode('register') }}>
                Зарегистрироваться
              </a>
            </span>
          ) : (
            <span>Уже есть аккаунт?{' '}
              <a href="#" style={{ color: '#d31f26' }} onClick={e => { e.preventDefault(); setMode('login') }}>
                Войти
              </a>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
