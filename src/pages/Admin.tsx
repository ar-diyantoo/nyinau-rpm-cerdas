import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdmin, AppRole } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Shield, Users, ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

interface RoleData {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading, getAllUsers, getUserRoles, assignRole, removeRole } = useAdmin();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserData[]>([]);
  const [userRoles, setUserRoles] = useState<RoleData[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('user');
  const [loadingData, setLoadingData] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!adminLoading && user && !isAdmin) {
      toast.error('Akses ditolak: Anda bukan admin');
      navigate('/dashboard');
    }
  }, [isAdmin, adminLoading, user, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [usersResult, rolesResult] = await Promise.all([
        getAllUsers(),
        getUserRoles()
      ]);

      if (usersResult.data) setUsers(usersResult.data);
      if (rolesResult.data) setUserRoles(rolesResult.data);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Gagal memuat data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRole) {
      toast.error('Pilih user dan role terlebih dahulu');
      return;
    }

    setActionLoading(true);
    const { error } = await assignRole(selectedUser, selectedRole);
    setActionLoading(false);

    if (error) {
      if (error.message?.includes('duplicate')) {
        toast.error('User sudah memiliki role ini');
      } else {
        toast.error('Gagal menambahkan role');
      }
    } else {
      toast.success('Role berhasil ditambahkan');
      setSelectedUser('');
      loadData();
    }
  };

  const handleRemoveRole = async (userId: string, role: AppRole) => {
    setActionLoading(true);
    const { error } = await removeRole(userId, role);
    setActionLoading(false);

    if (error) {
      toast.error('Gagal menghapus role');
    } else {
      toast.success('Role berhasil dihapus');
      loadData();
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.full_name || user?.email || 'Unknown';
  };

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.email || '';
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'secondary';
      default: return 'outline';
    }
  };

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground text-sm">Kelola user dan roles</p>
            </div>
          </div>
        </div>

        {/* Assign Role Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Tambah Role
            </CardTitle>
            <CardDescription>Berikan role baru kepada user</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Pilih user..." />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Pilih role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={handleAssignRole} disabled={actionLoading || !selectedUser}>
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tambah'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users with Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Daftar Role User
            </CardTitle>
            <CardDescription>User yang memiliki role khusus</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : userRoles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Belum ada user dengan role khusus</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles.map((roleData) => (
                      <TableRow key={roleData.id}>
                        <TableCell className="font-medium">
                          {getUserName(roleData.user_id)}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {getUserEmail(roleData.user_id)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(roleData.role)}>
                            {roleData.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveRole(roleData.user_id, roleData.role)}
                            disabled={actionLoading}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Users */}
        <Card>
          <CardHeader>
            <CardTitle>Semua User</CardTitle>
            <CardDescription>Daftar semua user terdaftar</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingData ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Terdaftar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((userData) => {
                      const roles = userRoles.filter(r => r.user_id === userData.id);
                      return (
                        <TableRow key={userData.id}>
                          <TableCell className="font-medium">{userData.full_name}</TableCell>
                          <TableCell className="text-muted-foreground">{userData.email}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {roles.length > 0 ? (
                                roles.map(r => (
                                  <Badge key={r.id} variant={getRoleBadgeVariant(r.role)}>
                                    {r.role}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(userData.created_at).toLocaleDateString('id-ID')}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
