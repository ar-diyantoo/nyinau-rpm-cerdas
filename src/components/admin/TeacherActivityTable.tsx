import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface TeacherStats {
  user_id: string;
  full_name: string;
  email: string;
  total_rpm: number;
  completed_rpm: number;
  draft_rpm: number;
  completion_rate: number;
  last_activity: string | null;
}

interface TeacherActivityTableProps {
  teachers: TeacherStats[];
  loading: boolean;
}

export const TeacherActivityTable = ({ teachers, loading }: TeacherActivityTableProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getActivityBadge = (lastActivity: string | null) => {
    if (!lastActivity) return <Badge variant="outline">Belum ada aktivitas</Badge>;
    
    const daysSince = Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince <= 7) return <Badge className="bg-primary/10 text-primary border-primary/20">Aktif</Badge>;
    if (daysSince <= 30) return <Badge variant="secondary">Cukup Aktif</Badge>;
    return <Badge variant="outline" className="text-muted-foreground">Tidak Aktif</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Belum ada data guru</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guru</TableHead>
            <TableHead className="text-center">Total RPM</TableHead>
            <TableHead className="text-center">Selesai</TableHead>
            <TableHead className="text-center">Draft</TableHead>
            <TableHead>Tingkat Penyelesaian</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aktivitas Terakhir</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.user_id}>
              <TableCell>
                <div>
                  <p className="font-medium">{teacher.full_name}</p>
                  <p className="text-xs text-muted-foreground">{teacher.email}</p>
                </div>
              </TableCell>
              <TableCell className="text-center font-semibold">{teacher.total_rpm}</TableCell>
              <TableCell className="text-center text-primary">{teacher.completed_rpm}</TableCell>
              <TableCell className="text-center text-muted-foreground">{teacher.draft_rpm}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={teacher.completion_rate} className="h-2 w-20" />
                  <span className="text-sm text-muted-foreground">{teacher.completion_rate}%</span>
                </div>
              </TableCell>
              <TableCell>{getActivityBadge(teacher.last_activity)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDate(teacher.last_activity)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
