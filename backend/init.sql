CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email <> ''),
    first_name VARCHAR(100) NOT NULL CHECK (first_name <> ''),
    last_name VARCHAR(100) NOT NULL CHECK (last_name <> ''),
    password_hash TEXT NOT NULL CHECK (password_hash <> ''),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('admin', 'user')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE CHECK (name <> ''),
    description TEXT NOT NULL CHECK (description <> ''),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL CHECK (title <> ''),
    text TEXT NOT NULL CHECK (text <> ''),
    published_at TIMESTAMP NOT NULL DEFAULT NOW(),
    visits INTEGER NOT NULL DEFAULT 0,
    author_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT
);
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE CHECK (name <> '')
);

CREATE TABLE news_tags (
    news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (news_id, tag_id)
);
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL CHECK (author_name <> ''),
    text TEXT NOT NULL CHECK (text <> ''),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE
);

CREATE TABLE news_reactions (
    id SERIAL PRIMARY KEY,
    news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL CHECK (session_id <> ''),
    reaction_type VARCHAR(10) NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(news_id, session_id)
);

CREATE TABLE comment_reactions (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL CHECK (session_id <> ''),
    reaction_type VARCHAR(10) NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(comment_id, session_id)
);
CREATE TABLE news_visits (
    id SERIAL PRIMARY KEY,
    news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NOT NULL CHECK (session_id <> ''),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(news_id, session_id)
);