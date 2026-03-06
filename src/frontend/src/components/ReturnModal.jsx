import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { api } from '../api'

export default function ReturnModal({ purchase, onClose, onReturned }) {
  const [reasonType, setReasonType] = useState(null) // 'certificate' | 'other'
  const [reasonText, setReasonText] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef()

  const handleSubmit = async () => {
    setError('')
    if (!reasonType) { setError('Выберите причину возврата'); return }
    if (reasonType === 'certificate' && !file) { setError('Прикрепите PDF-файл справки'); return }
    if (reasonType === 'other' && !reasonText.trim()) { setError('Опишите причину'); return }

    const fd = new FormData()
    fd.append('reason_type', reasonType)
    if (reasonType === 'certificate') fd.append('certificate', file)
    if (reasonType === 'other') fd.append('reason_text', reasonText)

    setLoading(true)
    try {
      await api.returnTicket(purchase.id, fd)
      onReturned(purchase.id)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fff', borderRadius: 12, width: '100%', maxWidth: 480,
        boxShadow: '0 24px 64px rgba(0,0,0,0.25)', padding: '32px 32px 28px',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%',
            width: 30, height: 30, fontSize: 16, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >×</button>

        <h3 style={{ margin: '0 0 6px', fontSize: '1.15em', fontWeight: 700 }}>Возврат билета</h3>
        <p style={{ margin: '0 0 24px', color: '#666', fontSize: '0.9em', lineHeight: 1.4 }}>
          {purchase.event.name}
        </p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: '0.95em' }}>Причина возврата</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={reasonOptionStyle(reasonType === 'certificate')} onClick={() => setReasonType('certificate')}>
              <div style={radioDotStyle(reasonType === 'certificate')} />
              <div>
                <div style={{ fontWeight: 600 }}>По справке</div>
                <div style={{ fontSize: '0.83em', color: '#777', marginTop: 2 }}>
                  Медицинская справка или другой официальный документ (PDF)
                </div>
              </div>
            </div>

            <div style={reasonOptionStyle(reasonType === 'other')} onClick={() => setReasonType('other')}>
              <div style={radioDotStyle(reasonType === 'other')} />
              <div>
                <div style={{ fontWeight: 600 }}>Иная причина</div>
                <div style={{ fontSize: '0.83em', color: '#777', marginTop: 2 }}>
                  Опишите причину в произвольной форме
                </div>
              </div>
            </div>
          </div>
        </div>

        {reasonType === 'certificate' && (
          <div style={{ marginBottom: 20 }}>
            <div
              onClick={() => fileRef.current.click()}
              style={{
                border: `2px dashed ${file ? '#2e7d32' : '#ccc'}`,
                borderRadius: 8, padding: '18px 20px', textAlign: 'center',
                cursor: 'pointer', background: file ? '#f0faf0' : '#fafafa',
                transition: 'all 0.2s',
              }}
            >
              {file ? (
                <div style={{ color: '#2e7d32', fontWeight: 600 }}>
                  📄 {file.name}
                  <div style={{ fontSize: '0.8em', fontWeight: 400, marginTop: 4, color: '#555' }}>
                    Нажмите, чтобы заменить
                  </div>
                </div>
              ) : (
                <div style={{ color: '#888' }}>
                  <div style={{ fontSize: '1.6em', marginBottom: 6 }}>📎</div>
                  <div>Нажмите, чтобы выбрать PDF-файл</div>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={e => setFile(e.target.files[0] || null)}
            />
          </div>
        )}

        {reasonType === 'other' && (
          <div style={{ marginBottom: 20 }}>
            <textarea
              value={reasonText}
              onChange={e => setReasonText(e.target.value)}
              placeholder="Опишите причину возврата..."
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                border: '1px solid #ddd', borderRadius: 8, padding: '12px 14px',
                fontSize: '0.95em', resize: 'vertical', outline: 'none',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = '#d31f26'}
              onBlur={e => e.target.style.borderColor = '#ddd'}
            />
          </div>
        )}

        {error && (
          <div style={{ color: '#d31f26', fontSize: '0.88em', marginBottom: 16 }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '11px 24px', fontSize: '0.95em', fontWeight: 600,
              background: '#fff', color: '#555', border: '1px solid #ddd',
              borderRadius: 6, cursor: 'pointer',
            }}
          >Отмена</button>
          <button
            onClick={handleSubmit}
            disabled={loading || !reasonType}
            style={{
              padding: '11px 28px', fontSize: '0.95em', fontWeight: 700,
              background: loading || !reasonType ? '#e0e0e0' : '#d31f26',
              color: loading || !reasonType ? '#999' : '#fff',
              border: 'none', borderRadius: 6,
              cursor: loading || !reasonType ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {loading ? 'Отправка...' : 'Вернуть билет'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

function reasonOptionStyle(active) {
  return {
    display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
    border: `1.5px solid ${active ? '#d31f26' : '#e0e0e0'}`,
    borderRadius: 8, cursor: 'pointer', background: active ? '#fff8f8' : '#fff',
    transition: 'border-color 0.2s, background 0.2s',
  }
}

function radioDotStyle(active) {
  return {
    flexShrink: 0, width: 18, height: 18, borderRadius: '50%', marginTop: 2,
    border: `2px solid ${active ? '#d31f26' : '#ccc'}`,
    background: active ? '#d31f26' : '#fff',
    transition: 'all 0.2s',
  }
}
