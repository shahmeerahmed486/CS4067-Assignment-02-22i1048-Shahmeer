from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import pika
import json
import threading

app = FastAPI()

# MongoDB Connection
MONGO_URI = "mongodb://localhost:27018/"
client = MongoClient(MONGO_URI)
db = client.notification_service
notifications_collection = db.notifications

# Email Configuration (Hardcoded for now)
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USER = "devops.shahmeer.danish@gmail.com"
EMAIL_PASS = "lpayxuwterfmqjix"

# RabbitMQ Connection
RABBITMQ_HOST = "localhost"
QUEUE_NAME = "notification_queue"

# Function to send email
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

# RabbitMQ Consumer Function
def callback(ch, method, properties, body):
    try:
        # Decode the message
        notification_data = json.loads(body.decode("utf-8"))

        # Extract email details
        recipient = notification_data["recipient"]
        subject = notification_data["subject"]
        message = notification_data["message"]

        # Store in MongoDB
        notifications_collection.insert_one(notification_data)

        # Send email
        send_email(recipient, subject, message)

        print(f"📩 Notification processed for {recipient}")

    except Exception as e:
        print(f"❌ Error processing message: {e}")

# Function to Start RabbitMQ Consumer in a Background Thread
def start_rabbitmq_consumer():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME, durable=True)
        
        channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback, auto_ack=True)

        print("🐇 RabbitMQ Consumer Started. Listening for messages...")
        channel.start_consuming()
    
    except Exception as e:
        print(f"❌ RabbitMQ Connection Error: {e}")

# Start RabbitMQ Consumer in a Separate Thread
threading.Thread(target=start_rabbitmq_consumer, daemon=True).start()

# API to retrieve stored notifications
@app.get("/notifications/")
def get_notifications():
    notifications = list(notifications_collection.find({}, {"_id": 0}))  # Exclude MongoDB _id field
    return {"notifications": notifications}

# Health Check API
@app.get("/health/")
def health_check():
    return {"status": "Notification Service is running"}
