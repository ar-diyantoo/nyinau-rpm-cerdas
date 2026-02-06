import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, Edit, PlusCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  user_name: string;
  user_email: string;
  action: 'created' | 'updated';
  timestamp: string;
  is_draft: boolean;
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
  loading: boolean;
}

export const RecentActivityFeed = ({ activities, loading }: RecentActivityFeedProps) => {
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Aktivitas Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Aktivitas Terbaru
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada aktivitas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-full ${activity.action === 'created' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                  {activity.action === 'created' ? (
                    <PlusCircle className="h-4 w-4" />
                  ) : (
                    <Edit className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{activity.user_name}</span>
                    <span className="text-muted-foreground text-sm">
                      {activity.action === 'created' ? 'membuat' : 'mengedit'}
                    </span>
                    <Badge variant={activity.is_draft ? 'outline' : 'secondary'} className="text-xs">
                      {activity.is_draft ? 'Draft' : 'Selesai'}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground truncate mt-0.5">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
