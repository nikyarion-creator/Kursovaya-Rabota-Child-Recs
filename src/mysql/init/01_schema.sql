SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(256)  NOT NULL
);

CREATE TABLE IF NOT EXISTS child_profiles (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT           NOT NULL UNIQUE,
    age           TINYINT,
    gender        CHAR(1),
    birth_date    VARCHAR(20),
    hobby         VARCHAR(200),
    fav_sport     VARCHAR(100),
    fav_character VARCHAR(100),
    fav_book      VARCHAR(100),
    fav_food      VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS events (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(300) NOT NULL,
    date              VARCHAR(100),
    place             VARCHAR(200),
    price             INT,
    image             VARCHAR(300),
    age_restriction   VARCHAR(10),
    category          VARCHAR(50),
    tags              VARCHAR(500),
    min_age           INT,
    max_age           INT,
    tickets_available INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS event_subscriptions (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    event_id   INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_sub (user_id, event_id),
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchases (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    event_id   INT NOT NULL,
    status     VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    event_id   INT,
    message    VARCHAR(500) NOT NULL,
    is_read    TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

INSERT INTO events (name, date, place, price, image, age_restriction, category, tags, min_age, max_age, tickets_available) VALUES
(
    'Шоу каскадёров мастера Панина «Русский форсаж»',
    '15 марта 2026',
    'Москва',
    1000,
    'images/big.jpg',
    '12+',
    'detjam',
    'трюки,экшн,машины,шоу',
    12, 17, 50
),
(
    'Весь этот цирк',
    'март–апрель 2026',
    'Цирк Никулина на Цветном бульваре',
    1500,
    'images/big_1.jpg',
    '6+',
    'detjam',
    'цирк,животные,клоуны,представление',
    6, 17, 0
),
(
    'Майнкрафт vs Роблокс: Челлендж Шоу',
    '7, 28 марта, 4 апреля',
    'ZooDepo',
    790,
    'images/big_2.jpg',
    '6+',
    'detjam',
    'minecraft,roblox,игры,геймеры,интерактив',
    6, 14, 12
);
