import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Dashboard } from './pages/Dashboard';
import { ProfileOnboarding } from './pages/ProfileOnboarding';
import { TrackRecord } from './pages/TrackRecord';
import { ActionCenter } from './pages/ActionCenter';
import { BuildNext } from './pages/BuildNext';
import { CompanyPrep } from './pages/CompanyPrep';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentProfile } from './types';
import { getDemoStudentProfile, api } from './services/api';

export const App: React.FC = () => {
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Profile State
  const [profile, setProfile] = useState<StudentProfile | null>(getDemoStudentProfile());

  const fetchRealProfile = async () => {
    try {
      const res = await api.get('/profile');
      if (res.data?.profile) {
        setProfile(res.data.profile);
      }
    } catch (err) {
      // Fallback to seeded demo profile if not logged in or endpoint unauthenticated
      setProfile(getDemoStudentProfile());
    }
  };

  useEffect(() => {
    if (!isDemoMode) {
      fetchRealProfile();
    } else {
      setProfile(getDemoStudentProfile());
    }
  }, [isDemoMode]);

  const handleSync = async () => {
    setIsSyncing(true);
    if (isDemoMode) {
      setTimeout(() => {
        setIsSyncing(false);
        setProfile(getDemoStudentProfile());
      }, 1200);
    } else {
      try {
        await api.post('/profile/sync');
        await fetchRealProfile();
      } catch (err) {
        console.error('Real backend sync error:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  return (
    <Router>
      <div className="flex h-screen bg-[#F8F9FA] text-[#1F2937] overflow-hidden font-sans">
        {/* Navigation Sidebar */}
        <Sidebar
          isDemoMode={isDemoMode}
          onToggleDemoMode={() => setIsDemoMode(!isDemoMode)}
          isAdminMode={isAdminMode}
          onToggleAdminMode={() => setIsAdminMode(!isAdminMode)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar
            profile={profile}
            onSync={handleSync}
            isSyncing={isSyncing}
            isDemoMode={isDemoMode}
          />

          <main className="flex-1 overflow-y-auto p-6 bg-[#F8F9FA]">
            <Routes>
              <Route path="/" element={<Dashboard profile={profile} onSync={handleSync} isSyncing={isSyncing} />} />
              <Route path="/onboarding" element={<ProfileOnboarding profile={profile} onSync={handleSync} isSyncing={isSyncing} />} />
              <Route path="/track-record" element={<TrackRecord profile={profile} />} />
              <Route path="/actions" element={<ActionCenter profile={profile} onRefresh={handleSync} />} />
              <Route path="/build-next" element={<BuildNext profile={profile} />} />
              <Route path="/companies" element={<CompanyPrep profile={profile} />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};
