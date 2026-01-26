import { RPMFormData } from '@/pages/CreateRPM';

export interface RPMTemplate {
  id: string;
  name: string;
  description: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK';
  subject: string;
  category: string;
  icon: string;
  formData: Partial<RPMFormData>;
}

export const rpmTemplates: RPMTemplate[] = [
  // SD Templates
  {
    id: 'sd-matematika-pecahan',
    name: 'Matematika: Pecahan Sederhana',
    description: 'Template untuk mengajarkan konsep pecahan sederhana dengan pendekatan konkret-visual-abstrak',
    jenjang: 'SD',
    subject: 'Matematika',
    category: 'Matematika',
    icon: 'Calculator',
    formData: {
      jenjang: 'SD',
      fase: 'Fase B (Kelas 3-4)',
      subject: 'Matematika',
      topic: 'Pecahan Sederhana',
      duration_jp: 2,
      semester: 'Ganjil',
      student_readiness: 'Siswa sudah memahami konsep bilangan bulat dan operasi dasar penjumlahan serta pengurangan. Gaya belajar dominan adalah visual dan kinestetik.',
      profil_pelajar_pancasila: ['Bernalar Kritis', 'Mandiri'],
      materi_characteristics: 'Materi ini bersifat konseptual dengan tingkat kompleksitas sedang. Memerlukan pemahaman tentang bagian dari keseluruhan.',
      capaian_pembelajaran: 'Peserta didik dapat mengenal dan memahami pecahan sederhana (setengah, sepertiga, seperempat) sebagai bagian dari keseluruhan.',
      learning_objectives: '1. Siswa dapat menjelaskan arti pecahan sebagai bagian dari keseluruhan\n2. Siswa dapat menentukan pecahan sederhana dari gambar\n3. Siswa dapat membandingkan dua pecahan sederhana',
      learning_approach: ['Berbasis Proyek', 'Pembelajaran Kooperatif'],
      cross_disciplinary_integration: 'Integrasi dengan seni (menggambar pecahan) dan kehidupan sehari-hari (membagi makanan)',
      learning_framework: {
        pedagogis: 'Pendekatan konkret-visual-abstrak untuk membangun pemahaman konsep',
        kemitraan: 'Kerja kelompok dalam eksplorasi pecahan dengan benda konkret',
        lingkungan: 'Menggunakan benda-benda di sekitar kelas sebagai media pembelajaran',
        digital: 'Video animasi pecahan sebagai penguatan'
      },
      mindfulness_level: 4,
      meaningfulness_level: 4,
      joyfulness_level: 5,
      learning_principles_description: 'Pembelajaran mengutamakan pengalaman langsung dengan manipulasi benda konkret sebelum abstraksi',
      special_considerations: 'Perhatikan siswa yang kesulitan memahami konsep bagian-keseluruhan',
      teacher_expectations: 'Siswa dapat mengaplikasikan konsep pecahan dalam situasi nyata'
    }
  },
  {
    id: 'sd-ipas-ekosistem',
    name: 'IPAS: Ekosistem dan Rantai Makanan',
    description: 'Template pembelajaran tentang ekosistem dengan pendekatan observasi lingkungan sekitar',
    jenjang: 'SD',
    subject: 'IPAS',
    category: 'Sains',
    icon: 'Leaf',
    formData: {
      jenjang: 'SD',
      fase: 'Fase C (Kelas 5-6)',
      subject: 'IPAS',
      topic: 'Ekosistem dan Rantai Makanan',
      duration_jp: 3,
      semester: 'Genap',
      student_readiness: 'Siswa sudah mengenal berbagai jenis makhluk hidup dan habitatnya. Memiliki keingintahuan tinggi tentang alam.',
      profil_pelajar_pancasila: ['Bernalar Kritis', 'Berkebinekaan Global', 'Bergotong Royong'],
      materi_characteristics: 'Materi konseptual yang memerlukan pemahaman hubungan antar makhluk hidup dalam suatu sistem.',
      capaian_pembelajaran: 'Peserta didik dapat menganalisis hubungan antar komponen ekosistem dan memahami rantai makanan.',
      learning_objectives: '1. Siswa dapat mengidentifikasi komponen biotik dan abiotik ekosistem\n2. Siswa dapat menjelaskan rantai makanan dalam ekosistem\n3. Siswa dapat menganalisis dampak perubahan ekosistem',
      learning_approach: ['Berbasis Proyek', 'Pembelajaran Inkuiri'],
      cross_disciplinary_integration: 'Integrasi dengan matematika (grafik populasi) dan bahasa Indonesia (laporan pengamatan)',
      learning_framework: {
        pedagogis: 'Inquiry-based learning dengan observasi langsung',
        kemitraan: 'Proyek kelompok menyusun model ekosistem',
        lingkungan: 'Observasi ekosistem di lingkungan sekolah',
        digital: 'Dokumentasi foto dan video ekosistem'
      },
      mindfulness_level: 4,
      meaningfulness_level: 5,
      joyfulness_level: 5,
      learning_principles_description: 'Pembelajaran berbasis pengalaman langsung dengan alam sekitar',
      special_considerations: 'Pastikan keamanan siswa saat observasi di luar kelas',
      teacher_expectations: 'Siswa memiliki kesadaran lingkungan dan pemahaman tentang keseimbangan ekosistem'
    }
  },
  {
    id: 'sd-bahasa-indonesia-cerita',
    name: 'Bahasa Indonesia: Menulis Cerita',
    description: 'Template pembelajaran menulis cerita pendek dengan teknik pengembangan karakter',
    jenjang: 'SD',
    subject: 'Bahasa Indonesia',
    category: 'Bahasa',
    icon: 'BookOpen',
    formData: {
      jenjang: 'SD',
      fase: 'Fase C (Kelas 5-6)',
      subject: 'Bahasa Indonesia',
      topic: 'Menulis Cerita Pendek',
      duration_jp: 2,
      semester: 'Ganjil',
      student_readiness: 'Siswa sudah mampu menulis paragraf dan memiliki imajinasi yang baik. Beberapa siswa memerlukan panduan struktur.',
      profil_pelajar_pancasila: ['Kreatif', 'Mandiri'],
      materi_characteristics: 'Materi prosedural dengan elemen kreativitas tinggi. Memerlukan kebebasan berekspresi.',
      capaian_pembelajaran: 'Peserta didik dapat menulis cerita pendek dengan struktur yang jelas dan pengembangan karakter yang baik.',
      learning_objectives: '1. Siswa dapat menentukan tema dan tokoh cerita\n2. Siswa dapat menyusun alur cerita dengan struktur awal-tengah-akhir\n3. Siswa dapat mengembangkan dialog antar tokoh',
      learning_approach: ['Berbasis Proyek', 'Diferensiasi'],
      cross_disciplinary_integration: 'Integrasi dengan seni (ilustrasi cerita) dan pendidikan karakter',
      learning_framework: {
        pedagogis: 'Writer\'s workshop dengan conference individual',
        kemitraan: 'Peer review dan sharing circle',
        lingkungan: 'Pojok menulis yang nyaman',
        digital: 'Pengetikan dan presentasi cerita'
      },
      mindfulness_level: 5,
      meaningfulness_level: 5,
      joyfulness_level: 5,
      learning_principles_description: 'Proses menulis yang menyenangkan dengan kebebasan berekspresi',
      special_considerations: 'Berikan scaffolding untuk siswa yang kesulitan memulai',
      teacher_expectations: 'Siswa menghasilkan cerita orisinal yang mencerminkan kreativitas mereka'
    }
  },
  
  // SMP Templates
  {
    id: 'smp-matematika-aljabar',
    name: 'Matematika: Persamaan Linear',
    description: 'Template untuk mengajarkan persamaan linear satu variabel dengan konteks nyata',
    jenjang: 'SMP',
    subject: 'Matematika',
    category: 'Matematika',
    icon: 'Calculator',
    formData: {
      jenjang: 'SMP',
      fase: 'Fase D (Kelas 7-9)',
      subject: 'Matematika',
      topic: 'Persamaan Linear Satu Variabel',
      duration_jp: 2,
      semester: 'Ganjil',
      student_readiness: 'Siswa sudah memahami operasi bilangan dan konsep variabel. Beberapa siswa perlu penguatan pada operasi negatif.',
      profil_pelajar_pancasila: ['Bernalar Kritis', 'Mandiri'],
      materi_characteristics: 'Materi prosedural-konseptual dengan penekanan pada pemecahan masalah.',
      capaian_pembelajaran: 'Peserta didik dapat menyelesaikan persamaan linear satu variabel dan menerapkannya dalam pemecahan masalah.',
      learning_objectives: '1. Siswa dapat mengidentifikasi persamaan linear satu variabel\n2. Siswa dapat menyelesaikan persamaan linear dengan berbagai metode\n3. Siswa dapat menerapkan persamaan linear dalam masalah kontekstual',
      learning_approach: ['Berbasis Masalah', 'Pembelajaran Kooperatif'],
      cross_disciplinary_integration: 'Aplikasi dalam IPA (rumus fisika) dan ekonomi sederhana',
      learning_framework: {
        pedagogis: 'Problem-based learning dengan scaffolding',
        kemitraan: 'Think-pair-share dalam pemecahan masalah',
        lingkungan: 'Konteks masalah dari kehidupan remaja',
        digital: 'Simulasi aljabar interaktif'
      },
      mindfulness_level: 4,
      meaningfulness_level: 4,
      joyfulness_level: 4,
      learning_principles_description: 'Pembelajaran bermakna dengan koneksi ke dunia nyata siswa',
      special_considerations: 'Siapkan soal dengan tingkat kesulitan berjenjang',
      teacher_expectations: 'Siswa dapat menggunakan aljabar sebagai alat pemecahan masalah'
    }
  },
  {
    id: 'smp-ipa-listrik',
    name: 'IPA: Rangkaian Listrik',
    description: 'Template praktikum rangkaian listrik dengan pendekatan hands-on',
    jenjang: 'SMP',
    subject: 'IPA',
    category: 'Sains',
    icon: 'Zap',
    formData: {
      jenjang: 'SMP',
      fase: 'Fase D (Kelas 7-9)',
      subject: 'IPA',
      topic: 'Rangkaian Listrik Seri dan Paralel',
      duration_jp: 3,
      semester: 'Genap',
      student_readiness: 'Siswa sudah mengenal konsep arus listrik dan tegangan. Memerlukan pengalaman praktikum langsung.',
      profil_pelajar_pancasila: ['Bernalar Kritis', 'Bergotong Royong', 'Kreatif'],
      materi_characteristics: 'Materi prosedural dengan komponen eksperimen. Memerlukan keterampilan merangkai alat.',
      capaian_pembelajaran: 'Peserta didik dapat merangkai dan menganalisis rangkaian listrik seri dan paralel.',
      learning_objectives: '1. Siswa dapat merangkai rangkaian seri dan paralel\n2. Siswa dapat mengukur arus dan tegangan dalam rangkaian\n3. Siswa dapat membandingkan karakteristik rangkaian seri dan paralel',
      learning_approach: ['Pembelajaran Inkuiri', 'Berbasis Proyek'],
      cross_disciplinary_integration: 'Matematika (perhitungan Ohm) dan teknologi (aplikasi dalam alat elektronik)',
      learning_framework: {
        pedagogis: 'Guided inquiry dengan praktikum terstruktur',
        kemitraan: 'Kerja kelompok praktikum',
        lingkungan: 'Laboratorium IPA dengan kit listrik',
        digital: 'Simulasi rangkaian virtual sebagai penguatan'
      },
      mindfulness_level: 4,
      meaningfulness_level: 5,
      joyfulness_level: 5,
      learning_principles_description: 'Belajar melalui pengalaman langsung dan eksperimen',
      special_considerations: 'Keamanan penggunaan listrik dan peralatan laboratorium',
      teacher_expectations: 'Siswa memahami aplikasi rangkaian listrik dalam kehidupan sehari-hari'
    }
  },
  {
    id: 'smp-bahasa-inggris-narrative',
    name: 'Bahasa Inggris: Narrative Text',
    description: 'Template pembelajaran teks naratif dengan storytelling approach',
    jenjang: 'SMP',
    subject: 'Bahasa Inggris',
    category: 'Bahasa',
    icon: 'Languages',
    formData: {
      jenjang: 'SMP',
      fase: 'Fase D (Kelas 7-9)',
      subject: 'Bahasa Inggris',
      topic: 'Narrative Text - Fairy Tales',
      duration_jp: 2,
      semester: 'Ganjil',
      student_readiness: 'Siswa memiliki kosakata dasar dan mampu membaca teks sederhana. Perlu penguatan grammar past tense.',
      profil_pelajar_pancasila: ['Berkebinekaan Global', 'Kreatif'],
      materi_characteristics: 'Materi berbasis teks dengan fokus pada struktur dan fitur kebahasaan.',
      capaian_pembelajaran: 'Peserta didik dapat memahami dan memproduksi teks naratif dengan struktur yang benar.',
      learning_objectives: '1. Siswa dapat mengidentifikasi struktur teks naratif\n2. Siswa dapat menemukan moral value dari cerita\n3. Siswa dapat menceritakan ulang cerita dengan bahasa sendiri',
      learning_approach: ['Berbasis Proyek', 'Pembelajaran Kooperatif'],
      cross_disciplinary_integration: 'Seni pertunjukan (drama) dan pendidikan karakter',
      learning_framework: {
        pedagogis: 'Genre-based approach dengan model text',
        kemitraan: 'Storytelling circle dan peer feedback',
        lingkungan: 'Reading corner dengan koleksi cerita',
        digital: 'Audio book dan video storytelling'
      },
      mindfulness_level: 4,
      meaningfulness_level: 5,
      joyfulness_level: 5,
      learning_principles_description: 'Pembelajaran bahasa melalui cerita yang menarik dan bermakna',
      special_considerations: 'Pilih cerita yang sesuai dengan minat dan tingkat bahasa siswa',
      teacher_expectations: 'Siswa dapat mengapresiasi sastra dan mengekspresikan diri dalam bahasa Inggris'
    }
  },
  
  // SMA Templates
  {
    id: 'sma-fisika-gerak',
    name: 'Fisika: Gerak Lurus',
    description: 'Template pembelajaran kinematika dengan eksperimen dan analisis data',
    jenjang: 'SMA',
    subject: 'Fisika',
    category: 'Sains',
    icon: 'Activity',
    formData: {
      jenjang: 'SMA',
      fase: 'Fase E (Kelas 10)',
      subject: 'Fisika',
      topic: 'Gerak Lurus Beraturan dan Berubah Beraturan',
      duration_jp: 3,
      semester: 'Ganjil',
      student_readiness: 'Siswa memahami konsep dasar vektor dan operasi matematika. Perlu pengalaman analisis grafik.',
      profil_pelajar_pancasila: ['Bernalar Kritis', 'Mandiri', 'Kreatif'],
      materi_characteristics: 'Materi konseptual-prosedural dengan penekanan pada analisis kuantitatif.',
      capaian_pembelajaran: 'Peserta didik dapat menganalisis gerak lurus dengan pendekatan matematis dan eksperimental.',
      learning_objectives: '1. Siswa dapat membedakan GLB dan GLBB\n2. Siswa dapat menganalisis grafik gerak (s-t, v-t, a-t)\n3. Siswa dapat menyelesaikan persoalan gerak lurus',
      learning_approach: ['Pembelajaran Inkuiri', 'Berbasis Masalah'],
      cross_disciplinary_integration: 'Matematika (kalkulus dasar) dan olahraga (analisis gerakan)',
      learning_framework: {
        pedagogis: 'Inquiry with data analysis',
        kemitraan: 'Lab group dengan peer teaching',
        lingkungan: 'Laboratorium fisika dengan sensor gerak',
        digital: 'Phyphox app untuk pengukuran dan Logger Pro untuk analisis'
      },
      mindfulness_level: 4,
      meaningfulness_level: 5,
      joyfulness_level: 4,
      learning_principles_description: 'Pembelajaran sains berbasis bukti dan eksperimen',
      special_considerations: 'Berikan konteks aplikasi nyata untuk meningkatkan motivasi',
      teacher_expectations: 'Siswa dapat berpikir seperti fisikawan dalam menganalisis fenomena gerak'
    }
  },
  {
    id: 'sma-biologi-sel',
    name: 'Biologi: Struktur dan Fungsi Sel',
    description: 'Template pembelajaran sel dengan mikroskop dan model 3D',
    jenjang: 'SMA',
    subject: 'Biologi',
    category: 'Sains',
    icon: 'Microscope',
    formData: {
      jenjang: 'SMA',
      fase: 'Fase E (Kelas 10)',
      subject: 'Biologi',
      topic: 'Struktur dan Fungsi Sel',
      duration_jp: 3,
      semester: 'Ganjil',
      student_readiness: 'Siswa sudah mengenal sel dari SMP. Memerlukan penguatan penggunaan mikroskop.',
      profil_pelajar_pancasila: ['Bernalar Kritis', 'Kreatif', 'Bergotong Royong'],
      materi_characteristics: 'Materi faktual-konseptual dengan detail struktur yang kompleks.',
      capaian_pembelajaran: 'Peserta didik dapat menganalisis struktur sel dan menghubungkan dengan fungsinya.',
      learning_objectives: '1. Siswa dapat mengidentifikasi organel sel dan fungsinya\n2. Siswa dapat membandingkan sel hewan dan sel tumbuhan\n3. Siswa dapat mengamati sel di bawah mikroskop',
      learning_approach: ['Pembelajaran Inkuiri', 'Berbasis Proyek'],
      cross_disciplinary_integration: 'Kimia (biomolekul) dan seni (ilustrasi sel)',
      learning_framework: {
        pedagogis: 'Observation-based learning dengan microscopy',
        kemitraan: 'Jigsaw untuk organel sel',
        lingkungan: 'Laboratorium biologi dengan preparat',
        digital: 'Virtual cell tour dan animasi 3D'
      },
      mindfulness_level: 4,
      meaningfulness_level: 5,
      joyfulness_level: 5,
      learning_principles_description: 'Melihat adalah percaya - pengamatan langsung sebagai dasar pemahaman',
      special_considerations: 'Siapkan panduan penggunaan mikroskop yang detail',
      teacher_expectations: 'Siswa mengapresiasi kompleksitas kehidupan di tingkat seluler'
    }
  },
  {
    id: 'sma-ekonomi-pasar',
    name: 'Ekonomi: Permintaan dan Penawaran',
    description: 'Template pembelajaran ekonomi mikro dengan simulasi pasar',
    jenjang: 'SMA',
    subject: 'Ekonomi',
    category: 'Sosial',
    icon: 'TrendingUp',
    formData: {
      jenjang: 'SMA',
      fase: 'Fase E (Kelas 10)',
      subject: 'Ekonomi',
      topic: 'Permintaan, Penawaran, dan Harga Keseimbangan',
      duration_jp: 2,
      semester: 'Genap',
      student_readiness: 'Siswa memahami konsep dasar ekonomi dan sudah familiar dengan grafik.',
      profil_pelajar_pancasila: ['Bernalar Kritis', 'Mandiri'],
      materi_characteristics: 'Materi konseptual dengan analisis grafik dan perhitungan matematis.',
      capaian_pembelajaran: 'Peserta didik dapat menganalisis mekanisme pasar dan menentukan harga keseimbangan.',
      learning_objectives: '1. Siswa dapat menjelaskan hukum permintaan dan penawaran\n2. Siswa dapat menggambar kurva permintaan dan penawaran\n3. Siswa dapat menghitung harga dan kuantitas keseimbangan',
      learning_approach: ['Berbasis Masalah', 'Simulasi'],
      cross_disciplinary_integration: 'Matematika (grafik fungsi) dan kewirausahaan',
      learning_framework: {
        pedagogis: 'Market simulation dan case study',
        kemitraan: 'Trading game dalam kelompok',
        lingkungan: 'Analisis pasar lokal sebagai konteks',
        digital: 'Spreadsheet untuk perhitungan dan grafik'
      },
      mindfulness_level: 4,
      meaningfulness_level: 5,
      joyfulness_level: 5,
      learning_principles_description: 'Belajar ekonomi melalui pengalaman pasar yang disimulasikan',
      special_considerations: 'Gunakan contoh produk yang relevan dengan kehidupan siswa',
      teacher_expectations: 'Siswa memahami bagaimana harga terbentuk di pasar'
    }
  },
  
  // SMK Templates
  {
    id: 'smk-produktif-desain',
    name: 'Desain Grafis: Branding',
    description: 'Template pembelajaran desain identitas visual untuk bisnis',
    jenjang: 'SMK',
    subject: 'Desain Komunikasi Visual',
    category: 'Produktif',
    icon: 'Palette',
    formData: {
      jenjang: 'SMK',
      fase: 'Fase F (Kelas 11-12)',
      subject: 'Desain Komunikasi Visual',
      topic: 'Desain Logo dan Brand Identity',
      duration_jp: 4,
      semester: 'Ganjil',
      student_readiness: 'Siswa sudah menguasai software desain dasar dan memahami prinsip desain.',
      profil_pelajar_pancasila: ['Kreatif', 'Mandiri', 'Bergotong Royong'],
      materi_characteristics: 'Materi prosedural dengan output produk nyata. Memerlukan kreativitas tinggi.',
      capaian_pembelajaran: 'Peserta didik dapat merancang identitas visual yang konsisten untuk sebuah brand.',
      learning_objectives: '1. Siswa dapat menganalisis brief klien\n2. Siswa dapat membuat logo dengan berbagai teknik\n3. Siswa dapat menyusun brand guideline',
      learning_approach: ['Berbasis Proyek', 'Teaching Factory'],
      cross_disciplinary_integration: 'Kewirausahaan dan bahasa Inggris (presentasi)',
      learning_framework: {
        pedagogis: 'Project-based dengan client simulation',
        kemitraan: 'Design review dan critique session',
        lingkungan: 'Studio desain dengan workstation',
        digital: 'Adobe Creative Suite dan Figma'
      },
      mindfulness_level: 4,
      meaningfulness_level: 5,
      joyfulness_level: 5,
      learning_principles_description: 'Belajar desain melalui proyek nyata dengan standar industri',
      special_considerations: 'Siapkan brief dari klien nyata atau simulasi yang realistis',
      teacher_expectations: 'Siswa menghasilkan portofolio branding yang layak industri'
    }
  },
  {
    id: 'smk-produktif-programming',
    name: 'RPL: Pengembangan Web',
    description: 'Template pembelajaran pemrograman web dengan project-based learning',
    jenjang: 'SMK',
    subject: 'Rekayasa Perangkat Lunak',
    category: 'Produktif',
    icon: 'Code',
    formData: {
      jenjang: 'SMK',
      fase: 'Fase F (Kelas 11-12)',
      subject: 'Rekayasa Perangkat Lunak',
      topic: 'Pengembangan Website Responsif',
      duration_jp: 4,
      semester: 'Genap',
      student_readiness: 'Siswa sudah menguasai HTML dan CSS dasar. Perlu penguatan JavaScript.',
      profil_pelajar_pancasila: ['Bernalar Kritis', 'Kreatif', 'Mandiri'],
      materi_characteristics: 'Materi prosedural dengan kompleksitas tinggi. Memerlukan praktik intensif.',
      capaian_pembelajaran: 'Peserta didik dapat mengembangkan website responsif dengan HTML, CSS, dan JavaScript.',
      learning_objectives: '1. Siswa dapat membuat layout responsif dengan CSS Grid/Flexbox\n2. Siswa dapat menambahkan interaktivitas dengan JavaScript\n3. Siswa dapat menerapkan best practice pengembangan web',
      learning_approach: ['Berbasis Proyek', 'Teaching Factory'],
      cross_disciplinary_integration: 'Desain grafis (UI/UX) dan kewirausahaan digital',
      learning_framework: {
        pedagogis: 'Learning by doing dengan code review',
        kemitraan: 'Pair programming dan tech sharing',
        lingkungan: 'Lab komputer dengan development tools',
        digital: 'VS Code, Git, dan browser DevTools'
      },
      mindfulness_level: 4,
      meaningfulness_level: 5,
      joyfulness_level: 4,
      learning_principles_description: 'Belajar programming dengan membangun proyek nyata',
      special_considerations: 'Berikan tantangan berjenjang sesuai tingkat kemampuan',
      teacher_expectations: 'Siswa memiliki portofolio website yang dapat ditampilkan'
    }
  },
  {
    id: 'smk-produktif-akuntansi',
    name: 'Akuntansi: Laporan Keuangan',
    description: 'Template pembelajaran penyusunan laporan keuangan dengan software akuntansi',
    jenjang: 'SMK',
    subject: 'Akuntansi',
    category: 'Produktif',
    icon: 'FileSpreadsheet',
    formData: {
      jenjang: 'SMK',
      fase: 'Fase F (Kelas 11-12)',
      subject: 'Akuntansi',
      topic: 'Penyusunan Laporan Keuangan',
      duration_jp: 3,
      semester: 'Genap',
      student_readiness: 'Siswa sudah memahami siklus akuntansi dan dapat membuat jurnal. Familiar dengan spreadsheet.',
      profil_pelajar_pancasila: ['Bernalar Kritis', 'Mandiri'],
      materi_characteristics: 'Materi prosedural dengan standar akuntansi yang ketat.',
      capaian_pembelajaran: 'Peserta didik dapat menyusun laporan keuangan sesuai standar akuntansi.',
      learning_objectives: '1. Siswa dapat menyusun neraca saldo\n2. Siswa dapat membuat laporan laba rugi\n3. Siswa dapat menyusun laporan posisi keuangan',
      learning_approach: ['Berbasis Masalah', 'Teaching Factory'],
      cross_disciplinary_integration: 'Matematika (perhitungan) dan bahasa Indonesia (penyajian laporan)',
      learning_framework: {
        pedagogis: 'Case-based dengan data perusahaan simulasi',
        kemitraan: 'Tim audit internal',
        lingkungan: 'Lab akuntansi dengan software MYOB/Accurate',
        digital: 'Software akuntansi dan spreadsheet'
      },
      mindfulness_level: 5,
      meaningfulness_level: 5,
      joyfulness_level: 3,
      learning_principles_description: 'Pembelajaran akuntansi dengan kasus nyata perusahaan',
      special_considerations: 'Pastikan data kasus konsisten dan tidak ada error',
      teacher_expectations: 'Siswa dapat menyusun laporan keuangan yang akurat dan rapi'
    }
  }
];

export const templateCategories = [
  { id: 'all', name: 'Semua Template', icon: 'LayoutGrid' },
  { id: 'Matematika', name: 'Matematika', icon: 'Calculator' },
  { id: 'Sains', name: 'Sains', icon: 'FlaskConical' },
  { id: 'Bahasa', name: 'Bahasa', icon: 'Languages' },
  { id: 'Sosial', name: 'Sosial', icon: 'Users' },
  { id: 'Produktif', name: 'Produktif (SMK)', icon: 'Briefcase' },
];

export const jenjangFilters = [
  { id: 'all', name: 'Semua Jenjang' },
  { id: 'SD', name: 'SD' },
  { id: 'SMP', name: 'SMP' },
  { id: 'SMA', name: 'SMA' },
  { id: 'SMK', name: 'SMK' },
];
