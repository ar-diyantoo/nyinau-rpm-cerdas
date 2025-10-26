const handleGenerateRPM = async () => {
  setLoading(true);
  setGeneratedRPM("");
  try {
    const prompt = `[isi prompt seperti sebelumnya...]`

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
    alert("Gagal generate RPM. Cek koneksi/credit Gemini!");
  } finally {
    setLoading(false);
  }
};
