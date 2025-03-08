"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { userApi, eventApi, bookingApi, notificationApi } from "@/lib/api/api-client"

type ServiceStatusType = "operational" | "degraded" | "outage"

type Service = {
    name: string
    status: ServiceStatusType
    lastUpdated: string
}

export function ServiceStatus() {
    const [services, setServices] = useState<Service[]>([
        { name: "User Service", status: "operational", lastUpdated: "" },
        { name: "Event Service", status: "operational", lastUpdated: "" },
        { name: "Booking Service", status: "operational", lastUpdated: "" },
        { name: "Notification Service", status: "operational", lastUpdated: "" },
    ])

    useEffect(() => {
        const checkServiceStatus = async () => {
            const now = new Date().toISOString()
            const updatedServices = [...services]

            // Check User Service
            try {
                await userApi.get("/")
                updatedServices[0] = { ...updatedServices[0], status: "operational", lastUpdated: now }
            } catch (error) {
                console.error("User service check failed:", error)
                updatedServices[0] = { ...updatedServices[0], status: "outage", lastUpdated: now }
            }

            // Check Event Service
            try {
                await eventApi.get("/events/")
                updatedServices[1] = { ...updatedServices[1], status: "operational", lastUpdated: now }
            } catch (error) {
                console.error("Event service check failed:", error)
                updatedServices[1] = { ...updatedServices[1], status: "outage", lastUpdated: now }
            }

            // Check Booking Service
            try {
                await bookingApi.get("/bookings/")
                updatedServices[2] = { ...updatedServices[2], status: "operational", lastUpdated: now }
            } catch (error) {
                console.error("Booking service check failed:", error)
                updatedServices[2] = { ...updatedServices[2], status: "outage", lastUpdated: now }
            }

            // Check Notification Service
            try {
                await notificationApi.get("/health/")
                updatedServices[3] = { ...updatedServices[3], status: "operational", lastUpdated: now }
            } catch (error) {
                console.error("Notification service check failed:", error)
                updatedServices[3] = { ...updatedServices[3], status: "outage", lastUpdated: now }
            }

            setServices(updatedServices)
        }

        checkServiceStatus()
    }, [services])

    const getStatusIcon = (status: ServiceStatusType) => {
        switch (status) {
            case "operational":
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case "degraded":
                return <AlertCircle className="h-4 w-4 text-yellow-500" />
            case "outage":
                return <XCircle className="h-4 w-4 text-red-500" />
        }
    }

    const getStatusBadge = (status: ServiceStatusType) => {
        switch (status) {
            case "operational":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Operational
                    </Badge>
                )
            case "degraded":
                return (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Degraded
                    </Badge>
                )
            case "outage":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Outage
                    </Badge>
                )
        }
    }

    return (
        <div className="space-y-4">
            {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                        {getStatusIcon(service.status)}
                        <span>{service.name}</span>
                    </div>
                    <div className="flex items-center gap-2">{getStatusBadge(service.status)}</div>
                </div>
            ))}
        </div>
    )
}

