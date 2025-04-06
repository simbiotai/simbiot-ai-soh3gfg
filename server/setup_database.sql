-- Создание базы данных
CREATE DATABASE IF NOT EXISTS trading_system;
USE trading_system;

-- Создание таблицы для API ключей
CREATE TABLE IF NOT EXISTS api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exchange VARCHAR(50) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    api_secret VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_exchange (exchange)
);

-- Создание пользователя для приложения
CREATE USER IF NOT EXISTS 'trading_app'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON trading_system.* TO 'trading_app'@'localhost';
FLUSH PRIVILEGES; 