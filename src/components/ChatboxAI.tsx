import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

const ChatboxAI = () => {
  const [chat, setChat] = useState([
    { user: "bot", message: "bikin RPM Modal Klik aja ✨" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyTrial, setAlreadyTrial] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading || alreadyTrial) return;
    setChat((prev) => [...prev, { user: "user", message: input }]);
    setLoading(true);
    setInput("");
    try {
      // Contoh fetch backend AI (dummy dulu kalau belum connect api)
      // ganti URL ini dengan endpoint API AI-mu
      const res = await fetch("/api/generate-chat-rpp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });
      let data;
      if (res.ok) {
        data = await res.json();
      } else {
        data = { result: "Gagal connect ke AI. Coba di fitur member!" };
      }
      setChat((prev) => [
        ...prev,
        { user: "bot", message: data.result || "Gagal generate, coba lagi!" },
      ]);
      setAlreadyTrial(true);
    } catch {
      setChat((prev) => [
        ...prev,
        { user: "bot", message: "Terjadi error proses AI. Coba fitur member!" },
      ]);
      setAlreadyTrial(true);
    }
    setLoading(false);
  };

  return (
    <div className="border rounded-xl shadow-sm w-full max-w-2xl bg-background mx-auto flex flex-col">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Star className="w-5 h-5 text-yellow-400" />
        <span className="font-semibold text-lg tracking-tight">Nyinauidn AI Chat</span>
      </div>
      <div className="flex-1 px-4 pb-1 overflow-y-auto min-h-[70px] max-h-[220px]">
        {chat.map((m, i) => (
          <div key={i} className={m.user === "bot" ? "text-left" : "text-right"}>
            <span
              className={
                "inline-block rounded px-2 py-1 text-base mb-2 max-w-xs " +
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
          <div className="text-muted-foreground px-2">AI sedang generate...</div>
        )}
        <div ref={bottomRef} />
      </div>
        {alreadyTrial ? (
          <div className="flex flex-col items-center border-t px-4 py-4 space-y-3">
            <span className="text-center text-sm text-muted-foreground">
              Sudah mencoba trial. <b>Ingin akses AI tanpa batas dan fitur penuh lainnya?</b>
            </span>
            <Button asChild className="w-full">
              <Link to="/signup">
                Daftar &amp; Masuk Nyinauidn
              </Link>
            </Button>
          </div>
        ) : (
          <form
            className="flex gap-2 border-t px-4 py-3"
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
          >
            <Input
              className="flex-1"
              placeholder="Coba: Buatkan RPP IPA SMP tema organ tumbuhan"
              value={input}
              disabled={loading}
              onChange={e => setInput(e.target.value)}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              Kirim
            </Button>
          </form>
        )}
    </div>
  );
};

export default ChatboxAI;
