import EmployeeTab from '@/components/dashboard/EmployeeTab';
import LeaveTab from '@/components/dashboard/LeaveTab';
import NotificationsTab from '@/components/dashboard/NotificationsTab';
import OverviewTab from '@/components/dashboard/OverviewTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import { NotificationType } from '@/components/dashboard/types';
import TeamForum from '@/components/forum/TeamForum';
import DashboardLayout, { NavItem } from '@/components/layout/DashboardLayout';
import { useLogout } from '@/hook/AuthHook/AuthHook';
import {
  useApproveLeave,
  useCreateLeave,
  useLeaves,
  useRejectLeave,
} from '@/hook/LeaveHook/LeaveHook';
import { useUser } from '@/hook/UserHook/UserHook';
import { SummaryApi } from '@/services/SummaryApi/SummaryApi';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectIsSignedIn } from '@/store/slices/AuthSlice';
import { DirectorSummaryResponse, HRSummaryResponse, MemberSummaryResponse } from '@shared/api';
import { Bell, Briefcase, Calendar, MessageSquare, User as UserIcon, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Types moved to @/components/dashboard/types.ts

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSignedIn = useAppSelector(selectIsSignedIn);

  const [currentTab, setCurrentTab] = useState<
    'overview' | 'leave' | 'notifications' | 'profile' | 'forum' | 'employees'
  >('overview');

  const { data: leaves = [], refetch: fetchLeaves } = useLeaves();
  const createLeaveMutation = useCreateLeave();
  const approveLeaveMutation = useApproveLeave();
  const rejectLeaveMutation = useRejectLeave();

  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: '1',
      title: 'Leave Approved',
      message: 'Your vacation leave from Feb 10-15 has been approved.',
      type: 'success',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      title: 'Company Event',
      message: 'Team building event on Feb 20 at 3 PM.',
      type: 'info',
      timestamp: '1 day ago',
    },
    {
      id: '3',
      title: 'Policy Update',
      message: 'New remote work policy effective from March 1.',
      type: 'warning',
      timestamp: '3 days ago',
    },
  ]);

  const [newLeave, setNewLeave] = useState({
    type: 'ANNUAL',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const leaveBalance = {
    vacation: 10,
    sick: 5,
    casual: 3,
  };

  const usedLeave = {
    vacation: 6,
    sick: 2,
    casual: 0,
  };

  const [directorSummary, setDirectorSummary] = useState<DirectorSummaryResponse | null>(null);
  const [hrSummary, setHrSummary] = useState<HRSummaryResponse | null>(null);
  const [memberSummary, setMemberSummary] = useState<MemberSummaryResponse | null>(null);
  const { user, isLoading: isUserLoading, isInitialized } = useUser();

  useEffect(() => {
    if (user) fetchLeaves();
  }, [user, fetchLeaves]);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user) return;
      try {
        if (user.role === 'ADMIN') {
          const res = await SummaryApi.getDirectorSummary();
          if (res.success) setDirectorSummary(res.data);
        } else if (user.role === 'HR' || user.role === 'TEAM_LEADER') {
          const res = await SummaryApi.getHRSummary();
          if (res.success) setHrSummary(res.data);
        } else if (user.role === 'TEAM_MEMBER' || !user.role) {
          const res = await SummaryApi.getMemberSummary();
          if (res.success) setMemberSummary(res.data);
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };
    fetchSummary();
  }, [user]);

  useEffect(() => {
    // Only redirect to login if we have confirmed the user is NOT signed in
    // and we have finished the initial session check (isInitialized)
    if (isInitialized && !isUserLoading && !isSignedIn) {
      navigate('/login');
    }
  }, [isSignedIn, isUserLoading, isInitialized, navigate]);

  const { logout } = useLogout();
  const handleLogout = async () => {
    await logout();
  };

  const handleBookLeave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLeave.startDate || !newLeave.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    createLeaveMutation.mutate(
      {
        leaveType: newLeave.type,
        startDate: new Date(newLeave.startDate).toISOString(),
        endDate: new Date(newLeave.endDate).toISOString(),
        reason: newLeave.reason,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setNewLeave({ type: 'ANNUAL', startDate: '', endDate: '', reason: '' });
            toast.success('Leave request submitted successfully!');
          }
        },
        onError: (error) => {
          console.error('Error submitting leave request:', error);
          toast.error('Failed to submit leave request');
        },
      },
    );
  };

  const handleApproveLeave = async (id: number) => {
    approveLeaveMutation.mutate(id, {
      onSuccess: (res) => {
        if (res.success) toast.success('Leave approved successfully!');
      },
      onError: (error) => {
        console.error('Error approving leave:', error);
        toast.error('Failed to approve leave');
      },
    });
  };

  const handleRejectLeave = async (id: number) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason === null) return;

    rejectLeaveMutation.mutate(
      { id, reason },
      {
        onSuccess: (res) => {
          if (res.success) toast.success('Leave rejected successfully!');
        },
        onError: (error) => {
          console.error('Error rejecting leave:', error);
          toast.error('Failed to reject leave');
        },
      },
    );
  };

  if (!user) {
    return null;
  }

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Dashboard',
      icon: Briefcase,
      onClick: () => setCurrentTab('overview'),
      isActive: currentTab === 'overview',
    },
    {
      id: 'leave',
      label: 'Book Leave',
      icon: Calendar,
      onClick: () => setCurrentTab('leave'),
      isActive: currentTab === 'leave',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      onClick: () => setCurrentTab('notifications'),
      isActive: currentTab === 'notifications',
      hasBadge: true,
    },
    {
      id: 'forum',
      label: 'Team Feed',
      icon: MessageSquare,
      onClick: () => setCurrentTab('forum'),
      isActive: currentTab === 'forum',
    },
    ...(user.role === 'ADMIN' || user.role === 'HR' || user.role === 'LEADER'
      ? [
          {
            id: 'employees' as const,
            label: 'Employees',
            icon: Users,
            onClick: () => setCurrentTab('employees'),
            isActive: currentTab === 'employees',
          },
        ]
      : []),
    {
      id: 'profile',
      label: 'Profile',
      icon: UserIcon,
      onClick: () => setCurrentTab('profile'),
      isActive: currentTab === 'profile',
    },
  ];

  return (
    <DashboardLayout
      user={user}
      navItems={navItems}
      onLogout={handleLogout}
      avatarGradient="from-blue-400 to-indigo-600"
    >
      {/* Overview Tab */}
      {currentTab === 'overview' && (
        <OverviewTab
          user={user}
          directorSummary={directorSummary}
          hrSummary={hrSummary}
          memberSummary={memberSummary}
          leaveBalance={leaveBalance}
          usedLeave={usedLeave}
          leaves={leaves}
        />
      )}

      {/* Leave Tab */}
      {currentTab === 'leave' && (
        <LeaveTab
          role={user?.role}
          handleBookLeave={handleBookLeave}
          newLeave={newLeave}
          setNewLeave={setNewLeave}
          leaveBalance={leaveBalance}
          usedLeave={usedLeave}
          leaves={leaves}
          onApproveLeave={handleApproveLeave}
          onRejectLeave={handleRejectLeave}
          onRefresh={fetchLeaves}
        />
      )}

      {/* Notifications Tab */}
      {currentTab === 'notifications' && <NotificationsTab notifications={notifications} />}

      {/* Profile Tab */}
      {currentTab === 'profile' && <ProfileTab user={user} />}

      {/* Forum Tab */}
      {currentTab === 'forum' && <TeamForum user={user} />}

      {/* Employees Tab */}
      {currentTab === 'employees' && <EmployeeTab />}
    </DashboardLayout>
  );
}
