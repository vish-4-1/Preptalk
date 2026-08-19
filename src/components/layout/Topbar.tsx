import React from 'react';
import { RefreshCw, User, Sparkles } from 'lucide-react';
import { StudentProfile } from '../../types';

interface TopbarProps {
  profile: StudentProfile | null;
  onSync: () => void;
  isSyncing: boolean;
  isDemoMode: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({ profile, onSync, isSyncing, isDemoMode }) => {
  return (
    <header className="h-16 bg-[#FFFFFF] border-b border-[#E5E7EB] px-6 flex items-center justify-between shrink-0 shadow-xs">
      {/* Telemetry Status Bar */}
      <div className="flex items-center space-x-3 text-xs font-mono">
        <span className="flex items-center space-x-1.5 bg-[#F8F9FA] px-2.5 py-1 rounded border border-[#E5E7EB] text-[#374151]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium text-[#1F2937]">Groq API (llama-3.3-70b): Connected</span>
        </span>

        <span className={`px-2.5 py-1 rounded border text-[11px] font-semibold ${
          isDemoMode 
            ? 'bg-amber-50 text-amber-800 border-amber-200' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {isDemoMode ? 'Demo Mode (Arun Kumar Profile)' : 'Live PostgreSQL Backend Active'}
        </span>
      </div>

      {/* Profile Actions */}
      <div className="flex items-center space-x-4">
        {/* Sync Button */}
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="flex items-center space-x-2 bg-[#374151] hover:bg-[#1F2937] disabled:opacity-50 text-white text-xs font-medium px-3.5 py-1.5 rounded border border-[#374151] transition-colors shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing Profiles...' : 'Sync Telemetry'}</span>
        </button>

        <div className="h-4 w-[1px] bg-[#E5E7EB]"></div>

        {/* User Card */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded bg-[#F8F9FA] border border-[#E5E7EB] flex items-center justify-center text-[#374151]">
            <User className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-[#1F2937]">{profile?.user?.name || 'Arun Kumar'}</p>
            <p className="text-[11px] text-[#6B7280] font-mono">{profile?.user?.branch || 'B.Tech CSE'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
