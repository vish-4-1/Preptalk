import React, { useState } from 'react';
import { Building2, CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';
import { StudentProfile, TargetCompany } from '../types';
import { getDemoCompanies } from '../services/api';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

interface CompanyPrepProps {
  profile: StudentProfile | null;
}

export const CompanyPrep: React.FC<CompanyPrepProps> = ({ profile }) => {
  const companies = getDemoCompanies();
  const [selectedCompany, setSelectedCompany] = useState<TargetCompany>(companies[0]);

  const studentReadiness = profile?.placementReadiness || 78;
  const isTier1 = selectedCompany.difficultyLevel === 'TIER-1';
  const companyReadinessScore = isTier1 ? Math.round(studentReadiness * 0.92) : Math.round(studentReadiness * 1.05);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-4">
        <h1 className="text-xl font-bold text-[#1F2937] flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-[#374151]" />
          <span>Target Company Preparation</span>
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Evaluate your verified placement readiness index against company-specific technical hiring benchmarks.
        </p>
      </div>

      {/* Company Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {companies.map((comp) => {
          const isSelected = comp.id === selectedCompany.id;
          return (
            <button
              key={comp.id}
              onClick={() => setSelectedCompany(comp)}
              className={`p-3 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-[#374151] border-[#374151] text-white shadow-xs'
                  : 'bg-[#FFFFFF] border-[#E5E7EB] text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{comp.name}</span>
                <Badge variant={comp.difficultyLevel === 'TIER-1' ? 'error' : 'info'} size="sm">
                  {comp.difficultyLevel}
                </Badge>
              </div>
              <p className="text-[11px] opacity-80 mt-1 line-clamp-1">{comp.targetRoles[0]}</p>
            </button>
          );
        })}
      </div>

      {/* Selected Company Readiness Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#FFFFFF] border border-[#E5E7EB] p-6 rounded-lg space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-4">
            <div>
              <h2 className="text-lg font-bold text-[#1F2937]">{selectedCompany.name} Target Preparation</h2>
              <p className="text-xs text-[#6B7280] mt-0.5">{selectedCompany.overview}</p>
            </div>
            <Badge variant={companyReadinessScore >= 75 ? 'success' : 'warning'}>
              Readiness: {companyReadinessScore}/100
            </Badge>
          </div>

          <ProgressBar
            label={`${selectedCompany.name} Readiness Score`}
            value={companyReadinessScore}
            sublabel={
              companyReadinessScore >= 75
                ? 'Strong match for online screening assessment rounds.'
                : 'Focus on identified skill gaps before interview scheduling.'
            }
          />

          {/* Skill Requirements Matrix */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-semibold uppercase text-[#6B7280]">Required Skills & Key Topics</h3>
            <div className="space-y-3">
              {selectedCompany.requirements.map((req) => {
                const reqMet = studentReadiness >= req.minScore;
                return (
                  <div key={req.id} className="bg-[#F8F9FA] p-4 rounded border border-[#E5E7EB] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {reqMet ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-[#1F2937]">{req.skillName}</span>
                      </div>
                      <span className="text-xs font-mono text-[#6B7280]">Target: {req.minScore}+</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {req.topics.map((top) => (
                        <span key={top} className="bg-[#FFFFFF] border border-[#E5E7EB] text-[11px] font-mono text-[#374151] px-2 py-0.5 rounded">
                          {top}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Company Targeted Action Plan */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] p-6 rounded-lg space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-[#1F2937] border-b border-[#E5E7EB] pb-3 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Target Preparation Plan</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="bg-[#F8F9FA] p-3.5 rounded border border-[#E5E7EB] space-y-1">
              <span className="font-semibold text-[#1F2937]">1. Online Assessment Round</span>
              <p className="text-[#6B7280]">Solve 15 timed Graph & Dynamic Programming problems on LeetCode.</p>
            </div>

            <div className="bg-[#F8F9FA] p-3.5 rounded border border-[#E5E7EB] space-y-1">
              <span className="font-semibold text-[#1F2937]">2. Technical System Round</span>
              <p className="text-[#6B7280]">Review Redis caching, database indexing models, and microservice trade-offs.</p>
            </div>

            <div className="bg-[#F8F9FA] p-3.5 rounded border border-[#E5E7EB] space-y-1">
              <span className="font-semibold text-[#1F2937]">3. Leadership / Behavioral Round</span>
              <p className="text-[#6B7280]">Prepare STAR framework stories for conflict resolution and technical trade-offs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
