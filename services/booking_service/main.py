from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import pika
import json
import logging
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# PostgreSQL Connection (Mocked for now)
BOOKING_DB = []

# RabbitMQ Connection
RABBITMQ_HOST = "localhost"
RABBITMQ_QUEUE = "booking_notifications"

# Pydantic Model for Booking
class Booking(BaseModel):
    booking_id: str
    user_id: str
    event_id: str
    tickets: int
    status: str = "PENDING"

# Mock Payment Gateway
def process_payment(user_id: str, amount: float) -> bool:
    # Simulate payment processing
    return True

# Function to Publish Notification to RabbitMQ
def publish_notification(booking_id: str, user_email: str, status: str):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=RABBITMQ_QUEUE)
        message = json.dumps({"booking_id": booking_id, "user_email": user_email, "status": status})
        channel.basic_publish(exchange="", routing_key=RABBITMQ_QUEUE, body=message)
        connection.close()
        logger.info("Notification published to RabbitMQ")
    except Exception as e:
        logger.error(f"Failed to publish notification: {e}")

# API to Create a Booking
@app.post("/bookings/")
def create_booking(booking: Booking):
    try:
        # Check Event Availability
        event_response = requests.get(f"http://localhost:8001/events/{booking.event_id}/availability")
        if event_response.status_code != 200:
            raise HTTPException(status_code=404, detail="Event not found")
        available_tickets = event_response.json()["available_tickets"]
        if booking.tickets > available_tickets:
            raise HTTPException(status_code=400, detail="Not enough tickets available")

        # Process Payment
        if not process_payment(booking.user_id, booking.tickets * 10):  # Mock price: $10 per ticket
            raise HTTPException(status_code=400, detail="Payment failed")

        # Update Event Tickets
        update_response = requests.put(
            f"http://localhost:8001/events/{booking.event_id}/update-tickets/?tickets_booked={booking.tickets}"
        )
        if update_response.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to update event tickets")

        # Save Booking
        booking.status = "CONFIRMED"
        BOOKING_DB.append(booking.dict())

        # Publish Notification
        publish_notification(booking.booking_id, "user@example.com", booking.status)  # Replace with actual user email

        return {"message": "Booking confirmed successfully"}
    except Exception as e:
        logger.error(f"Error creating booking: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# API to Get All Bookings
@app.get("/bookings/")
def get_bookings():
    return BOOKING_DB