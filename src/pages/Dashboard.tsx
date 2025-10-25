import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, TrendingUp, Clock, BarChart3, Search, Grid3X3, List, Edit, Copy, Trash2, Download } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [lessonPlans, setLessonPlans] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenjang, setFilterJenjang] = useState('all');
  const [filterFase, setFilterFase] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadLessonPlans();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUserData(data);
      if (data?.dashboard_view_preference && (data.dashboard_view_preference === 'grid' || data.dashboard_view_preference === 'list')) {
        setViewMode(data.dashboard_view_preference as 'grid' | 'list');
      }
    } catch (error: any) {
      console.error('Error loading user data:', error);
    }
  };

  const loadLessonPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLessonPlans(data || []);
    } catch (error: any) {
      console.error('Error loading lesson plans:', error);
      toast.error('Gagal memuat RPM');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from('lesson_plans')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      
      toast.success('RPM berhasil dihapus');
      loadLessonPlans();
    } catch (error: any) {
      toast.error('Gagal menghapus RPM');
    } finally {
      setDeleteId(null);
    }
  };

  const filteredPlans = lessonPlans.filter((plan) => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJenjang = filterJenjang === 'all' || plan.jenjang === filterJenjang;
    const matchesFase = filterFase === 'all' || plan.fase.includes(filterFase);
    return matchesSearch && matchesJenjang && matchesFase;
  });

  const stats = {
    total: lessonPlans.length,
    thisWeek: lessonPlans.filter(p => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(p.created_at) > weekAgo;
    }).length,
    avgTime: '12 menit',
    productivity: '+15%',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-xl font-bold text-primary">
              Nyinauidn
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-primary">
                Dashboard
              </Link>
              <Link to="/dashboard/create" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Buat RPM Baru
              </Link>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userData?.full_name ? getInitials(userData.full_name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{userData?.full_name || user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>Pengaturan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Selamat datang kembali, {userData?.full_name || 'Guru'}! 👋
          </h1>
          <p className="text-muted-foreground">Apa yang ingin Anda buat hari ini?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total RPM</p>
                  <p className="text-xs text-muted-foreground mt-1">Semua waktu</p>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.thisWeek}</p>
                  <p className="text-sm text-muted-foreground">RPM Minggu Ini</p>
                  <p className="text-xs text-muted-foreground mt-1">7 hari terakhir</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.avgTime}</p>
                  <p className="text-sm text-muted-foreground">Rata-rata Waktu</p>
                  <p className="text-xs text-muted-foreground mt-1">Per RPM</p>
                </div>
                <Clock className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold">{stats.productivity}</p>
                  <p className="text-sm text-muted-foreground">Produktivitas</p>
                  <p className="text-xs text-muted-foreground mt-1">Vs bulan lalu</p>
                </div>
                <BarChart3 className="w-8 h-8 text-success opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="flex-1">
            <Link to="/dashboard/create">
              <Plus className="w-5 h-5 mr-2" />
              Buat RPM Baru
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1 sm:flex-none">
            <Link to="#">
              <FileText className="w-5 h-5 mr-2" />
              Lihat Template
            </Link>
          </Button>
        </div>

        {/* RPM List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">RPM Saya</h2>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari RPM..."
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
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="SD">SD</SelectItem>
                <SelectItem value="SMP">SMP</SelectItem>
                <SelectItem value="SMA">SMA</SelectItem>
                <SelectItem value="SMK">SMK</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterFase} onValueChange={setFilterFase}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="A">Fase A</SelectItem>
                <SelectItem value="B">Fase B</SelectItem>
                <SelectItem value="C">Fase C</SelectItem>
                <SelectItem value="D">Fase D</SelectItem>
                <SelectItem value="E">Fase E</SelectItem>
                <SelectItem value="F">Fase F</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* RPM Cards/List */}
          {loading ? (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredPlans.length === 0 ? (
            <Card className="p-12">
              <div className="text-center space-y-4">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">Belum ada RPM tersimpan</h3>
                  <p className="text-muted-foreground mb-4">
                    Mulai buat RPM pertamamu dengan bantuan AI. Proses cepat dan mudah!
                  </p>
                  <Button asChild>
                    <Link to="/dashboard/create">Buat RPM Pertama</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            plan.jenjang === 'SD' ? 'bg-blue-100 text-blue-700' :
                            plan.jenjang === 'SMP' ? 'bg-green-100 text-green-700' :
                            plan.jenjang === 'SMA' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {plan.jenjang}
                          </span>
                          {plan.is_draft && (
                            <span className="text-xs px-2 py-1 rounded bg-warning/10 text-warning">
                              Draft
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg">{plan.title}</CardTitle>
                        <CardDescription>
                          {plan.subject} · {plan.fase} · {plan.duration_jp} JP
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Dibuat {new Date(plan.created_at).toLocaleDateString('id-ID', { 
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    
                    {/* Vibe Meter */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Berkesadaran</span>
                        <span className="text-blue-600">{plan.mindfulness_level || 7}/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full" 
                          style={{ width: `${((plan.mindfulness_level || 7) / 10) * 100}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span>Bermakna</span>
                        <span className="text-green-600">{plan.meaningfulness_level || 8}/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-green-600 h-1.5 rounded-full" 
                          style={{ width: `${((plan.meaningfulness_level || 8) / 10) * 100}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span>Menggembirakan</span>
                        <span className="text-orange-600">{plan.joyfulness_level || 6}/10</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-orange-600 h-1.5 rounded-full" 
                          style={{ width: `${((plan.joyfulness_level || 6) / 10) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" asChild className="flex-1">
                        <Link to={`/dashboard/edit/${plan.id}`}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.info('Fitur segera hadir')}>
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setDeleteId(plan.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.info('Fitur segera hadir')}>
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin hapus RPM ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. RPM akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
