from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import pika
import json
import threading
import os
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Notification Service is Running!"}

# Use environment variables for MongoDB and RabbitMQ
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")

client = MongoClient(MONGO_URI)
db = client.notification_service
notifications_collection = db.notifications

EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USER = os.getenv("EMAIL_USER", "default_email@gmail.com")
EMAIL_PASS = os.getenv("EMAIL_PASS", "default_password")

QUEUE_NAME = "booking_notifications"

def send_email(recipient: str, subject: str, message: str):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = recipient
        msg['Subject'] = subject
        msg.attach(MIMEText(message, 'plain'))
        
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.sendmail(EMAIL_USER, recipient, msg.as_string())
        server.quit()
        print(f"✅ Email sent to {recipient}")
    except Exception as e:
        print(f"❌ Error sending email: {e}")

def callback(ch, method, properties, body):
    try:
        notification_data = json.loads(body.decode("utf-8"))
        
        recipient = notification_data["recipient"]
        subject = notification_data["subject"]
        message = notification_data["message"]

        notifications_collection.insert_one(notification_data)
        send_email(recipient, subject, message)

        print(f"📩 Notification processed for {recipient}")
    
    except Exception as e:
        print(f"❌ Error processing message: {e}")

def start_rabbitmq_consumer():
    while True:
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
            channel = connection.channel()
            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            
            channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback, auto_ack=True)
            
            print("🐇 RabbitMQ Consumer Started. Listening for messages...")
            channel.start_consuming()
        
        except Exception as e:
            print(f"❌ RabbitMQ Connection Error: {e}")
            print("🔄 Retrying in 5 seconds...")
            time.sleep(5)

threading.Thread(target=start_rabbitmq_consumer, daemon=True).start()

@app.get("/notifications/")
def get_notifications():
    notifications = list(notifications_collection.find({}, {"_id": 0}))
    return {"notifications": notifications}

@app.post("/send-notification/")
def send_notification(notification: dict):
    try:
        recipient = notification.get("recipient")
        subject = notification.get("subject")
        message = notification.get("message")
        
        if not recipient or not subject or not message:
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        send_email(recipient, subject, message)
        notifications_collection.insert_one(notification)
        
        return {"status": "Notification sent successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))