from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
import requests
import pika
import json
import logging
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid
from sqlalchemy.orm import Session
from models import Booking
from database import engine, Base, get_db
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base.metadata.create_all(bind=engine)

# Use environment variables for RabbitMQ, Event Service, User Service, and Notification Service
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
EVENT_SERVICE_URL = os.getenv("EVENT_SERVICE_URL", "http://event-service:8002")
USER_SERVICE_URL = os.getenv("USER_SERVICE_URL", "http://user-service:8001")
NOTIFICATION_SERVICE_URL = os.getenv("NOTIFICATION_SERVICE_URL", "http://notification-service:8004")

RABBITMQ_QUEUE = "booking_notifications"

class BookingCreate(BaseModel):
    user_id: str = Field(..., example="user123")
    event_id: str = Field(..., example="event456")
    tickets: int = Field(..., gt=0, example=2)
    status: Optional[str] = "PENDING"

def process_payment(user_id: str, amount: float) -> bool:
    return True

def publish_notification(booking_id: str, user_email: str, status: str, tickets: int):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=RABBITMQ_QUEUE, durable=True)
        message = json.dumps({
            "recipient": user_email,
            "subject": "Booking Confirmation",
            "message": f"Your booking (ID: {booking_id}) for {tickets} ticket(s) has been {status}."
        })
        channel.basic_publish(exchange="", routing_key=RABBITMQ_QUEUE, body=message)
        connection.close()
        logger.info("✅ Notification published to RabbitMQ")
    except Exception as e:
        logger.error(f"❌ Failed to publish notification: {e}")

@app.post("/bookings/")
async def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    try:
        logger.info("📩 Received Booking Request: %s", booking.model_dump())

        # Check event availability using EVENT_SERVICE_URL
        event_response = requests.get(f"{EVENT_SERVICE_URL}/events/{booking.event_id}/availability")
        if event_response.status_code != 200:
            raise HTTPException(status_code=404, detail="Event not found")

        available_tickets = event_response.json().get("available_tickets", 0)
        if booking.tickets > available_tickets:
            raise HTTPException(status_code=400, detail="Not enough tickets available")

        # Process payment (mock implementation)
        if not process_payment(booking.user_id, booking.tickets * 10):
            raise HTTPException(status_code=400, detail="Payment failed")

        # Update event tickets using EVENT_SERVICE_URL
        update_response = requests.put(
            f"{EVENT_SERVICE_URL}/events/{booking.event_id}/update-tickets?tickets_booked={booking.tickets}"
        )
        if update_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to update event tickets")

        # Fetch user details using USER_SERVICE_URL
        user_response = requests.get(f"{USER_SERVICE_URL}/users/{booking.user_id}")
        if user_response.status_code != 200:
            raise HTTPException(status_code=404, detail="User not found")

        user_email = user_response.json().get("email")
        if not user_email:
            raise HTTPException(status_code=500, detail="User email not found")

        # Create booking in the database
        booking_id = str(uuid.uuid4())[:10]
        db_booking = Booking(
            booking_id=booking_id,
            user_id=booking.user_id,
            event_id=booking.event_id,
            tickets=booking.tickets,
            status="CONFIRMED"
        )
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)

        # Publish notification to RabbitMQ
        publish_notification(booking_id, user_email, "CONFIRMED", booking.tickets)

        return {"message": "✅ Booking confirmed successfully", "booking_id": booking_id}

    except requests.RequestException as req_err:
        logger.error(f"❌ External API error: {req_err}")
        raise HTTPException(status_code=502, detail="Error communicating with external service")

    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

@app.get("/bookings/")
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(Booking).all()
    return bookings