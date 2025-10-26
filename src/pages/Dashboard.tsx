import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FileText, TrendingUp, Clock, BarChart3, Search, Grid3X3, List, Edit, Trash2, Download } from 'lucide-react';
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
      if (data?.dashboard_view_preference &&
          (data.dashboard_view_preference === 'grid' || data.dashboard_view_preference === 'list')) {
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

  // --- DOWNLOAD RPM ---
  const handleDownloadRPM = (plan: any) => {
    if (!plan || !plan.generated_content) {
      toast.error("RPM belum tersedia atau kosong!");
      return;
    }
    const content = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>RPM - ${plan.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 900px; margin: auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #888; padding: 10px; }
    th { background: #0077cc; color: #fff; }
    h1, h2, h3 { color: #333; }
  </style>
</head>
<body>
${plan.generated_content}
</body>
</html>
`;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RPM-${plan.title || "output"}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File RPM berhasil didownload!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header, Stats, Filters ... (potong untuk ringkas) */}

      <div className="space-y-4">
        {/* Map cards */}
        {filteredPlans.length === 0 ? (
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

                  {/* Vibe Meter dsb bisa di sini */}

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" asChild className="flex-1">
                      <Link to={`/dashboard/edit/${plan.id}`}>
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Link>
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownloadRPM(plan)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(plan.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog confirmation delete ... */}
    </div>
  );
};

export default Dashboard;
