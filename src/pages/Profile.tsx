import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Eye, EyeOff, Upload } from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    nip: '',
    subjects_taught: [] as string[],
    teaching_levels: [] as string[],
    years_experience: 0,
    bio: '',
    school_name: '',
    school_address: '',
    school_phone: '',
    school_website: '',
    dashboard_view_preference: 'grid' as 'grid' | 'list',
    auto_save_enabled: true,
    auto_save_interval: 3,
    date_format: 'DD Month YYYY',
    notifications_enabled: true,
    email_notifications_enabled: true,
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUserData(data);
      setFormData({
        full_name: data.full_name || '',
        nip: data.nip || '',
        subjects_taught: data.subjects_taught || [],
        teaching_levels: data.teaching_levels || [],
        years_experience: data.years_experience || 0,
        bio: data.bio || '',
        school_name: data.school_name || '',
        school_address: data.school_address || '',
        school_phone: data.school_phone || '',
        school_website: data.school_website || '',
        dashboard_view_preference: (data.dashboard_view_preference === 'list' ? 'list' : 'grid') as 'grid' | 'list',
        auto_save_enabled: data.auto_save_enabled ?? true,
        auto_save_interval: data.auto_save_interval || 3,
        date_format: data.date_format || 'DD Month YYYY',
        notifications_enabled: data.notifications_enabled ?? true,
        email_notifications_enabled: data.email_notifications_enabled ?? true,
      });
    } catch (error: any) {
      console.error('Error loading user data:', error);
      toast.error('Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (section: 'personal' | 'school' | 'preferences') => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;
      
      toast.success('Perubahan berhasil disimpan');
      loadUserData();
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error('Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Password baru tidak cocok');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password minimal 8 karakter');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      
      toast.success('Password berhasil diubah');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah password');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'HAPUS') {
      toast.error('Ketik "HAPUS" untuk konfirmasi');
      return;
    }

    try {
      // In a real app, you'd call an edge function to delete the account
      toast.info('Fitur hapus akun akan segera tersedia');
      setShowDeleteDialog(false);
    } catch (error: any) {
      toast.error('Gagal menghapus akun');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { strength: '', color: '', width: 0 };
    if (pass.length < 6) return { strength: 'Lemah', color: 'bg-destructive', width: 33 };
    if (pass.length < 10) return { strength: 'Sedang', color: 'bg-warning', width: 66 };
    return { strength: 'Kuat', color: 'bg-success', width: 100 };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleTeachingLevelToggle = (level: string) => {
    setFormData(prev => ({
      ...prev,
      teaching_levels: prev.teaching_levels.includes(level)
        ? prev.teaching_levels.filter(l => l !== level)
        : [...prev.teaching_levels, level]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="text-xl font-bold text-primary">
              Nyinauidn
            </Link>
            <nav className="hidden md:flex gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
              <Link to="/dashboard/create" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Buat RPM Baru
              </Link>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userData?.full_name ? getInitials(userData.full_name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{userData?.full_name || user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>Pengaturan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-destructive">
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link to="/dashboard" className="hover:text-primary">Dashboard</Link>
          <span className="mx-2">&gt;</span>
          <span>Profil</span>
        </div>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="relative group">
                <Avatar className="w-32 h-32">
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    {userData?.full_name ? getInitials(userData.full_name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{userData?.full_name}</h1>
                <p className="text-muted-foreground mb-2">{user?.email}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Bergabung sejak {new Date(userData?.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    userData?.auth_provider === 'google' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {userData?.auth_provider === 'google' ? '🔗 Google' : '📧 Email'}
                  </span>
                </div>
              </div>

              <Button variant="outline" onClick={() => document.getElementById('tab-personal')?.scrollIntoView({ behavior: 'smooth' })}>
                Edit Profil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: '24 RPM Total', icon: '📝' },
            { label: '12 Minggu Ini', icon: '📅' },
            { label: '3,456 Kata Total', icon: '📄' },
            { label: 'SD: 12, SMP: 10', icon: '🎓' },
            { label: 'IPAS: 8, Math: 6', icon: '📚' },
            { label: '7 menit/RPM', icon: '⏱️' },
          ].map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <p className="text-sm font-medium">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="personal">Informasi Pribadi</TabsTrigger>
            <TabsTrigger value="school">Informasi Sekolah</TabsTrigger>
            <TabsTrigger value="preferences">Preferensi</TabsTrigger>
            <TabsTrigger value="security">Keamanan</TabsTrigger>
          </TabsList>

          {/* Tab 1: Personal Info */}
          <TabsContent value="personal" id="tab-personal">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
                <CardDescription>Perbarui informasi profil Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nama Lengkap *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Nama lengkap Anda"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email tidak dapat diubah untuk keamanan</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nip">NIP - Nomor Induk Pegawai</Label>
                    <Input
                      id="nip"
                      value={formData.nip}
                      onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                      placeholder="197001012005011001"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years_experience">Pengalaman Mengajar (tahun)</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.years_experience}
                      onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Jenjang yang Diajar</Label>
                  <div className="flex gap-4">
                    {['SD', 'SMP', 'SMA', 'SMK'].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={level}
                          checked={formData.teaching_levels.includes(level)}
                          onCheckedChange={() => handleTeachingLevelToggle(level)}
                        />
                        <label htmlFor={level} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / Tentang Saya</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Ceritakan sedikit tentang diri Anda sebagai guru..."
                    maxLength={500}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.bio.length}/500
                  </p>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={loadUserData}>Batal</Button>
                  <Button onClick={() => handleSave('personal')} disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: School Info */}
          <TabsContent value="school">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Sekolah</CardTitle>
                <CardDescription>Informasi tempat Anda mengajar</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="school_name">Nama Sekolah *</Label>
                  <Input
                    id="school_name"
                    value={formData.school_name}
                    onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                    placeholder="SMA Negeri 1 Jakarta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school_address">Alamat Sekolah</Label>
                  <Textarea
                    id="school_address"
                    value={formData.school_address}
                    onChange={(e) => setFormData({ ...formData, school_address: e.target.value })}
                    placeholder="Jalan, Kelurahan, Kecamatan, Kota/Kabupaten, Provinsi"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="school_phone">Nomor Telepon Sekolah</Label>
                    <Input
                      id="school_phone"
                      value={formData.school_phone}
                      onChange={(e) => setFormData({ ...formData, school_phone: e.target.value })}
                      placeholder="021-7654321"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school_website">Website Sekolah</Label>
                    <Input
                      id="school_website"
                      type="url"
                      value={formData.school_website}
                      onChange={(e) => setFormData({ ...formData, school_website: e.target.value })}
                      placeholder="https://sekolah.sch.id"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={loadUserData}>Batal</Button>
                  <Button onClick={() => handleSave('school')} disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Preferences */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferensi</CardTitle>
                <CardDescription>Atur preferensi aplikasi Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Display Preferences */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Bahasa & Tampilan</h3>
                  
                  <div className="space-y-2">
                    <Label>Bahasa Interface</Label>
                    <Input value="Bahasa Indonesia" disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">(Hanya Bahasa Indonesia untuk saat ini)</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Tampilan Default Dashboard</Label>
                    <RadioGroup 
                      value={formData.dashboard_view_preference} 
                      onValueChange={(value) => setFormData({ ...formData, dashboard_view_preference: value as 'grid' | 'list' })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="grid" id="grid" />
                        <Label htmlFor="grid">Grid View</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="list" id="list" />
                        <Label htmlFor="list">List View</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Notifikasi</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Aktifkan notifikasi sistem</Label>
                      <p className="text-sm text-muted-foreground">Dapatkan update tentang RPM Anda</p>
                    </div>
                    <Switch
                      checked={formData.notifications_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, notifications_enabled: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifikasi email</Label>
                      <p className="text-sm text-muted-foreground">Terima email tentang fitur baru</p>
                    </div>
                    <Switch
                      checked={formData.email_notifications_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, email_notifications_enabled: checked })}
                    />
                  </div>
                </div>

                {/* Editor Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Editor</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Save RPM</Label>
                      <p className="text-sm text-muted-foreground">Simpan perubahan secara otomatis</p>
                    </div>
                    <Switch
                      checked={formData.auto_save_enabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, auto_save_enabled: checked })}
                    />
                  </div>

                  {formData.auto_save_enabled && (
                    <div className="space-y-2">
                      <Label htmlFor="auto_save_interval">Simpan otomatis setiap (detik)</Label>
                      <Input
                        id="auto_save_interval"
                        type="number"
                        min="1"
                        max="60"
                        value={formData.auto_save_interval}
                        onChange={(e) => setFormData({ ...formData, auto_save_interval: parseInt(e.target.value) || 3 })}
                      />
                    </div>
                  )}
                </div>

                {/* Format Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Format</h3>
                  
                  <div className="space-y-2">
                    <Label>Format Tanggal</Label>
                    <RadioGroup 
                      value={formData.date_format} 
                      onValueChange={(value) => setFormData({ ...formData, date_format: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DD/MM/YYYY" id="date1" />
                        <Label htmlFor="date1">DD/MM/YYYY (Contoh: 25/10/2025)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="DD Month YYYY" id="date2" />
                        <Label htmlFor="date2">DD Month YYYY (Contoh: 25 Oktober 2025)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={loadUserData}>Batal</Button>
                  <Button onClick={() => handleSave('preferences')} disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Security */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Login Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Metode Login</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      userData?.auth_provider === 'google' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      {userData?.auth_provider === 'google' ? '🔗' : '📧'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Masuk dengan {userData?.auth_provider === 'google' ? 'Google' : 'Email'}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <span className="text-success">✓ Terhubung</span>
                  </div>
                </CardContent>
              </Card>

              {/* Change Password (only for email users) */}
              {userData?.auth_provider === 'email' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ubah Password</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="old_password">Password Lama</Label>
                      <div className="relative">
                        <Input
                          id="old_password"
                          type={showOldPassword ? 'text' : 'password'}
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new_password">Password Baru</Label>
                      <div className="relative">
                        <Input
                          id="new_password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {newPassword && (
                        <div className="space-y-1">
                          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${passwordStrength.color} transition-all`}
                              style={{ width: `${passwordStrength.width}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Kekuatan: {passwordStrength.strength || 'Masukkan password'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Konfirmasi Password Baru</Label>
                      <div className="relative">
                        <Input
                          id="confirm_password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button onClick={handlePasswordChange}>
                      Ubah Password
                    </Button>
                  </CardContent>
                </Card>
              )}

              {userData?.auth_provider === 'google' && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">
                      Anda masuk dengan Google. Password dikelola oleh Google.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Danger Zone */}
              <Card className="border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Zona Berbahaya</CardTitle>
                  <CardDescription>
                    Tindakan ini tidak dapat dibatalkan. Semua data RPM Anda akan dihapus secara permanen.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                    Hapus Akun
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Akun Permanen?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Tindakan ini akan menghapus semua data RPM, profil, dan akun Anda secara permanen.
              </p>
              <div className="space-y-2">
                <Label htmlFor="delete_confirm">Ketik "HAPUS" untuk konfirmasi</Label>
                <Input
                  id="delete_confirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="HAPUS"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'HAPUS'}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Ya, Hapus Akun Saya
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
