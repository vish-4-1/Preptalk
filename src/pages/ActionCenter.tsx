import React, { useState } from 'react';
import { CheckSquare, Square, Clock, Lightbulb, CheckCircle2 } from 'lucide-react';
import { ActionItem, StudentProfile } from '../types';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';

interface ActionCenterProps {
  profile: StudentProfile | null;
  onRefresh: () => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ profile, onRefresh }) => {
  const [actions, setActions] = useState<ActionItem[]>(
    profile?.actionItems?.length
      ? profile.actionItems
      : [
          { id: 'a1', title: 'Complete 5 Medium Graph Traversal Problems', category: 'Coding', priority: 'HIGH', estimatedHours: 4, reason: 'Graph representation is currently your largest algorithmic gap for Amazon and Adobe technical rounds.', completed: false },
          { id: 'a2', title: 'Add OpenAPI Documentation & Jest Tests to campus-connect', category: 'Documentation', priority: 'HIGH', estimatedHours: 5, reason: 'Improves project documentation score and unit test telemetry on GitHub.', completed: false },
          { id: 'a3', title: 'Revise DBMS Transaction Isolation & Indexing B-Trees', category: 'Theory', priority: 'MEDIUM', estimatedHours: 3, reason: 'Essential CS fundamental topic frequently queried in technical screening rounds.', completed: true, completedAt: '2026-08-18' },
          { id: 'a4', title: 'Conduct 1 Timed System Design Mock Interview', category: 'Mock Interview', priority: 'MEDIUM', estimatedHours: 2, reason: 'Builds articulation and trade-off justification under interviewer pressure.', completed: false },
        ]
  );

  const toggleAction = async (id: string) => {
    setActions(
      actions.map((act) => (act.id === id ? { ...act, completed: !act.completed, completedAt: !act.completed ? new Date().toISOString() : undefined } : act))
    );

    try {
      await api.post(`/actions/${id}/complete`);
      onRefresh();
    } catch (err) {
      // Graceful fallback
    }
  };

  const completedCount = actions.filter((a) => a.completed).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1F2937] flex items-center space-x-2">
            <CheckSquare className="w-5 h-5 text-[#374151]" />
            <span>Action Center</span>
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">
            Prioritized concrete next steps tailored to your specific skill gaps and target company profiles.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <Badge variant="success">Completed: {completedCount}/{actions.length}</Badge>
        </div>
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {actions.map((action) => {
          return (
            <div
              key={action.id}
              onClick={() => toggleAction(action.id)}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                action.completed
                  ? 'bg-[#F8F9FA] border-[#E5E7EB] opacity-70'
                  : 'bg-[#FFFFFF] border-[#E5E7EB] hover:border-[#D1D5DB] shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <button className="mt-0.5 text-[#6B7280] hover:text-[#1F2937] transition-colors">
                    {action.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 text-[#9CA3AF]" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className={`text-sm font-bold ${action.completed ? 'line-through text-[#6B7280]' : 'text-[#1F2937]'}`}>
                        {action.title}
                      </span>
                      <Badge variant={action.priority === 'HIGH' ? 'error' : 'warning'} size="sm">
                        {action.priority}
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {action.category}
                      </Badge>
                    </div>

                    {/* Explicit Reasoning */}
                    <div className="bg-[#F8F9FA] p-2.5 rounded border border-[#E5E7EB] text-xs text-[#374151] flex items-start space-x-2">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{action.reason}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 text-xs font-mono text-[#6B7280] shrink-0 bg-[#F8F9FA] px-2.5 py-1 rounded border border-[#E5E7EB]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Est. {action.estimatedHours}h</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
