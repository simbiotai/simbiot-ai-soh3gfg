# Инструкция по установке и настройке сервера

## Требования
- Python 3.8 или выше
- MySQL Server
- pip (менеджер пакетов Python)

## Установка

1. Установите необходимые пакеты Python:
```bash
sudo apt update
sudo apt install python3-pip python3-venv
```

2. Создайте виртуальное окружение и активируйте его:
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Установите зависимости:
```bash
pip install flask flask-cors mysql-connector-python
```

4. Настройте MySQL:
```bash
sudo mysql -u root -p < setup_database.sql
```

5. Создайте файл с переменными окружения:
```bash
echo "DB_USER=trading_app
DB_PASSWORD=your_secure_password
DB_NAME=trading_system" > .env
```

6. Запустите сервер:
```bash
python3 api_handler.py
```

## Настройка автозапуска

1. Создайте systemd сервис:
```bash
sudo nano /etc/systemd/system/trading-api.service
```

2. Добавьте следующее содержимое:
```ini
[Unit]
Description=Trading API Service
After=network.target

[Service]
User=your_username
WorkingDirectory=/path/to/server
Environment="PATH=/path/to/server/venv/bin"
ExecStart=/path/to/server/venv/bin/python api_handler.py
Restart=always

[Install]
WantedBy=multi-user.target
```

3. Активируйте и запустите сервис:
```bash
sudo systemctl enable trading-api
sudo systemctl start trading-api
```

## Безопасность

1. Настройте файрвол:
```bash
sudo ufw allow 80
sudo ufw enable
```

2. Настройте SSL/TLS (рекомендуется):
```bash
sudo apt install certbot
sudo certbot certonly --standalone -d your-domain.com
```

3. Регулярно обновляйте систему:
```bash
sudo apt update && sudo apt upgrade
```

## Мониторинг

1. Проверка статуса сервиса:
```bash
sudo systemctl status trading-api
```

2. Просмотр логов:
```bash
tail -f api_keys.log
```

## Устранение неполадок

1. Проверьте логи:
```bash
tail -f api_keys.log
```

2. Проверьте статус MySQL:
```bash
sudo systemctl status mysql
```

3. Проверьте подключение к базе данных:
```bash
mysql -u trading_app -p
``` 