import React from 'react'

const BASE_CATEGORIES = [
  { key: 'all_classes', label: 'Все события', countKey: 'total' },
  { key: 'kontserti', label: 'Концерты', countKey: null },
  { key: 'sport', label: 'Спорт', countKey: null },
  { key: 'football', label: 'Футбол', countKey: null },
  { key: 'hockey', label: 'Хоккей', countKey: null },
  { key: 'teatr', label: 'Театры', countKey: null },
  { key: 'festivali', label: 'Фестивали', countKey: null },
  { key: 'detjam', label: 'Детям', countKey: 'detjam' },
]

export default function CategoryMenu({ eventCounts, activeCategory, onCategoryChange }) {
  const categories = BASE_CATEGORIES.map(cat => ({
    ...cat,
    count: cat.countKey ? (eventCounts?.[cat.countKey] ?? 0) : 0,
  }))

  const activeCat = categories.find(c => c.key === activeCategory)
  const showEmpty = activeCat && activeCat.count === 0

  return (
    <>
      <section className="top-category-main-menu">
        <div className="container" role="container">
          <div className="top-category-menu-main-items">
            {categories.map(cat => (
              <div
                key={cat.key}
                className={`menu-item${activeCategory === cat.key ? ' active' : ''}`}
                filter={cat.key}
                onClick={() => onCategoryChange(cat.key)}
              >
                <span>{cat.label}</span>
                <div>{cat.count}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {showEmpty && (
        <section style={{ padding: '60px 0', textAlign: 'center' }}>
          <div className="container" role="container">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: '#aaa' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d0d0d0" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <div style={{ fontSize: '1.1em', fontWeight: 600, color: '#bbb' }}>Мероприятий не найдено</div>
              <div style={{ fontSize: '0.9em', color: '#ccc' }}>В данной категории пока нет мероприятий</div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
