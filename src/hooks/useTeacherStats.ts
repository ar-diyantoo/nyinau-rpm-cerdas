import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAdmin } from './useAdmin';

interface TeacherStats {
  user_id: string;
  full_name: string;
  email: string;
  total_rpm: number;
  completed_rpm: number;
  draft_rpm: number;
  completion_rate: number;
  last_activity: string | null;
}

interface ActivityItem {
  id: string;
  title: string;
  user_name: string;
  user_email: string;
  action: 'created' | 'updated';
  timestamp: string;
  is_draft: boolean;
}

interface OverallStats {
  totalTeachers: number;
  totalRpm: number;
  completedRpm: number;
  draftRpm: number;
  averageCompletion: number;
  activeTeachers: number;
}

export const useTeacherStats = () => {
  const { isAdmin, hasRole } = useAdmin();
  const [teacherStats, setTeacherStats] = useState<TeacherStats[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [overallStats, setOverallStats] = useState<OverallStats>({
    totalTeachers: 0,
    totalRpm: 0,
    completedRpm: 0,
    draftRpm: 0,
    averageCompletion: 0,
    activeTeachers: 0,
  });
  const [loading, setLoading] = useState(true);

  const canAccessStats = isAdmin || hasRole('moderator');

  useEffect(() => {
    if (!canAccessStats) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch all users
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, email');

        if (usersError) throw usersError;

        // Fetch all lesson plans
        const { data: lessonPlans, error: plansError } = await supabase
          .from('lesson_plans')
          .select('id, user_id, title, is_draft, created_at, updated_at')
          .order('updated_at', { ascending: false });

        if (plansError) throw plansError;

        // Calculate per-teacher statistics
        const statsMap = new Map<string, TeacherStats>();
        
        users?.forEach((user) => {
          statsMap.set(user.id, {
            user_id: user.id,
            full_name: user.full_name,
            email: user.email,
            total_rpm: 0,
            completed_rpm: 0,
            draft_rpm: 0,
            completion_rate: 0,
            last_activity: null,
          });
        });

        lessonPlans?.forEach((plan) => {
          const stats = statsMap.get(plan.user_id);
          if (stats) {
            stats.total_rpm++;
            if (plan.is_draft) {
              stats.draft_rpm++;
            } else {
              stats.completed_rpm++;
            }
            if (!stats.last_activity || new Date(plan.updated_at) > new Date(stats.last_activity)) {
              stats.last_activity = plan.updated_at;
            }
          }
        });

        // Calculate completion rates
        const teacherStatsArray = Array.from(statsMap.values()).map((stats) => ({
          ...stats,
          completion_rate: stats.total_rpm > 0 
            ? Math.round((stats.completed_rpm / stats.total_rpm) * 100) 
            : 0,
        }));

        // Sort by total RPM descending
        teacherStatsArray.sort((a, b) => b.total_rpm - a.total_rpm);
        setTeacherStats(teacherStatsArray);

        // Calculate overall stats
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const totalRpm = lessonPlans?.length || 0;
        const completedRpm = lessonPlans?.filter(p => !p.is_draft).length || 0;
        const draftRpm = lessonPlans?.filter(p => p.is_draft).length || 0;
        const activeTeachers = teacherStatsArray.filter(t => 
          t.last_activity && new Date(t.last_activity) > sevenDaysAgo
        ).length;

        setOverallStats({
          totalTeachers: users?.length || 0,
          totalRpm,
          completedRpm,
          draftRpm,
          averageCompletion: totalRpm > 0 ? Math.round((completedRpm / totalRpm) * 100) : 0,
          activeTeachers,
        });

        // Create recent activities
        const activities: ActivityItem[] = (lessonPlans?.slice(0, 20) || []).map((plan) => {
          const user = users?.find(u => u.id === plan.user_id);
          const isNewlyCreated = plan.created_at === plan.updated_at;
          return {
            id: plan.id,
            title: plan.title,
            user_name: user?.full_name || 'Unknown',
            user_email: user?.email || '',
            action: isNewlyCreated ? 'created' : 'updated',
            timestamp: plan.updated_at,
            is_draft: plan.is_draft || false,
          };
        });

        setRecentActivities(activities);
      } catch (err) {
        console.error('Error fetching teacher stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [canAccessStats]);

  return {
    teacherStats,
    recentActivities,
    overallStats,
    loading,
    canAccessStats,
  };
};
