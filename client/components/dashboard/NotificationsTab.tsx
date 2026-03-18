import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Bell, CheckCircle, ChevronRight } from 'lucide-react';
import { NotificationType } from './types';

interface NotificationsTabProps {
  notifications: NotificationType[];
}

export default function NotificationsTab({ notifications }: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h2>
        <p className="text-gray-600">Company updates and announcements</p>
      </div>

      <div className="space-y-3">
        {notifications.map((notif) => (
          <Card key={notif.id} className="border-0 shadow-sm hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  {notif.type === 'success' && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                  {notif.type === 'warning' && (
                    <AlertCircle className="w-6 h-6 text-amber-500" />
                  )}
                  {notif.type === 'info' && <Bell className="w-6 h-6 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                  <p className="text-gray-400 text-xs mt-2">{notif.timestamp}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
