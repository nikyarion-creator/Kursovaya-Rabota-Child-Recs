import React from 'react'

export default function Footer() {
  return (
    <>
      <section className="footer-top">
        <div className="container" role="container">
          <div className="column-1">
            <ul>
              <li><a href="#">СМИ о нас</a></li>
              <li><a href="#">О компании</a></li>
              <li><a href="#">Гарантии</a></li>
              <li><a href="#">Контакты</a></li>
            </ul>
          </div>
          <div className="column-2">
            <ul>
              <li><a href="#">Как продать билет?</a></li>
              <li><a href="#">Как купить билеты?</a></li>
              <li><a href="#">Помощь</a></li>
              <li><a href="#">Новости</a></li>
            </ul>
          </div>
          <div className="column-3">
            <div>возникли сложности? свяжитесь с нами.</div>
            <ul>
              <li>Email: <a href="mailto:support@kurcach.ru">support@kurcach.ru</a></li>
              <li>Телефон: <a href="tel:+74991107071">+7 (499) 110-70-71</a></li>
              <li>Часы работы с 10:00-19:00, будни</li>
            </ul>
          </div>
          <div className="column-4">
            <div className="logo-et">
              <a href="/" title="Афиша">
                <img src="/images/its-logo.png" alt="Афиша" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="footer-top">
        <div className="container" role="container">
          <div className="license">
            Афиша (12+). Сайт создан в учебных целях.
          </div>
        </div>
      </section>

      <section className="footer-bottom">
        <div className="container" role="container">
          <div className="license">
            Пользуясь этим сайтом вы соглашаетесь с условиями{' '}
            <a href="#">Лицензионного договора</a>
          </div>
          <div className="social">
            <img src="/images/mir.jpeg" height="30" width="50" alt="Мир" />
            <img src="/images/visa.jpeg" height="30" width="50" alt="Visa" />
            <img src="/images/mastercard.jpeg" height="30" width="50" alt="Mastercard" />
            <a href="https://vk.com" target="_blank" rel="noreferrer">
              <img src="/images/et4_soc_vk_white.svg" alt="vk" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <img src="/images/et4_soc_youtube_white.svg" alt="youtube" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
