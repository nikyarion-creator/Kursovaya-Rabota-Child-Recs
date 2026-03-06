import React from 'react'

export default function EventCard({ event, onClick }) {
  return (
    <div className="event-card" device="device">
      <div className="content">
        <a href="#" onClick={e => { e.preventDefault(); onClick && onClick(event) }}>
          <div>
            <section
              className="poster"
              style={{ backgroundImage: `url(/${event.image})` }}
            >
              {event.price && (
                <div className="price">
                  <div className="text">
                    от <span>{event.price} ₽</span>
                  </div>
                </div>
              )}
            </section>

            <section className="poster-info">
              <h5 className="name" title={event.name}>{event.name}</h5>
              <div className="age">{event.age_restriction}</div>
            </section>

            <section className="details">
              <div className="cell date">
                <span>{event.date}</span>
              </div>
              <div className="cell place">
                <span>{event.place}</span>
              </div>
            </section>
          </div>
        </a>
      </div>
    </div>
  )
}
