import mysql.connector
import logging
import sys
from dotenv import load_dotenv
import os

# Загрузка переменных окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('db_check.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

def check_database():
    config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'user': os.getenv('DB_USER', 'root'),
        'password': os.getenv('DB_PASSWORD', ''),
        'database': os.getenv('DB_NAME', 'trading_system')
    }
    
    try:
        # Подключение к MySQL
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        
        # Проверка существования базы данных
        cursor.execute("SHOW DATABASES")
        databases = [db[0] for db in cursor.fetchall()]
        if config['database'] not in databases:
            print(f"✗ База данных {config['database']} не существует")
            return False
            
        # Проверка таблицы api_keys
        cursor.execute(f"USE {config['database']}")
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        if 'api_keys' not in tables:
            print("✗ Таблица api_keys не существует")
            return False
            
        # Проверка структуры таблицы
        cursor.execute("DESCRIBE api_keys")
        columns = [col[0] for col in cursor.fetchall()]
        required_columns = ['id', 'exchange', 'api_key', 'api_secret', 'created_at', 'updated_at']
        missing_columns = [col for col in required_columns if col not in columns]
        if missing_columns:
            print(f"✗ Отсутствуют колонки: {', '.join(missing_columns)}")
            return False
            
        # Проверка индексов
        cursor.execute("SHOW INDEX FROM api_keys")
        indexes = [idx[2] for idx in cursor.fetchall()]
        if 'unique_exchange' not in indexes:
            print("✗ Отсутствует уникальный индекс для exchange")
            return False
            
        # Проверка данных
        cursor.execute("SELECT COUNT(*) FROM api_keys")
        count = cursor.fetchone()[0]
        print(f"✓ В таблице {count} записей")
        
        print("✓ База данных в порядке")
        return True
        
    except mysql.connector.Error as e:
        print(f"✗ Ошибка базы данных: {str(e)}")
        return False
    except Exception as e:
        print(f"✗ Неожиданная ошибка: {str(e)}")
        return False
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    print("=== Проверка базы данных ===")
    check_database()
    print("=== Проверка завершена ===") 