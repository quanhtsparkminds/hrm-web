import DashboardLayout, { NavItem } from '@/components/layout/DashboardLayout';
import { useLogout } from '@/hook/AuthHook/AuthHook';
import { useUser } from '@/hook/UserHook/UserHook';
import { useAppDispatch, useAppSelector } from '@/store';
import { selectAccessToken, selectIsSignedIn } from '@/store/slices/AuthSlice';
import {
  Bell,
  Briefcase,
  Calendar,
  MessageSquare,
  User as UserIcon,
} from 'lucide-react';
import TeamForum from '@/components/forum/TeamForum';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SummaryApi } from '@/services/SummaryApi/SummaryApi';
import { DirectorSummaryResponse, HRSummaryResponse, MemberSummaryResponse } from '@shared/api';
import OverviewTab from '@/components/dashboard/OverviewTab';
import LeaveTab from '@/components/dashboard/LeaveTab';
import NotificationsTab from '@/components/dashboard/NotificationsTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import { LeaveRecord, NotificationType } from '@/components/dashboard/types';
import LeaveApi from '@/services/LeaveApi/LeaveApi';

// Types moved to @/components/dashboard/types.ts

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSignedIn = useAppSelector(selectIsSignedIn);
  const accessToken = useAppSelector(selectAccessToken);

  const [currentTab, setCurrentTab] = useState<
    'overview' | 'leave' | 'notifications' | 'profile' | 'forum'
  >('overview');

  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);

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

  const { user } = useUser();
  const [directorSummary, setDirectorSummary] = useState<DirectorSummaryResponse | null>(null);
  const [hrSummary, setHrSummary] = useState<HRSummaryResponse | null>(null);
  const [memberSummary, setMemberSummary] = useState<MemberSummaryResponse | null>(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await LeaveApi.getAllLeaveRequests();
        if (res.success) setLeaves(res.data);
      } catch (error) {
        console.error('Error fetching leaves:', error);
      }
    };
    if (user) fetchLeaves();
  }, [user]);

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
    if (!isSignedIn || !accessToken) {
      navigate('/login');
    }
  }, [isSignedIn, accessToken, navigate]);

  const { logout } = useLogout();
  const handleLogout = async () => {
    await logout();
  };

  const handleBookLeave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLeave.startDate || !newLeave.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      const res = await LeaveApi.createLeaveRequest({
        leaveType: newLeave.type,
        startDate: new Date(newLeave.startDate).toISOString(),
        endDate: new Date(newLeave.endDate).toISOString(),
        reason: newLeave.reason,
      });

      if (res.success) {
        setLeaves([res.data, ...leaves]);
        setNewLeave({ type: 'ANNUAL', startDate: '', endDate: '', reason: '' });
        alert('Leave request submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert('Failed to submit leave request');
    }
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
        />
      )}

      {/* Notifications Tab */}
      {currentTab === 'notifications' && (
        <NotificationsTab notifications={notifications} />
      )}

      {/* Profile Tab */}
      {currentTab === 'profile' && (
        <ProfileTab user={user} />
      )}

      {/* Forum Tab */}
      {currentTab === 'forum' && <TeamForum user={user} />}
    </DashboardLayout>
  );
}
