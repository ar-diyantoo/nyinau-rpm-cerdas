import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function cleanAIGeneratedText(text: string) {
  return text
    .replace(/^(\*|-|\d+\.)\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\n{2,}/g, "\n\n")
    .trim();
}

const EditRPM = () => {
  const { id } = useParams<{ id: string }>();
  const [rpm, setRpm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Header
  const [schoolName, setSchoolName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [jenjang, setJenjang] = useState("");
  const [faseKelas, setFaseKelas] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("");

  // Section 1: Identifikasi
  const [pesertaDidik, setPesertaDidik] = useState("");
  const [materiPelajaran, setMateriPelajaran] = useState("");
  const [profilLulusan, setProfilLulusan] = useState("");

  // Section 2: Desain Pembelajaran
  const [capaian, setCapaian] = useState("");
  const [lintasDisiplin, setLintasDisiplin] = useState("");
  const [tujuan, setTujuan] = useState("");
  const [topik, setTopik] = useState("");
  const [praktikPedagogis, setPraktikPedagogis] = useState("");
  const [kemitraan, setKemitraan] = useState("");
  const [lingkungan, setLingkungan] = useState("");
  const [pemanfaatanDigital, setPemanfaatanDigital] = useState("");

  // Section 3: Pengalaman Belajar
  const [kegiatanAwal, setKegiatanAwal] = useState("");
  const [kegiatanInti, setKegiatanInti] = useState("");
  const [kegiatanPenutup, setKegiatanPenutup] = useState("");

  // Section 4: Asesmen Pembelajaran
  const [asesmenAwal, setAsesmenAwal] = useState("");
  const [asesmenProses, setAsesmenProses] = useState("");
  const [asesmenAkhir, setAsesmenAkhir] = useState("");

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
      setSchoolName(data.satuan_pendidikan ?? "");
      setTeacherName(data.teacher_name ?? data.full_name ?? "");
      setJenjang(data.jenjang ?? "");
      setFaseKelas(data.fase ?? "");
      setSemester(data.semester ?? "");
      setSubject(data.subject ?? "");
      setTopic(data.topic ?? "");
      setDuration(data.duration_jp ? `${data.duration_jp} JP` : "");
      setPesertaDidik(data.student_readiness ?? "");
      setMateriPelajaran(data.materi_characteristics ?? "");
      setProfilLulusan(Array.isArray(data.profil_pelajar_pancasila) ? data.profil_pelajar_pancasila.join(", ") : data.profil_pelajar_pancasila ?? "");
      setCapaian(cleanAIGeneratedText(data.capaian_pembelajaran ?? ""));
      setLintasDisiplin(data.cross_disciplinary_integration ?? "");
      setTujuan(cleanAIGeneratedText(data.learning_objectives ?? ""));
      setTopik(data.topic ?? "");
      setPraktikPedagogis(data.learning_approach ? data.learning_approach.join(", ") : "");
      setKemitraan(data.kemitraan ?? "");
      setLingkungan(data.lingkungan ?? "");
      setPemanfaatanDigital(data.pemanfaatan_digital ?? "");
      setKegiatanAwal(cleanAIGeneratedText(data.activities_opening ?? ""));
      setKegiatanInti(cleanAIGeneratedText(data.activities_core ?? ""));
      setKegiatanPenutup(cleanAIGeneratedText(data.activities_closing ?? ""));
      setAsesmenAwal(cleanAIGeneratedText(data.assessment_initial ?? ""));
      setAsesmenProses(cleanAIGeneratedText(data.assessment_formative ?? ""));
      setAsesmenAkhir(cleanAIGeneratedText(data.assessment_summative ?? ""));
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
        satuan_pendidikan: schoolName,
        teacher_name: teacherName,
        jenjang,
        fase: faseKelas,
        semester,
        subject,
        topic,
        duration_jp: duration,
        student_readiness: pesertaDidik,
        materi_characteristics: materiPelajaran,
        profil_pelajar_pancasila: profilLulusan.split(",").map(e => e.trim()),
        capaian_pembelajaran: cleanAIGeneratedText(capaian),
        cross_disciplinary_integration: lintasDisiplin,
        learning_objectives: cleanAIGeneratedText(tujuan),
        learning_approach: praktikPedagogis.split(",").map(e => e.trim()),
        kemitraan,
        lingkungan,
        pemanfaatan_digital: pemanfaatanDigital,
        activities_opening: cleanAIGeneratedText(kegiatanAwal),
        activities_core: cleanAIGeneratedText(kegiatanInti),
        activities_closing: cleanAIGeneratedText(kegiatanPenutup),
        assessment_initial: cleanAIGeneratedText(asesmenAwal),
        assessment_formative: cleanAIGeneratedText(asesmenProses),
        assessment_summative: cleanAIGeneratedText(asesmenAkhir),
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

  const handleDownloadHTML = () => {
    const section = document.getElementById("rpm-download-section");
    if (!section) return;
    const blob = new Blob([`
      <html><head><meta charset="UTF-8"></head><body>${section.innerHTML}</body></html>
    `], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `RPP-RPM-${schoolName || "output"}.html`;
    a.click();
  };

  const handleCopyToClipboard = () => {
    const section = document.getElementById("rpm-download-section");
    if (!section) return;
    navigator.clipboard.writeText(section.innerText).then(
      () => toast.success("Teks sudah disalin ke clipboard!"),
      () => toast.error("Gagal menyalin!")
    );
  };

  if (loading) return <div className="p-8 text-center">Memuat data RPM...</div>;
  if (!rpm) return null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      <Card>
        <CardHeader>
          <CardTitle>Edit Rencana Pembelajaran Mendalam</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
          {/* Download & Copy Buttons */}
          <div className="mb-4 flex gap-2 flex-wrap">
            <Button type="button" variant="outline" onClick={handleDownloadHTML}>
              Download HTML
            </Button>
            <Button type="button" variant="outline" onClick={handleCopyToClipboard}>
              Salin ke Clipboard
            </Button>
          </div>
          <div id="rpm-download-section">
            {/* HEADER, IDENTIFIKASI, DESAIN, dll - layout sama seperti skrip sebelumnya */}
          </div>
          <Button type="submit" className="w-full mt-6" loading={saving}>
            Simpan Perubahan
          </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditRPM;
