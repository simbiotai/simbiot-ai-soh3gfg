import requests
import json
import logging
from datetime import datetime
import time
import sys

# Настройка логирования
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('test_server.log'),
        logging.StreamHandler(sys.stdout)
    ]
)

def wait_for_server(base_url, max_attempts=5):
    """Ожидание готовности сервера"""
    for attempt in range(max_attempts):
        try:
            response = requests.get(f"{base_url}/test", timeout=5)
            if response.status_code == 200:
                return True
        except requests.exceptions.RequestException:
            if attempt < max_attempts - 1:
                time.sleep(2)
                continue
    return False

def test_server():
    base_url = "http://77.91.123.72/api"
    headers = {
        'Authorization': 'Bearer 48de6d2a-0368-4aa9-a02b-36ec5291af58',
        'Content-Type': 'application/json'
    }
    
    # Проверка доступности сервера
    print("\n=== Проверка доступности сервера ===")
    if not wait_for_server(base_url):
        print("✗ Сервер недоступен")
        return
    
    # Тест 1: Проверка соединения
    print("\n=== Тест 1: Проверка соединения ===")
    try:
        response = requests.get(f"{base_url}/test", headers=headers, timeout=10)
        print(f"Статус: {response.status_code}")
        print(f"Ответ: {response.json()}")
        if response.status_code == 200:
            print("✓ Соединение успешно")
        else:
            print("✗ Ошибка соединения")
    except requests.exceptions.Timeout:
        print("✗ Таймаут запроса")
    except Exception as e:
        print(f"✗ Ошибка: {str(e)}")
    
    # Тест 2: Отправка тестовых API ключей
    print("\n=== Тест 2: Отправка API ключей ===")
    test_data = {
        "exchange": "binance",
        "apiKey": f"test_api_key_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "apiSecret": f"test_api_secret_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    }
    
    try:
        response = requests.post(
            f"{base_url}/keys",
            json=test_data,
            headers=headers,
            timeout=10
        )
        print(f"Статус: {response.status_code}")
        print(f"Ответ: {response.json()}")
        if response.status_code == 200:
            print("✓ Ключи успешно отправлены")
        else:
            print("✗ Ошибка отправки ключей")
    except requests.exceptions.Timeout:
        print("✗ Таймаут запроса")
    except Exception as e:
        print(f"✗ Ошибка: {str(e)}")
    
    # Тест 3: Проверка валидации данных
    print("\n=== Тест 3: Проверка валидации данных ===")
    invalid_data = {
        "exchange": "binance",
        "apiKey": "test_key"  # Отсутствует apiSecret
    }
    
    try:
        response = requests.post(
            f"{base_url}/keys",
            json=invalid_data,
            headers=headers,
            timeout=10
        )
        print(f"Статус: {response.status_code}")
        print(f"Ответ: {response.json()}")
        if response.status_code == 400:
            print("✓ Валидация работает корректно")
        else:
            print("✗ Ошибка валидации")
    except requests.exceptions.Timeout:
        print("✗ Таймаут запроса")
    except Exception as e:
        print(f"✗ Ошибка: {str(e)}")

if __name__ == "__main__":
    print("=== Начало тестирования ===")
    test_server()
    print("\n=== Тестирование завершено ===") 