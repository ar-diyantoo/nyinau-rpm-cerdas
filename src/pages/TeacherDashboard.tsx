import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useTeacherStats } from '@/hooks/useTeacherStats';
import { TeacherStatsCard } from '@/components/admin/TeacherStatsCard';
import { TeacherActivityTable } from '@/components/admin/TeacherActivityTable';
import { RecentActivityFeed } from '@/components/admin/RecentActivityFeed';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Users, 
  FileText, 
  CheckCircle2, 
  FileEdit, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

const TeacherDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, hasRole, loading: adminLoading } = useAdmin();
  const { teacherStats, recentActivities, overallStats, loading: statsLoading } = useTeacherStats();
  const navigate = useNavigate();

  const canAccess = isAdmin || hasRole('moderator');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && user && !canAccess) {
      toast.error('Akses ditolak: Anda tidak memiliki izin');
      navigate('/dashboard');
    }
  }, [canAccess, adminLoading, user, navigate]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard Aktivitas Guru</h1>
              <p className="text-muted-foreground text-sm">Monitoring dan statistik pembuatan RPM</p>
            </div>
          </div>
        </div>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <TeacherStatsCard
            title="Total Guru"
            value={overallStats.totalTeachers}
            icon={Users}
          />
          <TeacherStatsCard
            title="Total RPM"
            value={overallStats.totalRpm}
            icon={FileText}
          />
          <TeacherStatsCard
            title="RPM Selesai"
            value={overallStats.completedRpm}
            icon={CheckCircle2}
          />
          <TeacherStatsCard
            title="RPM Draft"
            value={overallStats.draftRpm}
            icon={FileEdit}
          />
          <TeacherStatsCard
            title="Tingkat Penyelesaian"
            value={`${overallStats.averageCompletion}%`}
            icon={TrendingUp}
          />
          <TeacherStatsCard
            title="Guru Aktif"
            value={overallStats.activeTeachers}
            subtitle="7 hari terakhir"
            icon={Activity}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Teacher Activity Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Statistik Per Guru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TeacherActivityTable teachers={teacherStats} loading={statsLoading} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <div className="lg:col-span-1">
            <RecentActivityFeed activities={recentActivities} loading={statsLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
