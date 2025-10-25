import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { RPMFormData } from '@/pages/CreateRPM';

interface Step1IdentitasProps {
  formData: RPMFormData;
  updateFormData: (updates: Partial<RPMFormData>) => void;
}

const Step1Identitas = ({ formData, updateFormData }: Step1IdentitasProps) => {
  const faseOptions = {
    SD: ['Fase A (Kelas 1-2)', 'Fase B (Kelas 3-4)', 'Fase C (Kelas 5-6)'],
    SMP: ['Fase D (Kelas 7-9)'],
    SMA: ['Fase E (Kelas 10)', 'Fase F (Kelas 11-12)'],
    SMK: ['Fase E (Kelas 10)', 'Fase F (Kelas 11-12)'],
  };

  return (
    <div className="space-y-6">
      {/* Satuan Pendidikan */}
      <div className="space-y-2">
        <Label htmlFor="satuan_pendidikan">
          Satuan Pendidikan <span className="text-destructive">*</span>
        </Label>
        <Input
          id="satuan_pendidikan"
          placeholder="Contoh: SD Negeri 1 Jakarta"
          value={formData.satuan_pendidikan}
          onChange={(e) => updateFormData({ satuan_pendidikan: e.target.value })}
        />
      </div>

      {/* Jenjang */}
      <div className="space-y-2">
        <Label htmlFor="jenjang">
          Jenjang <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.jenjang}
          onValueChange={(value: any) => {
            updateFormData({ jenjang: value, fase: '' }); // Reset fase when jenjang changes
          }}
        >
          <SelectTrigger id="jenjang">
            <SelectValue placeholder="Pilih jenjang" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SD">SD</SelectItem>
            <SelectItem value="SMP">SMP</SelectItem>
            <SelectItem value="SMA">SMA</SelectItem>
            <SelectItem value="SMK">SMK</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fase/Kelas (Dynamic) */}
      <div className="space-y-2">
        <Label htmlFor="fase">
          Fase/Kelas <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.fase}
          onValueChange={(value) => updateFormData({ fase: value })}
          disabled={!formData.jenjang}
        >
          <SelectTrigger id="fase">
            <SelectValue placeholder={formData.jenjang ? "Pilih fase/kelas" : "Pilih jenjang dulu"} />
          </SelectTrigger>
          <SelectContent>
            {formData.jenjang && faseOptions[formData.jenjang as keyof typeof faseOptions]?.map((fase) => (
              <SelectItem key={fase} value={fase}>
                {fase}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Semester */}
      <div className="space-y-3">
        <Label>
          Semester <span className="text-destructive">*</span>
        </Label>
        <RadioGroup
          value={formData.semester}
          onValueChange={(value: any) => updateFormData({ semester: value })}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Ganjil" id="semester-ganjil" />
            <Label htmlFor="semester-ganjil" className="font-normal cursor-pointer">
              Ganjil
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Genap" id="semester-genap" />
            <Label htmlFor="semester-genap" className="font-normal cursor-pointer">
              Genap
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Mata Pelajaran */}
      <div className="space-y-2">
        <Label htmlFor="subject">
          Mata Pelajaran <span className="text-destructive">*</span>
        </Label>
        <Input
          id="subject"
          placeholder="Contoh: Matematika, IPAS, Bahasa Indonesia"
          value={formData.subject}
          onChange={(e) => updateFormData({ subject: e.target.value })}
        />
      </div>

      {/* Topik Pembelajaran */}
      <div className="space-y-2">
        <Label htmlFor="topic">
          Topik Pembelajaran <span className="text-destructive">*</span>
        </Label>
        <Input
          id="topic"
          placeholder="Contoh: Ekosistem dan Rantai Makanan"
          value={formData.topic}
          onChange={(e) => updateFormData({ topic: e.target.value })}
        />
      </div>

      {/* Alokasi Waktu */}
      <div className="space-y-2">
        <Label htmlFor="duration_jp">
          Alokasi Waktu (JP) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="duration_jp"
          type="number"
          min="1"
          max="10"
          placeholder="2"
          value={formData.duration_jp}
          onChange={(e) => updateFormData({ duration_jp: parseInt(e.target.value) || 0 })}
        />
        <p className="text-xs text-muted-foreground">
          ℹ️ 1 JP = 35 menit (SD), 40 menit (SMP/SMA/SMK)
        </p>
      </div>
    </div>
  );
};

export default Step1Identitas;
