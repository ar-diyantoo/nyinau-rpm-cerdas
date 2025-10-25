import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import StepIndicator from '@/components/rpm/StepIndicator';
import Step1Identitas from '@/components/rpm/Step1Identitas';
import Step2Identifikasi from '@/components/rpm/Step2Identifikasi';
import Step3Desain from '@/components/rpm/Step3Desain';
import Step4Prinsip from '@/components/rpm/Step4Prinsip';
import { Loader2 } from 'lucide-react';

export interface RPMFormData {
  // Step 1: Identitas
  satuan_pendidikan: string;
  jenjang: 'SD' | 'SMP' | 'SMA' | 'SMK' | '';
  fase: string;
  semester: 'Ganjil' | 'Genap' | '';
  subject: string;
  topic: string;
  duration_jp: number;
  
  // Step 2: Identifikasi
  student_readiness: string;
  student_social_emotional_context: string;
  profil_pelajar_pancasila: string[];
  materi_characteristics: string;
  
  // Step 3: Desain
  capaian_pembelajaran: string;
  learning_objectives: string;
  learning_approach: string[];
  cross_disciplinary_integration: string;
  learning_framework: {
    pedagogis: string;
    kemitraan: string;
    lingkungan: string;
    digital: string;
  };
  
  // Step 4: Prinsip
  mindfulness_level: number;
  meaningfulness_level: number;
  joyfulness_level: number;
  learning_principles_description: string;
  special_considerations: string;
  teacher_expectations: string;
}

const initialFormData: RPMFormData = {
  satuan_pendidikan: '',
  jenjang: '',
  fase: '',
  semester: '',
  subject: '',
  topic: '',
  duration_jp: 2,
  student_readiness: '',
  student_social_emotional_context: '',
  profil_pelajar_pancasila: [],
  materi_characteristics: '',
  capaian_pembelajaran: '',
  learning_objectives: '',
  learning_approach: [],
  cross_disciplinary_integration: '',
  learning_framework: {
    pedagogis: '',
    kemitraan: '',
    lingkungan: '',
    digital: '',
  },
  mindfulness_level: 3,
  meaningfulness_level: 3,
  joyfulness_level: 3,
  learning_principles_description: '',
  special_considerations: '',
  teacher_expectations: '',
};

