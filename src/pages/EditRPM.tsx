import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Fungsi membersihkan markdown & simbol Gemini/OpenAI/capain AI
function cleanAIGeneratedText(text: string) {
  // hilangkan *, -, markdown bold/italic, list, dsb
  return text
    .replace(/^(\*|-|\d+\.)\s+/gm, "")    // hilangkan list bullets
    .replace(/\*\*(.*?)\*\*/g, "$1")      // **bold** markdown
    .replace(/\*(.*?)\*/g, "$1")          // *italic* markdown
    .replace(/_(.*?)_/g, "$1")            // _italic_ markdown
    .replace(/`(.*?)`/g, "$1")            // `inline code`
    .replace(/\n{2,}/g, "\n\n")           // normalisasi newline
    .trim();
}

const EditRPM = () => {
  const { id } = useParams<{ id: string }>();
  const [rpm, setRpm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [learningObjectives, setLearningObjectives] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    const fetchRpm = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("lesson_plans")
        .select("*")
        .eq("id", id)
        .single();
      if (error) {
        toast.error("Gagal memuat RPM");
        navigate("/dashboard");
        return;
      }
      setRpm(data);
      setTitle(data.title ?? "");
      setLearningObjectives(cleanAIGeneratedText(data.learning_objectives ?? ""));
      setLoading(false);
    };
    fetchRpm();
  }, [id, navigate]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("lesson_plans")
      .update({
        title: title,
        learning_objectives: cleanAIGeneratedText(learningObjectives),
      })
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast.error("Gagal menyimpan perubahan");
    } else {
      toast.success("RPM berhasil disimpan!");
      navigate("/dashboard");
    }
  };

  // Handler AI Generate
  const handleGenerateAI = async () => {
    // Contoh hasil AI dummy (ganti dg API call ke Gemini/Perplexity utk deploy)
    let aiResult =
      `* Memahami konsep *keanekaragaman hayati*, _keragaman budaya_, dan **kearifan lokal**.\n- Sejarah keluarga dan masyarakat.- Upaya pelestarian keanekaragaman.`;
    setLearningObjectives(cleanAIGeneratedText(aiResult)); // bersihkan & isi ke editor
  };

  if (loading) return <div className="p-8 text-center">Memuat data RPM...</div>;
  if (!rpm) return null;

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit RPM</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Judul RPM</label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Learning Objectives</label>
              <Textarea
                value={learningObjectives}
                onChange={e => setLearningObjectives(e.target.value)}
                rows={6}
                placeholder="Masukkan capaian pembelajaran, hasil generate AI otomatis dibersihkan..."
                required
              />
              <Button
                type="button"
                className="mt-2"
                variant="outline"
                onClick={handleGenerateAI}
              >
                Generate Otomatis (Contoh)
              </Button>
            </div>
            <Button type="submit" className="w-full" loading={saving}>
              Simpan Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditRPM;
