import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { RPMFormData } from '@/pages/CreateRPM';
import { ExternalLink } from 'lucide-react';

interface Step3DesainProps {
  formData: RPMFormData;
  updateFormData: (updates: Partial<RPMFormData>) => void;
}

const Step3Desain = ({ formData, updateFormData }: Step3DesainProps) => {
  const approachOptions = [
    { value: 'Reflektif', label: 'Reflektif', desc: 'Pembelajaran berkesadaran' },
    { value: 'Kontekstual', label: 'Kontekstual', desc: 'Bermakna & relevan dengan kehidupan' },
    { value: 'Kolaboratif', label: 'Kolaboratif', desc: 'Kerja sama & kemitraan' },
    { value: 'Eksploratif', label: 'Eksploratif', desc: 'Penemuan & inkuiri' },
  ];

  const toggleApproach = (option: string) => {
    const current = formData.learning_approach || [];
    const updated = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    updateFormData({ learning_approach: updated });
  };

  const updateFramework = (key: string, value: string) => {
    updateFormData({
      learning_framework: {
        ...formData.learning_framework,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Capaian Pembelajaran */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="capaian_pembelajaran">
            Capaian Pembelajaran (CP) <span className="text-destructive">*</span>
          </Label>
          <a
            href="https://kurikulum.kemdikbud.go.id/kurikulum-merdeka/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            📖 Referensi CP Kurikulum Merdeka
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <Textarea
          id="capaian_pembelajaran"
          placeholder="Tuliskan Capaian Pembelajaran sesuai dengan Kurikulum Merdeka untuk fase/kelas yang dipilih"
          rows={4}
          value={formData.capaian_pembelajaran}
          onChange={(e) => updateFormData({ capaian_pembelajaran: e.target.value })}
        />
      </div>

      {/* Tujuan Pembelajaran */}
      <div className="space-y-2">
        <Label htmlFor="learning_objectives">
          Tujuan Pembelajaran <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="learning_objectives"
          placeholder="Tujuan spesifik yang mengintegrasikan pemahaman konseptual, keterampilan prosedural, dan penerapan kontekstual"
          rows={5}
          value={formData.learning_objectives}
          onChange={(e) => updateFormData({ learning_objectives: e.target.value })}
        />
      </div>

      {/* Pendekatan Pembelajaran */}
      <div className="space-y-3">
        <Label>
          Pendekatan Pembelajaran <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Pilih minimal 1 pendekatan (bisa lebih dari satu)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {approachOptions.map((option) => (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all ${
                formData.learning_approach?.includes(option.value)
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => toggleApproach(option.value)}
            >
              <CardContent className="p-4 flex items-start space-x-3">
                <Checkbox
                  id={`approach-${option.value}`}
                  checked={formData.learning_approach?.includes(option.value)}
                  onCheckedChange={() => toggleApproach(option.value)}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`approach-${option.value}`}
                    className="font-semibold cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{option.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Integrasi Lintas Disiplin */}
      <div className="space-y-3">
        <Label>Integrasi Lintas Disiplin</Label>
        <RadioGroup
          value={formData.cross_disciplinary_integration ? 'yes' : 'no'}
          onValueChange={(value) => {
            if (value === 'no') {
              updateFormData({ cross_disciplinary_integration: '' });
            }
          }}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="integration-no" />
            <Label htmlFor="integration-no" className="font-normal cursor-pointer">
              Tidak ada integrasi (single subject)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="integration-yes" />
            <Label htmlFor="integration-yes" className="font-normal cursor-pointer">
              Ada integrasi lintas disiplin
            </Label>
          </div>
        </RadioGroup>

        {formData.cross_disciplinary_integration !== '' && (
          <div className="mt-3 space-y-2 pl-6">
            <Label htmlFor="cross_disciplinary_subjects">
              Mata pelajaran yang diintegrasikan
            </Label>
            <Input
              id="cross_disciplinary_subjects"
              placeholder="Contoh: IPS, Bahasa Indonesia"
              value={formData.cross_disciplinary_integration}
              onChange={(e) =>
                updateFormData({ cross_disciplinary_integration: e.target.value })
              }
            />
          </div>
        )}
      </div>

      {/* Kerangka Pembelajaran (4 Tabs) */}
      <div className="space-y-3">
        <Label>
          Kerangka Pembelajaran <span className="text-destructive">*</span>
        </Label>
        <Tabs defaultValue="pedagogis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="pedagogis">Praktik Pedagogis</TabsTrigger>
            <TabsTrigger value="kemitraan">Kemitraan</TabsTrigger>
            <TabsTrigger value="lingkungan">Lingkungan</TabsTrigger>
            <TabsTrigger value="digital">Digital</TabsTrigger>
          </TabsList>

          <TabsContent value="pedagogis" className="space-y-2 mt-4">
            <Label htmlFor="framework-pedagogis">
              Praktik Pedagogis <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="framework-pedagogis"
              placeholder="Metode dan strategi yang akan digunakan (Discovery Learning, PBL, dll)"
              rows={3}
              value={formData.learning_framework.pedagogis}
              onChange={(e) => updateFramework('pedagogis', e.target.value)}
            />
          </TabsContent>

          <TabsContent value="kemitraan" className="space-y-2 mt-4">
            <Label htmlFor="framework-kemitraan">Kemitraan (Opsional)</Label>
            <Textarea
              id="framework-kemitraan"
              placeholder="Dengan siapa? (guru lain, orangtua, komunitas, narasumber)"
              rows={2}
              value={formData.learning_framework.kemitraan}
              onChange={(e) => updateFramework('kemitraan', e.target.value)}
            />
          </TabsContent>

          <TabsContent value="lingkungan" className="space-y-2 mt-4">
            <Label htmlFor="framework-lingkungan">
              Lingkungan Belajar <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="framework-lingkungan"
              placeholder="Dimana pembelajaran berlangsung? (kelas, lab, outdoor, virtual)"
              rows={2}
              value={formData.learning_framework.lingkungan}
              onChange={(e) => updateFramework('lingkungan', e.target.value)}
            />
          </TabsContent>

          <TabsContent value="digital" className="space-y-2 mt-4">
            <Label htmlFor="framework-digital">Teknologi Digital (Opsional)</Label>
            <Textarea
              id="framework-digital"
              placeholder="Tools/platform digital yang akan digunakan (Google Classroom, Canva, dll)"
              rows={2}
              value={formData.learning_framework.digital}
              onChange={(e) => updateFramework('digital', e.target.value)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Step3Desain;
