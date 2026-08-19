import React from 'react';
import { Code2, Lightbulb, Clock } from 'lucide-react';
import { ProjectRecommendation, StudentProfile } from '../types';
import { Badge } from '../components/ui/Badge';

interface BuildNextProps {
  profile: StudentProfile | null;
}

export const BuildNext: React.FC<BuildNextProps> = ({ profile }) => {
  const projects: ProjectRecommendation[] = profile?.projectRecommendations?.length
    ? profile.projectRecommendations
    : [
        {
          id: 'pr1',
          title: 'Campus Network Anomaly Detection System',
          problemStatement: 'Build a high-performance network packet telemetry visualizer with ML-driven anomaly detection and FastAPI backend.',
          whySuited: 'You already possess strong Python and web API experience, but lack lower-level networking and security telemetry projects.',
          technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Scikit-Learn', 'React'],
          skillsDeveloped: ['Computer Networks', 'Machine Learning', 'Async Microservices', 'Data Pipeline'],
          difficulty: 'INTERMEDIATE',
          estimatedDuration: '2 weeks',
          milestones: [
            'Set up PCAP packet streaming socket listener',
            'Train Isolation Forest model on traffic anomalies',
            'Deploy React Dashboard with real-time alert stream',
          ],
        },
        {
          id: 'pr2',
          title: 'Distributed Job Scheduler with Redis Lock',
          problemStatement: 'Develop a resilient multi-node worker queue with cron expression scheduling, leader election, and exponential backoff retry mechanisms.',
          whySuited: 'Fills your System Design and concurrency skill gap for Tier-1 Product companies.',
          technologies: ['TypeScript', 'Node.js', 'Redis', 'Docker'],
          skillsDeveloped: ['Distributed Systems', 'Redis Locks', 'Leader Election', 'Fault Tolerance'],
          difficulty: 'ADVANCED',
          estimatedDuration: '3 weeks',
          milestones: [
            'Implement Redlock algorithm for lock contention',
            'Build sliding window attempt monitor',
            'Add Docker Compose cluster simulation',
          ],
        },
      ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-4">
        <h1 className="text-xl font-bold text-[#1F2937] flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-[#374151]" />
          <span>Build Next - Personalized Project Engine</span>
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          System-suggested projects designed specifically to bridge your verified skill gaps and elevate your GitHub telemetry.
        </p>
      </div>

      {/* Recommended Projects List */}
      <div className="space-y-6">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-[#FFFFFF] border border-[#E5E7EB] p-6 rounded-lg space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5E7EB] pb-3">
              <div>
                <h2 className="text-base font-bold text-[#1F2937]">{proj.title}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={proj.difficulty === 'ADVANCED' ? 'warning' : 'info'}>{proj.difficulty}</Badge>
                  <span className="text-xs font-mono text-[#6B7280] flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. {proj.estimatedDuration}</span>
                  </span>
                </div>
              </div>

              <button className="bg-[#374151] hover:bg-[#1F2937] text-white font-semibold text-xs px-4 py-2 rounded border border-[#374151] transition-colors self-start sm:self-auto shadow-xs">
                Start Building Project
              </button>
            </div>

            {/* Why Suited (Personalized Rationale) */}
            <div className="bg-[#F8F9FA] p-3.5 rounded border border-[#E5E7EB] text-xs flex items-start space-x-2">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#1F2937]">Why this project fits your profile: </span>
                <span className="text-[#374151]">{proj.whySuited}</span>
              </div>
            </div>

            {/* Problem Statement */}
            <div className="space-y-1">
              <h3 className="text-xs font-mono font-semibold uppercase text-[#6B7280]">Problem Statement</h3>
              <p className="text-xs text-[#374151] leading-relaxed">{proj.problemStatement}</p>
            </div>

            {/* Tech Stack & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <h3 className="text-xs font-mono font-semibold uppercase text-[#6B7280] mb-2">Required Technologies</h3>
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies?.map((tech) => (
                    <span key={tech} className="bg-[#F8F9FA] text-[#1F2937] border border-[#E5E7EB] text-[11px] font-mono px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-mono font-semibold uppercase text-[#6B7280] mb-2">Skills Developed</h3>
                <div className="flex flex-wrap gap-1.5">
                  {proj.skillsDeveloped?.map((skill) => (
                    <span key={skill} className="bg-blue-50 text-blue-900 border border-blue-200 text-[11px] font-mono px-2 py-0.5 rounded font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestones */}
            <div className="pt-2 border-t border-[#E5E7EB]">
              <h3 className="text-xs font-mono font-semibold uppercase text-[#6B7280] mb-2">Suggested Milestones</h3>
              <div className="space-y-1.5">
                {proj.milestones?.map((m, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-xs text-[#374151] font-mono">
                    <span className="w-5 h-5 rounded bg-[#F8F9FA] border border-[#E5E7EB] text-[11px] font-bold flex items-center justify-center text-[#6B7280] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
