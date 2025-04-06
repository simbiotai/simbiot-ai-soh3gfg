import mysql.connector
from dotenv import load_dotenv
import os
import logging
import sys

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('db_init.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

# Загрузка переменных окружения
load_dotenv()

def init_database():
    # Получаем параметры подключения из переменных окружения
    config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', ''),
    }
    
    try:
        # Подключение к MySQL серверу
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        
        # Создание базы данных
        db_name = os.getenv('DB_NAME', 'trading_system')
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        cursor.execute(f"USE {db_name}")
        
        # Создание таблицы api_keys
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS api_keys (
                id INT AUTO_INCREMENT PRIMARY KEY,
                exchange VARCHAR(50) NOT NULL,
                api_key VARCHAR(255) NOT NULL,
                api_secret VARCHAR(255) NOT NULL,
                created_at DATETIME NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                UNIQUE KEY unique_exchange (exchange)
            )
        """)
        
        logging.info("База данных успешно инициализирована")
        return True
        
    except mysql.connector.Error as e:
        logging.error(f"Ошибка при инициализации базы данных: {str(e)}")
        return False
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("=== Инициализация базы данных ===")
    success = init_database()
    if success:
        print("✓ База данных успешно создана")
    else:
        print("✗ Ошибка при создании базы данных")
    print("=== Инициализация завершена ===") 