import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  CheckCircle,
  XCircle,
  BarChart3,
  BookOpen,
  Target,
  Lightbulb,
  ClipboardList,
  RefreshCw,
  Download,
  ExternalLink
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

// Partial data for list view
interface LessonPlanListItem {
  id: string;
  title: string;
  subject: string;
  jenjang: string;
  fase: string;
  topic: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
  satuan_pendidikan: string;
  semester: string;
  duration_jp: number;
}

// Full data for detail view
interface LessonPlanDetail extends LessonPlanListItem {
  capaian_pembelajaran: string;
  learning_objectives: string;
  learning_approach: string[];
  profil_pelajar_pancasila: string[];
  student_readiness: string;
  materi_characteristics: string;
  meaningful_understanding: string | null;
  trigger_questions: string | null;
  activities_opening: string | null;
  activities_core: string | null;
  activities_closing: string | null;
  assessment_initial: string | null;
  assessment_formative: string | null;
  assessment_summative: string | null;
  resources: string | null;
  reflection_teacher: string | null;
  reflection_students: string | null;
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
  
  const [lessonPlans, setLessonPlans] = useState<LessonPlanListItem[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenjang, setFilterJenjang] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loadingData, setLoadingData] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlanDetail | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

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
      const { data: plansData, error: plansError } = await supabase
        .from('lesson_plans')
        .select('id, title, subject, jenjang, fase, topic, user_id, created_at, updated_at, is_draft, satuan_pendidikan, semester, duration_jp')
        .order('updated_at', { ascending: false })
        .limit(200);

      if (plansError) throw plansError;
      setLessonPlans(plansData || []);

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

  const loadPlanDetail = async (planId: string) => {
    setLoadingDetail(true);
    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('id', planId)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSelectedPlan(data);
      }
    } catch (err) {
      console.error('Error loading plan detail:', err);
      toast.error('Gagal memuat detail RPM');
    } finally {
      setLoadingDetail(false);
    }
  };

  const getUserName = (userId: string) => {
    const userData = users.find(u => u.id === userId);
    return userData?.full_name || userData?.email || 'Unknown';
  };

  const getUserEmail = (userId: string) => {
    const userData = users.find(u => u.id === userId);
    return userData?.email || '';
  };

  const handleViewPlan = async (plan: LessonPlanListItem) => {
    setDetailSheetOpen(true);
    await loadPlanDetail(plan.id);
  };

  const handleDownloadHTML = () => {
    if (!selectedPlan) return;
    
    const content = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>RPM - ${selectedPlan.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 900px; margin: auto; line-height: 1.6; }
    h1, h2, h3 { color: #333; }
    .section { margin-bottom: 24px; padding: 16px; background: #f9f9f9; border-radius: 8px; }
    .section-title { font-weight: bold; color: #0077cc; margin-bottom: 8px; font-size: 1.1em; }
    .meta { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; }
    .meta-item { background: #eee; padding: 8px 12px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>${selectedPlan.title}</h1>
  <p><strong>Pembuat:</strong> ${getUserName(selectedPlan.user_id)} (${getUserEmail(selectedPlan.user_id)})</p>
  
  <div class="meta">
    <div class="meta-item"><strong>Satuan:</strong> ${selectedPlan.satuan_pendidikan}</div>
    <div class="meta-item"><strong>Jenjang:</strong> ${selectedPlan.jenjang}</div>
    <div class="meta-item"><strong>Fase:</strong> ${selectedPlan.fase}</div>
    <div class="meta-item"><strong>Semester:</strong> ${selectedPlan.semester}</div>
    <div class="meta-item"><strong>Durasi:</strong> ${selectedPlan.duration_jp} JP</div>
  </div>

  <div class="section">
    <div class="section-title">Mata Pelajaran & Topik</div>
    <p><strong>Mata Pelajaran:</strong> ${selectedPlan.subject}</p>
    <p><strong>Topik:</strong> ${selectedPlan.topic}</p>
  </div>

  <div class="section">
    <div class="section-title">Capaian & Tujuan Pembelajaran</div>
    <p><strong>Capaian Pembelajaran:</strong><br>${selectedPlan.capaian_pembelajaran || '-'}</p>
    <p><strong>Tujuan Pembelajaran:</strong><br>${selectedPlan.learning_objectives || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Pemahaman Bermakna</div>
    <p>${selectedPlan.meaningful_understanding || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Pertanyaan Pemantik</div>
    <p>${selectedPlan.trigger_questions?.replace(/\n/g, '<br>') || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Kegiatan Pembelajaran</div>
    <h3>Pendahuluan</h3>
    <p>${selectedPlan.activities_opening?.replace(/\n/g, '<br>') || '-'}</p>
    <h3>Inti</h3>
    <p>${selectedPlan.activities_core?.replace(/\n/g, '<br>') || '-'}</p>
    <h3>Penutup</h3>
    <p>${selectedPlan.activities_closing?.replace(/\n/g, '<br>') || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Asesmen</div>
    <p><strong>Asesmen Awal:</strong><br>${selectedPlan.assessment_initial || '-'}</p>
    <p><strong>Asesmen Formatif:</strong><br>${selectedPlan.assessment_formative || '-'}</p>
    <p><strong>Asesmen Sumatif:</strong><br>${selectedPlan.assessment_summative || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Sumber Belajar</div>
    <p>${selectedPlan.resources?.replace(/\n/g, '<br>') || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Refleksi</div>
    <p><strong>Refleksi Guru:</strong><br>${selectedPlan.reflection_teacher || '-'}</p>
    <p><strong>Refleksi Siswa:</strong><br>${selectedPlan.reflection_students || '-'}</p>
  </div>
</body>
</html>`;

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RPM-${selectedPlan.title}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File berhasil didownload');
  };

  const filteredPlans = lessonPlans.filter((plan) => {
    const matchesSearch = 
      plan.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getUserName(plan.user_id).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJenjang = filterJenjang === 'all' || plan.jenjang === filterJenjang;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'draft' && plan.is_draft) ||
      (filterStatus === 'published' && !plan.is_draft);
    return matchesSearch && matchesJenjang && matchesStatus;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Panel Moderator</h1>
              <p className="text-muted-foreground text-sm">Kelola dan moderasi konten RPM</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {isAdmin && (
              <Badge variant="destructive">Admin Access</Badge>
            )}
            <Button variant="outline" size="sm" onClick={loadData} disabled={loadingData}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loadingData ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
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
                  <p className="text-sm text-muted-foreground">Selesai</p>
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
                  <p className="text-sm text-muted-foreground">Guru Aktif</p>
                </div>
                <Users className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Daftar RPM
            </CardTitle>
            <CardDescription>
              Semua RPM yang dibuat oleh guru • Klik untuk melihat detail lengkap
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari judul, mata pelajaran, topik, atau nama guru..."
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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="published">Selesai</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loadingData ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Tidak ada RPM ditemukan</p>
                <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul</TableHead>
                      <TableHead>Mata Pelajaran</TableHead>
                      <TableHead>Jenjang</TableHead>
                      <TableHead>Guru</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Update Terakhir</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow 
                        key={plan.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewPlan(plan)}
                      >
                        <TableCell className="font-medium max-w-[200px]">
                          <div className="truncate">{plan.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{plan.topic}</div>
                        </TableCell>
                        <TableCell>{plan.subject}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{plan.jenjang} - {plan.fase}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{getUserName(plan.user_id)}</p>
                            <p className="text-xs text-muted-foreground">{getUserEmail(plan.user_id)}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={plan.is_draft ? 'secondary' : 'default'}>
                            {plan.is_draft ? 'Draft' : 'Selesai'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(plan.updated_at || plan.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewPlan(plan);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {filteredPlans.length > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Menampilkan {filteredPlans.length} dari {lessonPlans.length} RPM
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Sheet */}
      <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {selectedPlan?.title || 'Detail RPM'}
            </SheetTitle>
            <SheetDescription>
              {selectedPlan && (
                <span>
                  Oleh {getUserName(selectedPlan.user_id)} • {formatDate(selectedPlan.updated_at || selectedPlan.created_at)}
                </span>
              )}
            </SheetDescription>
          </SheetHeader>

          {loadingDetail ? (
            <div className="space-y-4 mt-6">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : selectedPlan ? (
            <div className="mt-6 space-y-6">
              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleDownloadHTML}>
                  <Download className="h-4 w-4 mr-2" />
                  Download HTML
                </Button>
                <Button size="sm" onClick={() => navigate(`/dashboard/edit/${selectedPlan.id}`)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buka Editor
                </Button>
              </div>

              {/* Status & Meta */}
              <div className="flex flex-wrap gap-2">
                <Badge variant={selectedPlan.is_draft ? 'secondary' : 'default'}>
                  {selectedPlan.is_draft ? 'Draft' : 'Selesai'}
                </Badge>
                <Badge variant="outline">{selectedPlan.jenjang}</Badge>
                <Badge variant="outline">{selectedPlan.fase}</Badge>
                <Badge variant="outline">{selectedPlan.semester}</Badge>
                <Badge variant="outline">{selectedPlan.duration_jp} JP</Badge>
              </div>

              {/* Tabs for Content */}
              <Tabs defaultValue="identity" className="w-full">
                <TabsList className="w-full grid grid-cols-4">
                  <TabsTrigger value="identity">Identitas</TabsTrigger>
                  <TabsTrigger value="design">Desain</TabsTrigger>
                  <TabsTrigger value="activities">Kegiatan</TabsTrigger>
                  <TabsTrigger value="assessment">Asesmen</TabsTrigger>
                </TabsList>

                <TabsContent value="identity" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Satuan Pendidikan</p>
                      <p className="font-medium">{selectedPlan.satuan_pendidikan}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Mata Pelajaran</p>
                      <p className="font-medium">{selectedPlan.subject}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Topik</p>
                      <p className="font-medium">{selectedPlan.topic}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Capaian Pembelajaran</p>
                      <p className="whitespace-pre-wrap">{selectedPlan.capaian_pembelajaran || '-'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Tujuan Pembelajaran</p>
                      <p className="whitespace-pre-wrap">{selectedPlan.learning_objectives || '-'}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        <p className="text-sm text-muted-foreground">Pemahaman Bermakna</p>
                      </div>
                      <p className="whitespace-pre-wrap">{selectedPlan.meaningful_understanding || '-'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <p className="text-sm text-muted-foreground">Pertanyaan Pemantik</p>
                      </div>
                      <p className="whitespace-pre-wrap">{selectedPlan.trigger_questions || '-'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">Profil Pelajar Pancasila</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedPlan.profil_pelajar_pancasila?.map((p, i) => (
                          <Badge key={i} variant="secondary">{p}</Badge>
                        )) || '-'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">Pendekatan Pembelajaran</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedPlan.learning_approach?.map((a, i) => (
                          <Badge key={i} variant="outline">{a}</Badge>
                        )) || '-'}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activities" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium text-primary mb-2">🚀 Pendahuluan</p>
                      <p className="whitespace-pre-wrap text-sm">{selectedPlan.activities_opening || '-'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium text-primary mb-2">📚 Kegiatan Inti</p>
                      <p className="whitespace-pre-wrap text-sm">{selectedPlan.activities_core || '-'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium text-primary mb-2">🎯 Penutup</p>
                      <p className="whitespace-pre-wrap text-sm">{selectedPlan.activities_closing || '-'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm font-medium text-muted-foreground mb-2">📖 Sumber Belajar</p>
                      <p className="whitespace-pre-wrap text-sm">{selectedPlan.resources || '-'}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="assessment" className="space-y-4 mt-4">
                  <div className="grid gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <ClipboardList className="h-4 w-4 text-primary" />
                        <p className="text-sm text-muted-foreground">Asesmen Awal</p>
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{selectedPlan.assessment_initial || '-'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">Asesmen Formatif</p>
                      <p className="whitespace-pre-wrap text-sm">{selectedPlan.assessment_formative || '-'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">Asesmen Sumatif</p>
                      <p className="whitespace-pre-wrap text-sm">{selectedPlan.assessment_summative || '-'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">Refleksi Guru</p>
                      <p className="whitespace-pre-wrap text-sm">{selectedPlan.reflection_teacher || '-'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-2">Refleksi Siswa</p>
                      <p className="whitespace-pre-wrap text-sm">{selectedPlan.reflection_students || '-'}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>Data tidak ditemukan</p>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Moderator;
