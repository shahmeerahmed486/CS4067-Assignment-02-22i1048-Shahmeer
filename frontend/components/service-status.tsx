"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

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
        { name: "MongoDB", status: "operational", lastUpdated: "" },
        { name: "PostgreSQL", status: "operational", lastUpdated: "" },
        { name: "RabbitMQ", status: "operational", lastUpdated: "" },
    ])

    useEffect(() => {
        // Simulate fetching service status
        const fetchServiceStatus = async () => {
            try {
                // In a real app, this would be an API call
                // const status = await fetch('/api/system/status').then(res => res.json())

                // Simulated data
                const now = new Date().toISOString()
                setServices([
                    { name: "User Service", status: "operational", lastUpdated: now },
                    { name: "Event Service", status: "operational", lastUpdated: now },
                    { name: "Booking Service", status: "degraded", lastUpdated: now },
                    { name: "Notification Service", status: "operational", lastUpdated: now },
                    { name: "MongoDB", status: "operational", lastUpdated: now },
                    { name: "PostgreSQL", status: "operational", lastUpdated: now },
                    { name: "RabbitMQ", status: "outage", lastUpdated: now },
                ])
            } catch (error) {
                console.error("Failed to fetch service status:", error)
            }
        }

        fetchServiceStatus()
    }, [])

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

