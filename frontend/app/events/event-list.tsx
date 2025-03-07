"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Edit, MoreHorizontal, Trash, Users } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

type Event = {
    id: string
    title: string
    description: string
    date: string
    location: string
    capacity: number
    attendees: number
    status: "upcoming" | "ongoing" | "completed" | "cancelled"
}

export function EventList() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        // Simulate fetching events
        const fetchEvents = async () => {
            try {
                setLoading(true)
                // In a real app, this would be an API call
                // const data = await fetch('/api/events').then(res => res.json())

                // Simulated data
                setTimeout(() => {
                    setEvents([
                        {
                            id: "1",
                            title: "Tech Conference 2023",
                            description: "Annual technology conference",
                            date: "2023-08-15T09:00:00Z",
                            location: "Convention Center, New York",
                            capacity: 500,
                            attendees: 320,
                            status: "upcoming",
                        },
                        {
                            id: "2",
                            title: "Product Launch",
                            description: "Launch of our new product line",
                            date: "2023-07-20T14:00:00Z",
                            location: "Main Office, San Francisco",
                            capacity: 150,
                            attendees: 120,
                            status: "upcoming",
                        },
                        {
                            id: "3",
                            title: "Developer Workshop",
                            description: "Hands-on workshop for developers",
                            date: "2023-06-10T10:00:00Z",
                            location: "Tech Hub, Austin",
                            capacity: 50,
                            attendees: 50,
                            status: "completed",
                        },
                        {
                            id: "4",
                            title: "Annual Meetup",
                            description: "Networking event for professionals",
                            date: "2023-09-05T18:00:00Z",
                            location: "Grand Hotel, Chicago",
                            capacity: 200,
                            attendees: 0,
                            status: "upcoming",
                        },
                        {
                            id: "5",
                            title: "Webinar: Future of AI",
                            description: "Online discussion about AI trends",
                            date: "2023-07-12T15:00:00Z",
                            location: "Virtual",
                            capacity: 1000,
                            attendees: 750,
                            status: "upcoming",
                        },
                    ])
                    setLoading(false)
                }, 1000)
            } catch (error) {
                console.error("Failed to fetch events:", error)
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    const filteredEvents = events.filter(
        (event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusBadge = (status: Event["status"]) => {
        switch (status) {
            case "upcoming":
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Upcoming
                    </Badge>
                )
            case "ongoing":
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Ongoing
                    </Badge>
                )
            case "completed":
                return (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Completed
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Cancelled
                    </Badge>
                )
        }
    }

    const handleDeleteEvent = async (eventId: string) => {
        // In a real app, this would be an API call
        // await fetch(`/api/events/${eventId}`, { method: 'DELETE' })

        // Optimistic update
        setEvents(events.filter((event) => event.id !== eventId))
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center">
                <Input
                    placeholder="Search events..."
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Capacity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Loading events...
                                </TableCell>
                            </TableRow>
                        ) : filteredEvents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    No events found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEvents.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{event.title}</div>
                                            <div className="text-sm text-muted-foreground">{event.description}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span>{formatDate(event.date)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{event.location}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span>
                                                {event.attendees}/{event.capacity}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Actions</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/events/${event.id}`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteEvent(event.id)}>
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

