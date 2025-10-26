import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Perlu request Lovable agar library ini tersedia atau pakai CDN di index.html Lovable
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import htmlDocx from "html-docx-js/dist/html-docx";

// Fungsi membersihkan output AI
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

  // === DOWNLOAD HANDLER ===
  const handleDownloadPDF = async () => {
    const element = document.getElementById("rpm-download-section");
    if (!element) return;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const ratio = pageWidth / canvas.width;
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`RPP-RPM-${schoolName || "output"}.pdf`);
  };

  const handleDownloadWord = () => {
    const section = document.getElementById("rpm-download-section");
    if (!section) return;
    const html = section.innerHTML;
    const converted = htmlDocx.asBlob(html);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(converted);
    a.download = `RPP-RPM-${schoolName || "output"}.docx`;
    a.click();
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
          {/* Download Buttons */}
          <div className="mb-4 flex gap-2 flex-wrap">
            <Button type="button" variant="outline" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
            <Button type="button" variant="outline" onClick={handleDownloadWord}>
              Download Word (.docx)
            </Button>
          </div>
          {/* Bagian untuk didownload */}
          <div id="rpm-download-section">
            {/* HEADER */}
            <section className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="font-medium">Satuan Pendidikan</label>
                <Input value={schoolName} onChange={e => setSchoolName(e.target.value)} />
              </div>
              <div>
                <label className="font-medium">Nama Guru</label>
                <Input value={teacherName} onChange={e => setTeacherName(e.target.value)} />
              </div>
              <div>
                <label className="font-medium">Jenjang</label>
                <Input value={jenjang} onChange={e => setJenjang(e.target.value)} />
              </div>
              <div>
                <label className="font-medium">Fase/Kelas</label>
                <Input value={faseKelas} onChange={e => setFaseKelas(e.target.value)} />
              </div>
              <div>
                <label className="font-medium">Semester</label>
                <Input value={semester} onChange={e => setSemester(e.target.value)} />
              </div>
              <div>
                <label className="font-medium">Mata Pelajaran</label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
              <div>
                <label className="font-medium">Topik Pembelajaran</label>
                <Input value={topic} onChange={e => setTopic(e.target.value)} />
              </div>
              <div>
                <label className="font-medium">Alokasi Waktu</label>
                <Input value={duration} onChange={e => setDuration(e.target.value)} />
              </div>
            </section>
            {/* 1. Identifikasi */}
            <section>
              <h3 className="font-bold text-lg mb-2">1. Identifikasi</h3>
              <label>Peserta Didik</label>
              <Textarea value={pesertaDidik} onChange={e => setPesertaDidik(e.target.value)} rows={2} />
              <label>Materi Pelajaran</label>
              <Textarea value={materiPelajaran} onChange={e => setMateriPelajaran(e.target.value)} rows={2} />
              <label>Profil Lulusan</label>
              <Textarea value={profilLulusan} onChange={e => setProfilLulusan(e.target.value)} rows={2} />
            </section>
            {/* 2. Desain Pembelajaran */}
            <section>
              <h3 className="font-bold text-lg mb-2">2. Desain Pembelajaran</h3>
              <label>Capaian Pembelajaran</label>
              <Textarea value={capaian} onChange={e => setCapaian(e.target.value)} rows={2} />
              <label>Lintas Disiplin Ilmu</label>
              <Textarea value={lintasDisiplin} onChange={e => setLintasDisiplin(e.target.value)} rows={2} />
              <label>Tujuan Pembelajaran</label>
              <Textarea value={tujuan} onChange={e => setTujuan(e.target.value)} rows={2} />
              <label>Topik Pembelajaran</label>
              <Textarea value={topik} onChange={e => setTopik(e.target.value)} rows={2} />
              <label>Praktik Pedagogis</label>
              <Textarea value={praktikPedagogis} onChange={e => setPraktikPedagogis(e.target.value)} rows={2} />
              <label>Kemitraan Pembelajaran</label>
              <Textarea value={kemitraan} onChange={e => setKemitraan(e.target.value)} rows={2} />
              <label>Lingkungan Pembelajaran</label>
              <Textarea value={lingkungan} onChange={e => setLingkungan(e.target.value)} rows={2} />
              <label>Pemanfaatan Digital</label>
              <Textarea value={pemanfaatanDigital} onChange={e => setPemanfaatanDigital(e.target.value)} rows={2} />
            </section>
            {/* 3. Pengalaman Belajar */}
            <section>
              <h3 className="font-bold text-lg mb-2">3. Pengalaman Belajar</h3>
              <label>Kegiatan Awal</label>
              <Textarea value={kegiatanAwal} onChange={e => setKegiatanAwal(e.target.value)} rows={2} />
              <label>Kegiatan Inti</label>
              <Textarea value={kegiatanInti} onChange={e => setKegiatanInti(e.target.value)} rows={2} />
              <label>Kegiatan Penutup</label>
              <Textarea value={kegiatanPenutup} onChange={e => setKegiatanPenutup(e.target.value)} rows={2} />
            </section>
            {/* 4. Asesmen Pembelajaran */}
            <section>
              <h3 className="font-bold text-lg mb-2">4. Asesmen Pembelajaran</h3>
              <label>Asesmen Awal</label>
              <Textarea value={asesmenAwal} onChange={e => setAsesmenAwal(e.target.value)} rows={2} />
              <label>Asesmen Proses</label>
              <Textarea value={asesmenProses} onChange={e => setAsesmenProses(e.target.value)} rows={2} />
              <label>Asesmen Akhir</label>
              <Textarea value={asesmenAkhir} onChange={e => setAsesmenAkhir(e.target.value)} rows={2} />
            </section>
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
