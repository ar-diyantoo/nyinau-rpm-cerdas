import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Target, Edit, FileText, Palette, BarChart3, Smartphone, Lock, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Belajar dengan Rasa, Mengajar dengan Makna
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Platform AI untuk guru Indonesia merancang RPM (Rencana Pembelajaran Mendalam) berbasis Deep Learning dengan mudah dan cepat
          </p>
          <p className="text-lg text-muted-foreground">
            Transform curriculum into actionable, reflective lesson plans in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/signup">Mulai Gratis Sekarang</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" onClick={scrollToFeatures}>
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Buat RPM lengkap dalam hitungan menit, bukan jam
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Sesuai Kurikulum Merdeka</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Otomatis aligned dengan prinsip Deep Learning dan Profil Pelajar Pancasila
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Edit className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Fleksibel & Dapat Diedit</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Edit, sesuaikan, dan personalisasi sesuai kebutuhan kelasmu
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Cara Kerja</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Input Konteks', desc: 'Isi informasi pembelajaran: jenjang, topik, profil siswa' },
              { step: 2, title: 'AI Generate', desc: 'AI menghasilkan draft RPM berbasis Deep Learning' },
              { step: 3, title: 'Edit & Sempurnakan', desc: 'Review dan sesuaikan dengan kebutuhan kelas Anda' },
              { step: 4, title: 'Simpan & Export', desc: 'Simpan ke dashboard dan export ke PDF' },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Fitur Lengkap</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: 'RPM Standar Resmi', desc: 'Format sesuai standar RPM 2025 Kemendikbud, bukan RPP lama' },
              { icon: Palette, title: 'Editor Lengkap', desc: 'Edit setiap bagian RPM dengan rich text editor yang mudah digunakan' },
              { icon: BarChart3, title: 'Vibe Meter', desc: 'Skor otomatis untuk mengukur pembelajaran: Berkesadaran, Bermakna, Menggembirakan' },
              { icon: Smartphone, title: 'Mobile Friendly', desc: 'Akses dan edit RPM dari smartphone, tablet, atau laptop' },
              { icon: Lock, title: 'Aman & Privat', desc: 'Data RPM Anda tersimpan aman dan hanya bisa diakses oleh Anda' },
              { icon: Download, title: 'Export PDF', desc: 'Download RPM dalam format PDF profesional siap print' },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Kata Guru-Guru</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: 'Sangat membantu! Saya bisa membuat RPM dalam 15 menit yang biasanya butuh 2 jam', author: 'Ibu Sarah', role: 'Guru SD Jakarta' },
              { quote: 'Platform terbaik untuk guru. AI-nya paham konteks pendidikan Indonesia', author: 'Pak Budi', role: 'Guru SMP Bandung' },
              { quote: 'Vibe Meter membantu saya memastikan pembelajaran benar-benar bermakna untuk siswa', author: 'Ibu Ratna', role: 'Guru SMA Yogyakarta' },
            ].map((testimonial, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '1,000+', label: 'Guru Terdaftar' },
              { value: '5,000+', label: 'RPM Dibuat' },
              { value: '95%', label: 'Rating Kepuasan' },
              { value: '80%', label: 'Hemat Waktu' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Nyinauidn</h3>
            <p className="text-muted-foreground">Belajar dengan Rasa, Mengajar dengan Makna</p>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <Link to="#" className="hover:text-primary transition-colors">Tentang</Link>
              <Link to="#" className="hover:text-primary transition-colors">Fitur</Link>
              <Link to="#" className="hover:text-primary transition-colors">Kontak</Link>
              <Link to="#" className="hover:text-primary transition-colors">Blog</Link>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Nyinauidn. All rights reserved.</p>
            <p className="text-sm text-muted-foreground">Made with ❤️ for Indonesian Teachers</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
