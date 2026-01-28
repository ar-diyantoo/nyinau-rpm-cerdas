import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have access token in URL (from email link)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (!accessToken || type !== 'recovery') {
      // No valid recovery token, redirect to forgot password
      toast.error('Link reset password tidak valid atau sudah kadaluarsa');
      navigate('/forgot-password');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error('Password minimal 8 karakter');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('same password')) {
          toast.error('Password baru tidak boleh sama dengan password lama');
        } else {
          toast.error(error.message || 'Gagal mengubah password');
        }
      } else {
        setResetSuccess(true);
        toast.success('Password berhasil diubah!');
      }
    } catch (error: any) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="space-y-1 pb-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Password Berhasil Diubah!</CardTitle>
              <CardDescription>
                Anda sekarang dapat masuk dengan password baru Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full h-11"
                onClick={() => navigate('/login')}
              >
                Masuk Sekarang
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
          <p className="text-muted-foreground">Masukkan password baru Anda</p>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Password Baru</CardTitle>
            <CardDescription className="text-center">
              Buat password yang kuat minimal 8 karakter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan password baru"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Masukkan ulang password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
              </Button>
            </form>

            <div className="text-center pt-6 border-t mt-6">
              <Link 
                to="/login" 
                className="text-sm text-primary hover:underline"
              >
                Kembali ke Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
