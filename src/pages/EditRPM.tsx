import React, { useState } from "react";

const EditRPM = () => {
  const [schoolName, setSchoolName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [semester, setSemester] = useState("");
  const [week, setWeek] = useState("");
  const [duration, setDuration] = useState("");
  const [topic, setTopic] = useState("");
  const [generatedRPM, setGeneratedRPM] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi generate hanya menggunakan Lovable AI bawaan (tanpa API key eksternal)
  const handleGenerateRPM = async () => {
    setLoading(true);
    setGeneratedRPM("");
    try {
      // Prompt terstruktur, langsung untuk Lovable AI
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

      // Endpoint Lovable AI. Lovable biasanya sudah expose AI endpoint secara otomatis di backend project.
      // Biasanya endpoint: /api/ai/generate  - sesuaikan jika perlu!
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setGeneratedRPM(data.content || "");
    } catch (error) {
      alert("Gagal generate RPM. Pastikan AI Lovable telah aktif.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi download HTML
  const handleDownloadHTML = () => {
    if (!generatedRPM) {
      alert("Belum ada RPM yang berhasil digenerate!");
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
      <h2>Edit & Generate RPM (AI Lovable)</h2>
      <div style={{ marginBottom: 16 }}>
        <label>Nama Sekolah</label>
        <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="Nama Sekolah" style={{ width: "100%" }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Mata Pelajaran</label>
        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Mata Pelajaran" style={{ width: "100%" }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Kelas</label>
        <input value={grade} onChange={e => setGrade(e.target.value)} placeholder="Kelas" style={{ width: "100%" }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Semester</label>
        <input value={semester} onChange={e => setSemester(e.target.value)} placeholder="Semester" style={{ width: "100%" }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Minggu Ke</label>
        <input value={week} onChange={e => setWeek(e.target.value)} placeholder="Minggu Ke" style={{ width: "100%" }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Durasi (jam pelajaran)</label>
        <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Durasi (misal: 5x40 menit)" style={{ width: "100%" }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Topik/Materi</label>
        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topik/Materi Pokok" style={{ width: "100%" }} />
      </div>

      <button
        onClick={handleGenerateRPM}
        disabled={loading}
        style={{
          background: "#379FFF",
          color: "white",
          marginBottom: 24,
          padding: "10px 24px",
          borderRadius: 8,
          border: "none",
          width: "100%",
          fontWeight: "bold",
          fontSize: 16,
          cursor: "pointer"
        }}
      >
        {loading ? "Sedang Generate..." : "Generate RPM dengan AI"}
      </button>

      {generatedRPM && (
        <div style={{ background: "#fff", padding: 20, borderRadius: 8, marginBottom: 24 }}>
          <h3>Preview RPM (AI Output)</h3>
          <div dangerouslySetInnerHTML={{ __html: generatedRPM }} />
          <button
            onClick={handleDownloadHTML}
            style={{
              background: "#00C851",
              color: "white",
              marginTop: 16,
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              width: "100%",
              fontWeight: "bold",
              fontSize: 16,
              cursor: "pointer"
            }}
          >
            Download HTML
          </button>
        </div>
      )}
    </div>
  );
};

export default EditRPM;
