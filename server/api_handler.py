from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from datetime import datetime
import logging
import os
from dotenv import load_dotenv
from functools import wraps
import traceback
import sys

# Загрузка переменных окружения
load_dotenv()

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api_keys.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

app = Flask(__name__)
# Настройка CORS только для определенных доменов
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://77.91.123.72"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                logging.warning("Попытка доступа без токена авторизации")
                return jsonify({'error': 'No authorization token provided'}), 401
            
            token = auth_header.split(' ')[1]
            if token != '48de6d2a-0368-4aa9-a02b-36ec5291af58':
                logging.warning(f"Попытка доступа с неверным токеном: {token[:10]}...")
                return jsonify({'error': 'Invalid authorization token'}), 401
                
            return f(*args, **kwargs)
        except Exception as e:
            logging.error(f"Ошибка при проверке авторизации: {str(e)}")
            return jsonify({'error': 'Authorization error'}), 500
    return decorated

class DatabaseManager:
    def __init__(self):
        self.config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'user': os.getenv('DB_USER', 'root'),
            'password': os.getenv('DB_PASSWORD', ''),
            'database': os.getenv('DB_NAME', 'trading_system')
        }

    def connect(self):
        try:
            return mysql.connector.connect(**self.config)
        except mysql.connector.Error as e:
            logging.error(f"Ошибка подключения к БД: {str(e)}")
            raise

    def save_api_keys(self, exchange, api_key, api_secret):
        conn = None
        try:
            conn = self.connect()
            cursor = conn.cursor()
            
            # Проверка существования таблицы
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
            
            query = """
            INSERT INTO api_keys (exchange, api_key, api_secret, created_at)
            VALUES (%s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE 
                api_key = VALUES(api_key),
                api_secret = VALUES(api_secret),
                updated_at = CURRENT_TIMESTAMP
            """
            
            cursor.execute(query, (exchange, api_key, api_secret, datetime.now()))
            conn.commit()
            
            logging.info(f"Успешно сохранены ключи для биржи {exchange}")
            return True
            
        except mysql.connector.Error as e:
            logging.error(f"Ошибка базы данных: {str(e)}")
            if conn:
                conn.rollback()
            return False
        except Exception as e:
            logging.error(f"Неожиданная ошибка: {str(e)}\n{traceback.format_exc()}")
            if conn:
                conn.rollback()
            return False
            
        finally:
            if 'cursor' in locals():
                cursor.close()
            if conn:
                conn.close()

@app.route('/api/test', methods=['GET'])
@require_auth
def test_connection():
    try:
        # Проверка подключения к БД
        db = DatabaseManager()
        conn = db.connect()
        conn.close()
        return jsonify({'status': 'success', 'message': 'API and database are working'})
    except Exception as e:
        logging.error(f"Ошибка при проверке соединения: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/keys', methods=['POST'])
@require_auth
def handle_api_keys():
    try:
        data = request.get_json()
        
        # Проверка данных
        required_fields = ['exchange', 'api_key', 'api_secret']
        if not all(field in data for field in required_fields):
            missing_fields = [f for f in required_fields if f not in data]
            logging.warning(f"Отсутствуют обязательные поля: {missing_fields}")
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400
            
        # Валидация данных
        if not data['exchange'] or not data['api_key'] or not data['api_secret']:
            return jsonify({'error': 'All fields must be non-empty'}), 400
            
        # Сохранение в БД
        db = DatabaseManager()
        success = db.save_api_keys(
            data['exchange'],
            data['api_key'],
            data['api_secret']
        )
        
        if success:
            return jsonify({'status': 'success'}), 200
        else:
            return jsonify({'error': 'Database error'}), 500
            
    except Exception as e:
        logging.error(f"Ошибка при обработке запроса: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    try:
        # Проверка подключения к БД при запуске
        db = DatabaseManager()
        conn = db.connect()
        conn.close()
        logging.info("Сервер успешно запущен")
        app.run(host='0.0.0.0', port=80)
    except Exception as e:
        logging.error(f"Ошибка при запуске сервера: {str(e)}")
        sys.exit(1) 