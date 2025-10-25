import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RPMFormData } from '@/pages/CreateRPM';

interface Step2IdentifikasiProps {
  formData: RPMFormData;
  updateFormData: (updates: Partial<RPMFormData>) => void;
}

const Step2Identifikasi = ({ formData, updateFormData }: Step2IdentifikasiProps) => {
  const p5Options = [
    'Beriman, Bertakwa kepada Tuhan YME, dan Berakhlak Mulia',
    'Berkebinekaan Global',
    'Bergotong Royong',
    'Mandiri',
    'Bernalar Kritis',
    'Kreatif',
  ];

  const toggleP5 = (option: string) => {
    const current = formData.profil_pelajar_pancasila || [];
    const updated = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    updateFormData({ profil_pelajar_pancasila: updated });
  };

  return (
    <div className="space-y-6">
      {/* Kesiapan Belajar Siswa */}
      <div className="space-y-2">
        <Label htmlFor="student_readiness">
          Kesiapan Belajar Siswa <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="student_readiness"
          placeholder="Jelaskan tingkat pemahaman awal siswa, gaya belajar dominan (visual/auditori/kinestetik), dan minat mereka terhadap topik ini"
          rows={4}
          value={formData.student_readiness}
          onChange={(e) => updateFormData({ student_readiness: e.target.value })}
        />
      </div>

      {/* Konteks Sosial & Emosional */}
      <div className="space-y-2">
        <Label htmlFor="student_social_emotional_context">
          Konteks Sosial & Emosional (Opsional)
        </Label>
        <Textarea
          id="student_social_emotional_context"
          placeholder="Kondisi lingkungan belajar, latar belakang sosial ekonomi, tantangan emosional yang mungkin dihadapi (opsional)"
          rows={3}
          value={formData.student_social_emotional_context}
          onChange={(e) => updateFormData({ student_social_emotional_context: e.target.value })}
        />
      </div>

      {/* Dimensi Profil Pelajar Pancasila */}
      <div className="space-y-3">
        <Label>
          Dimensi Profil Pelajar Pancasila <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Pilih minimal 1 dimensi yang akan dikembangkan
        </p>
        <div className="space-y-3">
          {p5Options.map((option) => (
            <div key={option} className="flex items-start space-x-3">
              <Checkbox
                id={`p5-${option}`}
                checked={formData.profil_pelajar_pancasila?.includes(option)}
                onCheckedChange={() => toggleP5(option)}
              />
              <Label
                htmlFor={`p5-${option}`}
                className="font-normal leading-snug cursor-pointer"
              >
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Karakteristik Materi Pelajaran */}
      <div className="space-y-2">
        <Label htmlFor="materi_characteristics">
          Karakteristik Materi Pelajaran <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="materi_characteristics"
          placeholder="Jelaskan apakah materi ini konseptual, prosedural, faktual, atau metakognitif? Tingkat kompleksitasnya?"
          rows={3}
          value={formData.materi_characteristics}
          onChange={(e) => updateFormData({ materi_characteristics: e.target.value })}
        />
      </div>
    </div>
  );
};

export default Step2Identifikasi;
