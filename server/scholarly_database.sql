CREATE DATABASE IF NOT EXISTS Scholarly;

USE Scholarly;

CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(120) UNIQUE NOT NULL, /*cannot have two users with the same email */
    first_name VARCHAR(80),
    last_name VARCHAR(80),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (user_id, email)
);

CREATE TABLE IF NOT EXISTS logins (
    user_id INT NOT NULL PRIMARY KEY,
    password_hash TEXT NOT NULL,
    failed_attempts INT DEFAULT 0, /* if 5 failed_attempts, lock the account and then reset failed attempts */
    locked_until TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);


CREATE TABLE IF NOT EXISTS topics (
    topic_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    topic_name VARCHAR(80) NOT NULL,
    topic_desc VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS decks (
    deck_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL, 
    deck_name VARCHAR(80) NOT NULL,
    deck_desc VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id)
);

CREATE TABLE IF NOT EXISTS flashcards (
    flashcard_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    deck_id INT NOT NULL, 
    correct_check BOOLEAN,
    question VARCHAR(150) NOT NULL,
    answer VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (deck_id) REFERENCES decks(deck_id)
);

