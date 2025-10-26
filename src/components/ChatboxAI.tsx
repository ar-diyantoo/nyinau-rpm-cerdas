import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatboxAI = () => {
  const [chat, setChat] = useState([
    { user: "bot", message: "Halo! Tulis permintaan RPP/RPM di bawah ini, saya bantu generate secara otomatis 🤖" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setChat((prev) => [...prev, { user: "user", message: input }]);
    setLoading(true);
    setInput("");
    try {
      const res = await fetch("/api/generate-chat-rpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await res.json();
      setChat((prev) => [
        ...prev,
        { user: "bot", message: data.result || "Gagal generate, coba lagi!" },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        { user: "bot", message: "Terjadi error waktu memproses permintaan. Coba lagi ya!" },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="border rounded-lg p-4 max-w-xl w-full mx-auto bg-background shadow-md min-h-[380px] flex flex-col">
      <div className="flex-1 space-y-2 mb-3 overflow-y-auto">
        {chat.map((m, i) => (
          <div key={i} className={m.user === "bot" ? "text-left" : "text-right"}>
            <span
              className={
                "inline-block px-3 py-2 rounded-lg " +
                (m.user === "bot"
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground")
              }
            >
              {m.message}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-muted-foreground">AI sedang generate...</div>
        )}
      </div>
      <div className="flex gap-2 border-t pt-3">
        <Input
          className="flex-1"
          placeholder="Contoh: Buatkan RPP matematika SD tema perbandingan"
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()}>
          Kirim
        </Button>
      </div>
    </div>
  );
};

export default ChatboxAI;
