import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Download, Loader2, Sparkles } from "lucide-react";

const EditRPM: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  // Load existing RPM data
  useEffect(() => {
    if (id && user) {
      loadPlan();
    }
  }, [id, user]);

  const loadPlan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("lesson_plans")
        .select("*")
        .eq("id", id)
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error("RPM tidak ditemukan");
        navigate("/dashboard");
        return;
      }
      setPlan(data);
    } catch (error: any) {
      console.error("Error loading plan:", error);
      toast.error("Gagal memuat RPM");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setPlan((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!plan || !id) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from("lesson_plans")
        .update({
          title: plan.title,
          meaningful_understanding: plan.meaningful_understanding,
          trigger_questions: plan.trigger_questions,
          activities_opening: plan.activities_opening,
          activities_core: plan.activities_core,
          activities_closing: plan.activities_closing,
          assessment_initial: plan.assessment_initial,
          assessment_formative: plan.assessment_formative,
          assessment_summative: plan.assessment_summative,
          resources: plan.resources,
          reflection_teacher: plan.reflection_teacher,
          reflection_students: plan.reflection_students,
          is_draft: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
      toast.success("RPM berhasil disimpan!");
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error("Gagal menyimpan RPM");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateWithAI = async () => {
    if (!plan) return;
    
    try {
      setGenerating(true);
      
      const prompt = `Buatkan konten RPM untuk:
Mata Pelajaran: ${plan.subject}
Topik: ${plan.topic}
Jenjang: ${plan.jenjang}
Fase: ${plan.fase}
Durasi: ${plan.duration_jp} JP
Capaian Pembelajaran: ${plan.capaian_pembelajaran}
Tujuan Pembelajaran: ${plan.learning_objectives}

Berikan dalam format yang bisa langsung digunakan untuk RPM.`;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-chat-rpp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!res.ok) {
        throw new Error("AI generation failed");
      }

      const data = await res.json();
      if (data.result) {
        // Update meaningful_understanding with AI response
        handleFieldChange("meaningful_understanding", data.result);
        toast.success("Konten AI berhasil di-generate!");
      }
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error("Gagal generate dengan AI");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!plan) return;
    
    const content = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>RPM - ${plan.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 900px; margin: auto; line-height: 1.6; }
    h1, h2, h3 { color: #333; }
    .section { margin-bottom: 24px; padding: 16px; background: #f9f9f9; border-radius: 8px; }
    .section-title { font-weight: bold; color: #0077cc; margin-bottom: 8px; font-size: 1.1em; }
  </style>
</head>
<body>
  <h1>Rencana Pembelajaran Mendalam (RPM)</h1>
  
  <div class="section">
    <div class="section-title">Identitas</div>
    <p><strong>Judul:</strong> ${plan.title || '-'}</p>
    <p><strong>Satuan Pendidikan:</strong> ${plan.satuan_pendidikan || '-'}</p>
    <p><strong>Jenjang:</strong> ${plan.jenjang || '-'} | <strong>Fase:</strong> ${plan.fase || '-'}</p>
    <p><strong>Mata Pelajaran:</strong> ${plan.subject || '-'}</p>
    <p><strong>Topik:</strong> ${plan.topic || '-'}</p>
    <p><strong>Durasi:</strong> ${plan.duration_jp || '-'} JP</p>
  </div>

  <div class="section">
    <div class="section-title">Capaian & Tujuan Pembelajaran</div>
    <p>${plan.capaian_pembelajaran || '-'}</p>
    <p>${plan.learning_objectives || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Pemahaman Bermakna</div>
    <p>${plan.meaningful_understanding?.replace(/\n/g, '<br>') || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Pertanyaan Pemantik</div>
    <p>${plan.trigger_questions?.replace(/\n/g, '<br>') || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Kegiatan Pendahuluan</div>
    <p>${plan.activities_opening?.replace(/\n/g, '<br>') || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Kegiatan Inti</div>
    <p>${plan.activities_core?.replace(/\n/g, '<br>') || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Kegiatan Penutup</div>
    <p>${plan.activities_closing?.replace(/\n/g, '<br>') || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Asesmen</div>
    <p><strong>Awal:</strong> ${plan.assessment_initial || '-'}</p>
    <p><strong>Formatif:</strong> ${plan.assessment_formative || '-'}</p>
    <p><strong>Sumatif:</strong> ${plan.assessment_summative || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Sumber Belajar</div>
    <p>${plan.resources?.replace(/\n/g, '<br>') || '-'}</p>
  </div>

  <div class="section">
    <div class="section-title">Refleksi</div>
    <p><strong>Guru:</strong> ${plan.reflection_teacher || '-'}</p>
    <p><strong>Siswa:</strong> ${plan.reflection_students || '-'}</p>
  </div>
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

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4 text-center">
        <p className="text-muted-foreground">RPM tidak ditemukan</p>
        <Button asChild className="mt-4">
          <Link to="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit RPM</h1>
            <p className="text-sm text-muted-foreground">{plan.subject} - {plan.topic}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Simpan
          </Button>
        </div>
      </div>

      {/* Identity Card (Read-only) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">📌 Identitas Pembelajaran</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4 text-sm">
          <div><strong>Satuan Pendidikan:</strong> {plan.satuan_pendidikan}</div>
          <div><strong>Jenjang/Fase:</strong> {plan.jenjang} / {plan.fase}</div>
          <div><strong>Semester:</strong> {plan.semester}</div>
          <div><strong>Durasi:</strong> {plan.duration_jp} JP</div>
          <div className="md:col-span-2"><strong>Capaian Pembelajaran:</strong> {plan.capaian_pembelajaran}</div>
          <div className="md:col-span-2"><strong>Tujuan Pembelajaran:</strong> {plan.learning_objectives}</div>
        </CardContent>
      </Card>

      {/* Editable Sections */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">💡 Pemahaman Bermakna</CardTitle>
            <Button variant="outline" size="sm" onClick={handleRegenerateWithAI} disabled={generating}>
              {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Generate AI
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea
              value={plan.meaningful_understanding || ""}
              onChange={(e) => handleFieldChange("meaningful_understanding", e.target.value)}
              rows={4}
              placeholder="Pemahaman bermakna yang akan dicapai siswa..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">❓ Pertanyaan Pemantik</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={plan.trigger_questions || ""}
              onChange={(e) => handleFieldChange("trigger_questions", e.target.value)}
              rows={3}
              placeholder="Pertanyaan untuk memantik rasa ingin tahu siswa..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📚 Kegiatan Pembelajaran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Kegiatan Pendahuluan</Label>
              <Textarea
                value={plan.activities_opening || ""}
                onChange={(e) => handleFieldChange("activities_opening", e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Kegiatan Inti</Label>
              <Textarea
                value={plan.activities_core || ""}
                onChange={(e) => handleFieldChange("activities_core", e.target.value)}
                rows={5}
              />
            </div>
            <div>
              <Label>Kegiatan Penutup</Label>
              <Textarea
                value={plan.activities_closing || ""}
                onChange={(e) => handleFieldChange("activities_closing", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📊 Asesmen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Asesmen Awal (Diagnostik)</Label>
              <Textarea
                value={plan.assessment_initial || ""}
                onChange={(e) => handleFieldChange("assessment_initial", e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label>Asesmen Formatif</Label>
              <Textarea
                value={plan.assessment_formative || ""}
                onChange={(e) => handleFieldChange("assessment_formative", e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label>Asesmen Sumatif</Label>
              <Textarea
                value={plan.assessment_summative || ""}
                onChange={(e) => handleFieldChange("assessment_summative", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📖 Sumber Belajar</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={plan.resources || ""}
              onChange={(e) => handleFieldChange("resources", e.target.value)}
              rows={3}
              placeholder="Buku, media, dan sumber belajar lainnya..."
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🔄 Refleksi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Refleksi Guru</Label>
              <Textarea
                value={plan.reflection_teacher || ""}
                onChange={(e) => handleFieldChange("reflection_teacher", e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <Label>Refleksi Siswa</Label>
              <Textarea
                value={plan.reflection_students || ""}
                onChange={(e) => handleFieldChange("reflection_students", e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="flex justify-end gap-3 mt-8 pb-8">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" /> Download HTML
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
};

export default EditRPM;
