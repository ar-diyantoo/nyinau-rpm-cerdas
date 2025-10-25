import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { RPMFormData } from '@/pages/CreateRPM';
import { useState } from 'react';

interface Step4PrinsipProps {
  formData: RPMFormData;
  updateFormData: (updates: Partial<RPMFormData>) => void;
}

const Step4Prinsip = ({ formData, updateFormData }: Step4PrinsipProps) => {
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  const sliderLabels = {
    mindfulness: ['Minimal', 'Moderat', 'Sangat Mendalam'],
    meaningfulness: ['Abstrak', 'Cukup Relevan', 'Sangat Kontekstual'],
    joyfulness: ['Formal', 'Cukup Menarik', 'Sangat Menyenangkan'],
  };

  return (
    <div className="space-y-8">
      {/* Slider 1: Berkesadaran */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <Label className="text-base font-semibold">Tingkat Berkesadaran</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Seberapa mendalam siswa merefleksi proses belajarnya?
            </p>
          </div>
          <span className="text-2xl font-bold text-primary">
            {formData.mindfulness_level}
          </span>
        </div>
        <Slider
          value={[formData.mindfulness_level]}
          onValueChange={(value) => updateFormData({ mindfulness_level: value[0] })}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>1 - {sliderLabels.mindfulness[0]}</span>
          <span>3 - {sliderLabels.mindfulness[1]}</span>
          <span>5 - {sliderLabels.mindfulness[2]}</span>
        </div>
      </div>

      {/* Slider 2: Bermakna */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <Label className="text-base font-semibold">Tingkat Kebermaknaannya</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Seberapa relevan dengan kehidupan nyata siswa?
            </p>
          </div>
          <span className="text-2xl font-bold text-primary">
            {formData.meaningfulness_level}
          </span>
        </div>
        <Slider
          value={[formData.meaningfulness_level]}
          onValueChange={(value) => updateFormData({ meaningfulness_level: value[0] })}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>1 - {sliderLabels.meaningfulness[0]}</span>
          <span>3 - {sliderLabels.meaningfulness[1]}</span>
          <span>5 - {sliderLabels.meaningfulness[2]}</span>
        </div>
      </div>

      {/* Slider 3: Menggembirakan */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <Label className="text-base font-semibold">Tingkat Kegembiraan</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Seberapa engaging dan menyenangkan pembelajarannya?
            </p>
          </div>
          <span className="text-2xl font-bold text-primary">
            {formData.joyfulness_level}
          </span>
        </div>
        <Slider
          value={[formData.joyfulness_level]}
          onValueChange={(value) => updateFormData({ joyfulness_level: value[0] })}
          min={1}
          max={5}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>1 - {sliderLabels.joyfulness[0]}</span>
          <span>3 - {sliderLabels.joyfulness[1]}</span>
          <span>5 - {sliderLabels.joyfulness[2]}</span>
        </div>
      </div>

      {/* Deskripsi Prinsip */}
      <div className="space-y-2">
        <Label htmlFor="learning_principles_description">
          Deskripsi Prinsip Pembelajaran (Opsional)
        </Label>
        <Textarea
          id="learning_principles_description"
          placeholder="Jelaskan bagaimana pembelajaran ini akan berkesadaran, bermakna, dan menggembirakan"
          rows={3}
          value={formData.learning_principles_description}
          onChange={(e) =>
            updateFormData({ learning_principles_description: e.target.value })
          }
        />
      </div>

      {/* Collapsible: Catatan Tambahan */}
      <Collapsible open={isCollapsibleOpen} onOpenChange={setIsCollapsibleOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
          <span className="font-semibold">📝 Catatan Tambahan (Opsional)</span>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              isCollapsibleOpen ? 'rotate-180' : ''
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4 space-y-6">
          {/* Pertimbangan Khusus */}
          <div className="space-y-2">
            <Label htmlFor="special_considerations">Pertimbangan Khusus</Label>
            <Textarea
              id="special_considerations"
              placeholder="Ada siswa berkebutuhan khusus? Kondisi kelas yang perlu diperhatikan? Sumber daya terbatas?"
              rows={2}
              value={formData.special_considerations}
              onChange={(e) => updateFormData({ special_considerations: e.target.value })}
            />
          </div>

          {/* Harapan Guru */}
          <div className="space-y-2">
            <Label htmlFor="teacher_expectations">Harapan Guru</Label>
            <Textarea
              id="teacher_expectations"
              placeholder="Apa yang Anda harapkan dari RPM yang dihasilkan AI? Aspek apa yang ingin ditekankan?"
              rows={2}
              value={formData.teacher_expectations}
              onChange={(e) => updateFormData({ teacher_expectations: e.target.value })}
            />
          </div>

          {/* Note: File upload akan ditambahkan nanti jika diperlukan */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tips:</strong> Informasi tambahan ini akan membantu AI menghasilkan RPM yang lebih sesuai dengan kebutuhan Anda
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Step4Prinsip;
