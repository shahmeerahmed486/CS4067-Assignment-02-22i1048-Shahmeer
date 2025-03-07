import { NotificationList } from './notification-list'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Notifications</h1>
                <Button asChild>
                    <Link href="/notifications/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Notification
                    </Link>
                </Button>
            </div>
            <NotificationList />
        </div>
    )
}