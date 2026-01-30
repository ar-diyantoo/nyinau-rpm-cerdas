import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Search, 
  FileText, 
  Users, 
  Eye, 
  Flag,
  CheckCircle,
  XCircle,
  BarChart3
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LessonPlanData {
  id: string;
  title: string;
  subject: string;
  jenjang: string;
  fase: string;
  topic: string;
  user_id: string;
  created_at: string;
  is_draft: boolean;
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
}

const Moderator = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, hasRole, loading: roleLoading } = useAdmin();
  const navigate = useNavigate();
  
  const [lessonPlans, setLessonPlans] = useState<LessonPlanData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenjang, setFilterJenjang] = useState('all');
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlanData | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const isModerator = hasRole('moderator') || isAdmin;

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!roleLoading && user && !isModerator) {
      toast.error('Akses ditolak: Anda bukan moderator');
      navigate('/dashboard');
    }
  }, [isModerator, roleLoading, user, navigate]);

  useEffect(() => {
    if (isModerator) {
      loadData();
    }
  }, [isModerator]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      // Load all lesson plans (moderators can view all)
      const { data: plansData, error: plansError } = await supabase
        .from('lesson_plans')
        .select('id, title, subject, jenjang, fase, topic, user_id, created_at, is_draft')
        .order('created_at', { ascending: false })
        .limit(100);

      if (plansError) throw plansError;
      setLessonPlans(plansData || []);

      // Load users for reference
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, full_name');

      if (usersError) throw usersError;
      setUsers(usersData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Gagal memuat data');
    } finally {
      setLoadingData(false);
    }
  };

  const getUserName = (userId: string) => {
    const userData = users.find(u => u.id === userId);
    return userData?.full_name || userData?.email || 'Unknown';
  };

  const handleViewPlan = (plan: LessonPlanData) => {
    setSelectedPlan(plan);
    setViewDialogOpen(true);
  };

  const handleFlagPlan = async (_planId: string) => {
    // Placeholder for flagging functionality
    toast.info('Fitur flagging akan segera tersedia');
  };

  const filteredPlans = lessonPlans.filter((plan) => {
    const matchesSearch = 
      plan.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.topic?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJenjang = filterJenjang === 'all' || plan.jenjang === filterJenjang;
    return matchesSearch && matchesJenjang;
  });

  const stats = {
    totalPlans: lessonPlans.length,
    drafts: lessonPlans.filter(p => p.is_draft).length,
    published: lessonPlans.filter(p => !p.is_draft).length,
    uniqueUsers: new Set(lessonPlans.map(p => p.user_id)).size,
  };

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!isModerator) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary/20">
              <ShieldCheck className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Panel Moderator</h1>
              <p className="text-muted-foreground text-sm">Kelola dan moderasi konten RPM</p>
            </div>
          </div>
          {isAdmin && (
            <Badge variant="destructive" className="ml-auto">
              Admin Access
            </Badge>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.totalPlans}</p>
                  <p className="text-sm text-muted-foreground">Total RPM</p>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.published}</p>
                  <p className="text-sm text-muted-foreground">Published</p>
                </div>
                <CheckCircle className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.drafts}</p>
                  <p className="text-sm text-muted-foreground">Draft</p>
                </div>
                <XCircle className="w-8 h-8 text-muted-foreground opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
                  <p className="text-sm text-muted-foreground">Kontributor</p>
                </div>
                <Users className="w-8 h-8 text-secondary-foreground opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daftar RPM
            </CardTitle>
            <CardDescription>Semua RPM yang dibuat oleh pengguna</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari judul, mata pelajaran, atau topik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterJenjang} onValueChange={setFilterJenjang}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Jenjang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenjang</SelectItem>
                  <SelectItem value="SD">SD</SelectItem>
                  <SelectItem value="SMP">SMP</SelectItem>
                  <SelectItem value="SMA">SMA</SelectItem>
                  <SelectItem value="SMK">SMK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loadingData ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Tidak ada RPM ditemukan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Mata Pelajaran</TableHead>
                      <TableHead>Jenjang</TableHead>
                      <TableHead>Pembuat</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {plan.title}
                        </TableCell>
                        <TableCell>{plan.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{plan.jenjang}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {getUserName(plan.user_id)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={plan.is_draft ? 'secondary' : 'default'}>
                            {plan.is_draft ? 'Draft' : 'Published'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(plan.created_at).toLocaleDateString('id-ID')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewPlan(plan)}
                              title="Lihat Detail"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleFlagPlan(plan.id)}
                              title="Flag untuk Review"
                            >
                              <Flag className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPlan?.title}</DialogTitle>
            <DialogDescription>
              Detail RPM untuk moderasi
            </DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Mata Pelajaran</p>
                  <p className="font-medium">{selectedPlan.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Jenjang / Fase</p>
                  <p className="font-medium">{selectedPlan.jenjang} - {selectedPlan.fase}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Topik</p>
                  <p className="font-medium">{selectedPlan.topic}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pembuat</p>
                  <p className="font-medium">{getUserName(selectedPlan.user_id)}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Tutup
                </Button>
                <Button onClick={() => navigate(`/dashboard/edit/${selectedPlan.id}`)}>
                  Lihat Lengkap
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Moderator;
