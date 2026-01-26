import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Star, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const ChatboxAI = () => {
  const chat = [
    { user: "bot", message: "Hai! Saya Nyinauidn AI ✨ Untuk menggunakan fitur AI Chat, silakan daftar atau masuk dulu ya!" },
  ];
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

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
        <div ref={bottomRef} />
      </div>
      
      {/* Show signup prompt instead of input since AI requires authentication */}
      <div className="flex flex-col items-center border-t px-4 py-4 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Fitur AI Chat memerlukan akun untuk keamanan</span>
        </div>
        <div className="flex gap-2 w-full">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/login">Masuk</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link to="/signup">Daftar Gratis</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatboxAI;
