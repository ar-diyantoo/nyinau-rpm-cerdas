import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowLeft, 
  Search, 
  Calculator, 
  Leaf, 
  BookOpen, 
  Zap, 
  Languages, 
  Activity, 
  Microscope, 
  TrendingUp, 
  Palette, 
  Code, 
  FileSpreadsheet,
  LayoutGrid,
  FlaskConical,
  Users,
  Briefcase,
  Copy,
  Eye,
  Sparkles
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { rpmTemplates, templateCategories, jenjangFilters, RPMTemplate } from '@/data/rpmTemplates';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator,
  Leaf,
  BookOpen,
  Zap,
  Languages,
  Activity,
  Microscope,
  TrendingUp,
  Palette,
  Code,
  FileSpreadsheet,
  LayoutGrid,
  FlaskConical,
  Users,
  Briefcase,
};

const Templates = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJenjang, setSelectedJenjang] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<RPMTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Filter templates based on search, jenjang, and category
  const filteredTemplates = rpmTemplates.filter((template) => {
    const matchesSearch = 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJenjang = selectedJenjang === 'all' || template.jenjang === selectedJenjang;
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesJenjang && matchesCategory;
  });

  const handleUseTemplate = async (template: RPMTemplate) => {
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    try {
      setIsCreating(true);

      // Create new lesson plan from template
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert({
          user_id: user.id,
          title: `${template.formData.subject} - ${template.formData.topic}`,
          satuan_pendidikan: '',
          is_draft: true,
          jenjang: template.formData.jenjang || 'SD',
          fase: template.formData.fase || '',
          semester: template.formData.semester || 'Ganjil',
          subject: template.formData.subject || '',
          topic: template.formData.topic || '',
          duration_jp: template.formData.duration_jp || 2,
          student_readiness: template.formData.student_readiness || '',
          student_social_emotional_context: '',
          profil_pelajar_pancasila: template.formData.profil_pelajar_pancasila || [],
          materi_characteristics: template.formData.materi_characteristics || '',
          capaian_pembelajaran: template.formData.capaian_pembelajaran || '',
          learning_objectives: template.formData.learning_objectives || '',
          learning_approach: template.formData.learning_approach || [],
          cross_disciplinary_integration: template.formData.cross_disciplinary_integration || '',
          learning_framework: template.formData.learning_framework || {},
          mindfulness_level: template.formData.mindfulness_level || 3,
          meaningfulness_level: template.formData.meaningfulness_level || 3,
          joyfulness_level: template.formData.joyfulness_level || 3,
          learning_principles_description: template.formData.learning_principles_description || '',
          special_considerations: template.formData.special_considerations || '',
          teacher_expectations: template.formData.teacher_expectations || '',
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Template berhasil digunakan! Silakan lengkapi data.');
      navigate(`/dashboard/edit/${data.id}`);
    } catch (error: any) {
      console.error('Error creating from template:', error);
      toast.error('Gagal menggunakan template');
    } finally {
      setIsCreating(false);
      setPreviewTemplate(null);
    }
  };

  const getJenjangColor = (jenjang: string) => {
    switch (jenjang) {
      case 'SD': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'SMP': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'SMA': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'SMK': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const TemplateIcon = ({ iconName }: { iconName: string }) => {
    const IconComponent = iconMap[iconName] || BookOpen;
    return <IconComponent className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center gap-4 px-4">
          <Button asChild variant="ghost" size="icon">
            <Link to="/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Template RPM</h1>
            <p className="text-sm text-muted-foreground">Pilih template untuk memulai dengan cepat</p>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari template berdasarkan nama, mata pelajaran, atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Jenjang Filter */}
          <div className="flex flex-wrap gap-2">
            {jenjangFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={selectedJenjang === filter.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedJenjang(filter.id)}
              >
                {filter.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6">
            {templateCategories.map((category) => {
              const CategoryIcon = iconMap[category.icon] || LayoutGrid;
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <CategoryIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-0">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Tidak ada template ditemukan</h3>
                <p className="text-muted-foreground">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <TemplateIcon iconName={template.icon} />
                        </div>
                        <Badge className={getJenjangColor(template.jenjang)}>
                          {template.jenjang}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary" className="font-normal">
                            {template.subject}
                          </Badge>
                          <span>•</span>
                          <span>{template.formData.duration_jp} JP</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Lihat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {previewTemplate && (
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <TemplateIcon iconName={previewTemplate.icon} />
                </div>
              )}
              <div>
                <DialogTitle>{previewTemplate?.name}</DialogTitle>
                <DialogDescription>{previewTemplate?.description}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            {previewTemplate && (
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Jenjang</p>
                    <Badge className={getJenjangColor(previewTemplate.jenjang)}>
                      {previewTemplate.jenjang}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Fase</p>
                    <p className="text-sm">{previewTemplate.formData.fase}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Mata Pelajaran</p>
                    <p className="text-sm">{previewTemplate.formData.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Alokasi Waktu</p>
                    <p className="text-sm">{previewTemplate.formData.duration_jp} JP</p>
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Topik Pembelajaran</p>
                  <p className="text-sm">{previewTemplate.formData.topic}</p>
                </div>

                {/* Capaian Pembelajaran */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Capaian Pembelajaran</p>
                  <p className="text-sm">{previewTemplate.formData.capaian_pembelajaran}</p>
                </div>

                {/* Learning Objectives */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tujuan Pembelajaran</p>
                  <p className="text-sm whitespace-pre-line">{previewTemplate.formData.learning_objectives}</p>
                </div>

                {/* P5 */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Profil Pelajar Pancasila</p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.formData.profil_pelajar_pancasila?.map((p5) => (
                      <Badge key={p5} variant="outline">{p5}</Badge>
                    ))}
                  </div>
                </div>

                {/* Learning Approach */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Pendekatan Pembelajaran</p>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.formData.learning_approach?.map((approach) => (
                      <Badge key={approach} variant="secondary">{approach}</Badge>
                    ))}
                  </div>
                </div>

                {/* Learning Framework */}
                {previewTemplate.formData.learning_framework && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Kerangka Pembelajaran</p>
                    <div className="space-y-2 text-sm">
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="font-medium">Pedagogis</p>
                        <p className="text-muted-foreground">{previewTemplate.formData.learning_framework.pedagogis}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="font-medium">Kemitraan</p>
                        <p className="text-muted-foreground">{previewTemplate.formData.learning_framework.kemitraan}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="font-medium">Lingkungan</p>
                        <p className="text-muted-foreground">{previewTemplate.formData.learning_framework.lingkungan}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted">
                        <p className="font-medium">Digital</p>
                        <p className="text-muted-foreground">{previewTemplate.formData.learning_framework.digital}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Vibe Meter */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Vibe Meter</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-lg bg-primary/10">
                      <p className="text-2xl font-bold text-primary">{previewTemplate.formData.mindfulness_level}/5</p>
                      <p className="text-xs text-muted-foreground">Mindfulness</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-secondary">
                      <p className="text-2xl font-bold text-secondary-foreground">{previewTemplate.formData.meaningfulness_level}/5</p>
                      <p className="text-xs text-muted-foreground">Meaningfulness</p>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-accent">
                      <p className="text-2xl font-bold text-accent-foreground">{previewTemplate.formData.joyfulness_level}/5</p>
                      <p className="text-xs text-muted-foreground">Joyfulness</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
              Tutup
            </Button>
            <Button 
              onClick={() => previewTemplate && handleUseTemplate(previewTemplate)}
              disabled={isCreating}
            >
              {isCreating ? (
                <>Membuat...</>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Gunakan Template
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