const CreateRPM = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RPMFormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const loadingMessages = [
    'Memahami konteks pembelajaran...',
    'Menganalisis profil siswa...',
    'Merancang kegiatan pembelajaran...',
    'Menyusun asesmen...',
    'Hampir selesai...',
  ];

  const updateFormData = (updates: Partial<RPMFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    // Basic validation per step
    if (currentStep === 1) {
      if (!formData.satuan_pendidikan || !formData.jenjang || !formData.fase || 
          !formData.semester || !formData.subject || !formData.topic) {
        toast.error('Mohon lengkapi semua field yang wajib diisi');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.student_readiness || formData.profil_pelajar_pancasila.length === 0 || 
          !formData.materi_characteristics) {
        toast.error('Mohon lengkapi semua field yang wajib diisi');
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.capaian_pembelajaran || !formData.learning_objectives || 
          formData.learning_approach.length === 0 || !formData.learning_framework.pedagogis ||
          !formData.learning_framework.lingkungan) {
        toast.error('Mohon lengkapi semua field yang wajib diisi');
        return;
      }
    }
    
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSaveDraft = async () => {
    try {
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert({
          user_id: user?.id,
          title: `${formData.subject} - ${formData.topic}`,
          is_draft: true,
          ...formData,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Draft berhasil disimpan');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast.error('Gagal menyimpan draft');
    }
  };

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      
      // Cycle through loading messages
      let messageIndex = 0;
      setLoadingMessage(loadingMessages[0]);
      
      const messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 2000);

      // Create lesson plan with placeholder content
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert({
          user_id: user?.id,
          title: `${formData.subject} - ${formData.topic}`,
          is_draft: false,
          ...formData,
          // Placeholder AI-generated content (will be replaced with real AI later)
          meaningful_understanding: `Pemahaman bermakna untuk ${formData.topic} akan membantu siswa menghubungkan konsep dengan kehidupan nyata mereka.`,
          trigger_questions: `1. Apa yang sudah kamu ketahui tentang ${formData.topic}?\n2. Bagaimana ${formData.topic} berkaitan dengan kehidupan sehari-hari?\n3. Mengapa ${formData.topic} penting untuk dipelajari?`,
          activities_opening: `Kegiatan Pendahuluan (${Math.round(formData.duration_jp * 35 * 0.15)} menit):\n- Guru membuka pembelajaran dengan salam dan berdoa\n- Apersepsi: Menghubungkan materi dengan pengalaman siswa\n- Menyampaikan tujuan pembelajaran`,
          activities_core: `Kegiatan Inti (${Math.round(formData.duration_jp * 35 * 0.70)} menit):\n- Siswa melakukan eksplorasi materi ${formData.topic}\n- Diskusi kelompok tentang konsep utama\n- Praktik dan penerapan konsep`,
          activities_closing: `Kegiatan Penutup (${Math.round(formData.duration_jp * 35 * 0.15)} menit):\n- Refleksi pembelajaran\n- Kesimpulan bersama\n- Penguatan dan tindak lanjut`,
          assessment_initial: 'Asesmen diagnostik melalui pertanyaan pemantik dan diskusi awal.',
          assessment_formative: 'Observasi selama kegiatan pembelajaran dan umpan balik berkelanjutan.',
          assessment_summative: 'Penilaian akhir melalui proyek atau presentasi hasil belajar siswa.',
          resources: '- Buku teks siswa\n- Lembar kerja\n- Media presentasi\n- Sumber belajar digital',
          reflection_teacher: 'Refleksi untuk memahami apa yang berhasil dan area yang perlu perbaikan.',
          reflection_students: 'Siswa merefleksikan: Apa yang telah dipelajari? Bagaimana perasaan selama belajar? Apa yang masih ingin dipelajari?',
        })
        .select()
        .single();

      clearInterval(messageInterval);

      if (error) throw error;

      toast.success('RPM berhasil dibuat!');
      navigate(`/dashboard/edit/${data.id}`);
    } catch (error: any) {
      console.error('Error generating RPM:', error);
      toast.error('Gagal membuat RPM');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-primary mb-2">
          Buat Rencana Pembelajaran Mendalam (RPM)
        </h1>
        <p className="text-muted-foreground">
          Isi informasi berikut untuk menghasilkan RPM berbasis Deep Learning dengan AI
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      {/* Form Content */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && '📌 Identitas Pembelajaran'}
            {currentStep === 2 && '👥 Identifikasi Peserta Didik'}
            {currentStep === 3 && '🎯 Desain Pembelajaran'}
            {currentStep === 4 && '✨ Prinsip Pengalaman Belajar'}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Informasi dasar tentang pembelajaran yang akan dirancang'}
            {currentStep === 2 && 'Pahami karakteristik dan kebutuhan siswa Anda'}
            {currentStep === 3 && 'Rancang pendekatan dan strategi pembelajaran'}
            {currentStep === 4 && 'Tentukan karakteristik pembelajaran yang diinginkan'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <Step1Identitas formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <Step2Identifikasi formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <Step3Desain formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && (
            <Step4Prinsip formData={formData} updateFormData={updateFormData} />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between items-center">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Kembali
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          {currentStep === 4 && (
            <Button variant="outline" onClick={handleSaveDraft}>
              💾 Simpan sebagai Draft
            </Button>
          )}
          {currentStep < 4 ? (
            <Button onClick={handleNext} className="min-w-[200px]">
              Lanjutkan ke Langkah {currentStep + 1}
            </Button>
          ) : (
            <Button onClick={handleGenerate} className="min-w-[200px]" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Membuat RPM...
                </>
              ) : (
                <>✨ Generate RPM dengan AI</>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sedang Membuat RPM...</h3>
                  <p className="text-sm text-muted-foreground">{loadingMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreateRPM;
