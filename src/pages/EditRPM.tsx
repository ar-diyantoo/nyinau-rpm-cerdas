import React, { useState } from "react";

const EditRPM: React.FC = () => {
  const [schoolName, setSchoolName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [semester, setSemester] = useState("");
  const [week, setWeek] = useState("");
  const [duration, setDuration] = useState("");
  const [topic, setTopic] = useState("");
  const [generatedRPM, setGeneratedRPM] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateRPM = async () => {
    setLoading(true);
    setGeneratedRPM("");
    try {
      const prompt = `
Buatkan Rancangan Pembelajaran Mingguan (RPM) berbasis Deep Learning untuk guru dengan data:
Nama Sekolah: ${schoolName}
Mata Pelajaran: ${subject}
Kelas: ${grade}
Semester: ${semester}
Minggu Ke: ${week}
Durasi: ${duration}
Topik/Materi Pokok: ${topic}

Format keluaran HTML terstruktur lengkap:
1. Identitas
2. Capaian Pembelajaran
3. Tujuan Pembelajaran
4. Kegiatan Pembelajaran (tabel 5 hari)
5. Asesmen
6. Refleksi

HTML siap download dan dibuka di browser.
`;
      const response = await fetch(
        "https://pgluhrktglhhifotebgg.supabase.co/functions/v1/generate_rpm",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );
      const data = await response.json();
      setGeneratedRPM(data.content || "");
    } catch (error) {
      alert("Gagal generate RPM. Cek koneksi atau API Gemini!");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadHTML = () => {
    if (!generatedRPM) {
      alert("Belum ada RPM yang digenerate!");
      return;
    }
    const content = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>RPM - ${schoolName}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 900px; margin:auto; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #888; padding: 10px; }
    th { background: #0077cc; color: #fff; }
    h1, h2, h3 { color: #333;}
  </style>
</head>
<body>
${generatedRPM}
</body>
</html>
`;
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RPM-${schoolName || "output"}-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 600, margin: "32px auto", padding: 24, background: "#F4FBFD", borderRadius: 12 }}>
      <h2>Edit & Generate RPM dengan Gemini AI (Supabase Function)</h2>
      <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="Nama Sekolah" style={{ width: "100%", marginBottom: 10 }} />
      <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Mata Pelajaran" style={{ width: "100%", marginBottom: 10 }} />
      <input value={grade} onChange={e => setGrade(e.target.value)} placeholder="Kelas" style={{ width: "100%", marginBottom: 10 }} />
      <input value={semester} onChange={e => setSemester(e.target.value)} placeholder="Semester" style={{ width: "100%", marginBottom: 10 }} />
      <input value={week} onChange={e => setWeek(e.target.value)} placeholder="Minggu Ke" style={{ width: "100%", marginBottom: 10 }} />
      <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Durasi" style={{ width: "100%", marginBottom: 10 }} />
      <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topik/Materi Pokok" style={{ width: "100%", marginBottom: 10 }} />

      <button
        onClick={handleGenerateRPM}
        disabled={loading}
        style={{ background: "#3399FF", color: "#fff", width: "100%", padding: "10px", border: "none", borderRadius: 8, fontWeight: "bold", fontSize: 16, marginBottom: 16 }}
      >
        {loading ? "Sedang Generate..." : "Generate RPM dengan AI"}
      </button>

      {generatedRPM && (
        <div style={{ background: "#fff", padding: 20, borderRadius: 8 }}>
          <h3>Preview RPM</h3>
          <div dangerouslySetInnerHTML={{ __html: generatedRPM }} />
          <button
            onClick={handleDownloadHTML}
            style={{ background: "#00C851", color: "#fff", width: "100%", padding: "10px", border: "none", borderRadius: 8, fontWeight: "bold", fontSize: 16, marginTop: 16 }}
          >
            Download HTML
          </button>
        </div>
      )}
    </div>
  );
};

// EXPORT DEFAULT WAJIB!
export default EditRPM;
