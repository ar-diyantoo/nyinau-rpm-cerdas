import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);
    if (!emailValid) {
      toast.error('Format email tidak valid');
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          toast.error('Terlalu banyak permintaan. Silakan tunggu beberapa menit.');
        } else {
          toast.error(error.message || 'Gagal mengirim email reset password');
        }
      } else {
        setEmailSent(true);
        toast.success('Email reset password telah dikirim!');
      }
    } catch (error: any) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="space-y-1 pb-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Email Terkirim!</CardTitle>
              <CardDescription>
                Kami telah mengirim link reset password ke <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Periksa inbox email Anda (termasuk folder spam) dan klik link untuk mereset password.
              </p>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                Kirim Ulang Email
              </Button>

              <div className="text-center pt-4 border-t">
                <Link 
                  to="/login" 
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Login
                </Link>
              </div>
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
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Lupa Password?</h1>
          <p className="text-muted-foreground">Masukkan email Anda untuk reset password</p>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Kami akan mengirim link reset password ke email Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim Link Reset'}
              </Button>
            </form>

            <div className="text-center pt-6 border-t mt-6">
              <Link 
                to="/login" 
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
