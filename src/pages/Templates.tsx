import { Button } from '@/components/ui/button';
import { ArrowLeft, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Templates = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
    <Button asChild variant="ghost" className="absolute top-6 left-6" size="icon">
      <Link to="/dashboard"><ArrowLeft /></Link>
    </Button>
    <div className="flex flex-col items-center">
      <Info className="w-12 h-12 text-primary mb-4" />
      <h1 className="text-2xl font-bold mb-2">Fitur Template RPM</h1>
      <p className="text-muted-foreground text-center mb-4">
        Fitur <b>Lihat Template RPM</b> segera hadir.<br />
        Nantikan update berikutnya untuk akses kumpulan template RPM berbagai jenjang!
      </p>
      <Button asChild variant="outline">
        <Link to="/dashboard">Kembali ke Dashboard</Link>
      </Button>
    </div>
  </div>
);

export default Templates;
