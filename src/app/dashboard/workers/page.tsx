'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Plus, 
  Camera, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Eye, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  Calendar 
} from 'lucide-react';
import { useStore } from '@/lib/data/store-context';
import { formatDateTime, formatDate, getReviewStatusBadge } from '@/lib/utils';
import { ActivityLog, ReviewStatus, FarmTaskType } from '@/types';

export default function WorkersAndEvidencePage() {
  const { 
    currentUser, 
    tasks, 
    activityLogs, 
    farmUnits, 
    farms, 
    addTask, 
    submitActivityReport, 
    reviewActivityReport 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'reviews' | 'tasks' | 'submit'>('reviews');

  // New Task State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskType, setTaskType] = useState<FarmTaskType>('feeding');
  const [taskUnitId, setTaskUnitId] = useState(farmUnits[0]?.id || '');
  const [taskPriority, setTaskPriority] = useState<'low' | 'normal' | 'high' | 'urgent'>('normal');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);

  // Worker Submission Form State
  const [selectedTaskId, setSelectedTaskId] = useState(tasks[0]?.id || '');
  const [subTitle, setSubTitle] = useState('Fed 850 Broilers in House Alpha');
  const [subDesc, setSubDesc] = useState('Distributed 65kg finisher pellets evenly across feeding pans. All water nipples inspected.');
  const [subQty, setSubQty] = useState('65');
  const [subUnitMeasure, setSubUnitMeasure] = useState('kg');
  const [subIssueFlag, setSubIssueFlag] = useState(false);
  const [subIssueDetails, setSubIssueDetails] = useState('');
  const [subPhoto, setSubPhoto] = useState('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Supervisor Review Action Modal
  const [selectedLogForReview, setSelectedLogForReview] = useState<ActivityLog | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const unit = farmUnits.find((u) => u.id === taskUnitId);
    addTask({
      farmId: unit ? unit.farmId : farms[0].id,
      unitId: taskUnitId,
      unitName: unit?.name,
      title: taskTitle,
      description: taskDesc,
      taskType,
      priority: taskPriority,
      dueDate: taskDueDate,
      assignedWorkerId: 'usr-worker-ibrahim',
      assignedWorkerName: 'Ibrahim Danladi',
      createdBy: currentUser.fullName,
    });

    setTaskTitle('');
    setTaskDesc('');
    setShowTaskModal(false);
  };

  const handleSubmitWorkerReport = (e: React.FormEvent) => {
    e.preventDefault();
    const task = tasks.find((t) => t.id === selectedTaskId);
    const unitId = task ? task.unitId : farmUnits[0].id;
    const farmId = task ? task.farmId : farms[0].id;

    submitActivityReport(
      selectedTaskId || undefined,
      farmId,
      unitId,
      subTitle,
      subDesc,
      parseFloat(subQty) || 0,
      subUnitMeasure,
      subIssueFlag,
      subIssueDetails || undefined,
      subPhoto
    );

    setSubmitSuccess('Activity report & photo evidence submitted successfully for supervisor audit!');
    setTimeout(() => {
      setSubmitSuccess('');
      setActiveTab('reviews');
    }, 2000);
  };

  const handleExecuteReview = (action: ReviewStatus) => {
    if (!selectedLogForReview) return;

    reviewActivityReport(selectedLogForReview.id, action, reviewNotes);
    setSelectedLogForReview(null);
    setReviewNotes('');
  };

  const pendingCount = activityLogs.filter((l) => l.reviewStatus === 'pending_review').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Worker Accountability & Photo Evidence</h1>
          <p className="text-xs text-slate-500 mt-1">
            Timestamped task evidence audit loop: <span className="font-semibold text-slate-700">Images are submitted evidence, not blind proof</span>. Supervisor review maintains operational integrity.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('submit')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>Worker Quick Submit</span>
          </button>

          <button
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Task</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'reviews' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Supervisor Review Console ({pendingCount} Awaiting)</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'tasks' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Assigned Task Lists ({tasks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'submit' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Worker Evidence Uploader</span>
        </button>
      </div>

      {/* Tab 1: Supervisor Review Console */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activityLogs.map((log) => {
              const badge = getReviewStatusBadge(log.reviewStatus);
              const evidence = log.evidence[0];

              return (
                <div key={log.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {log.unitName || 'Production Unit'}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm mt-0.5">{log.taskTitle}</h3>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badge.bg} ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {log.description}
                    </p>

                    {/* Submitted Evidence Photo with Metadata */}
                    {evidence && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                          <span>Photo Evidence:</span>
                          <span>Captured: {formatDateTime(evidence.captureTimestamp)}</span>
                        </div>
                        <div className="h-44 w-full rounded-lg overflow-hidden bg-slate-200 relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={evidence.mediaUrl}
                            alt="Submitted evidence"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-[10px] font-mono backdrop-blur-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>GPS: ~{evidence.gpsApproxLat || 6.9074}, {evidence.gpsApproxLng || 3.5812}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quantity and Issues */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-400 block">Reported Quantity</span>
                        <span className="font-bold text-slate-800">{log.quantityCompleted} {log.unitOfMeasure}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-400 block">Worker</span>
                        <span className="font-bold text-slate-800">{log.workerName}</span>
                      </div>
                    </div>

                    {log.issueFlag && (
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs">
                        <span className="font-bold flex items-center gap-1 text-[11px] text-rose-700">
                          <AlertCircle className="w-3.5 h-3.5" /> Worker Flagged Anomaly:
                        </span>
                        <p className="mt-0.5 text-[11px]">{log.issueDetails || 'Equipment or biological issue reported.'}</p>
                      </div>
                    )}

                    {/* Prior Supervisor Feedback */}
                    {log.supervisorFeedback && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900 text-[11px] border border-emerald-200">
                        <strong>Supervisor Note:</strong> {log.supervisorFeedback} (by {log.reviewedBy} at {formatDateTime(log.reviewedAt || '')})
                      </div>
                    )}
                  </div>

                  {/* Review Actions */}
                  <div className="pt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedLogForReview(log);
                      }}
                      className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition"
                    >
                      Audit & Review Submission
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Assigned Task List */}
      {activeTab === 'tasks' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-900">Assigned Field Tasks</span>
            <button onClick={() => setShowTaskModal(true)} className="font-bold text-emerald-700 hover:underline">
              + Assign Task
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Task Title</th>
                  <th className="py-3 px-4">Unit</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Assigned Worker</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{t.title}</div>
                      {t.description && <div className="text-[11px] text-slate-500 font-normal">{t.description}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{t.unitName || 'General Farm'}</td>
                    <td className="py-3.5 px-4 capitalize text-slate-600">{t.taskType.replace(/_/g, ' ')}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{t.assignedWorkerName || 'Unassigned'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.priority === 'urgent' ? 'bg-rose-100 text-rose-800' : t.priority === 'high' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">{formatDate(t.dueDate)}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Worker Evidence Uploader (Optimized for Mobile/3G) */}
      {activeTab === 'submit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-xl mx-auto space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Worker Activity Report Submission</h3>
            <p className="text-xs text-slate-500 mt-1">
              Field attendants submit completed daily tasks with photographic evidence and maintenance flags.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{submitSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSubmitWorkerReport} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Assigned Task (Optional)</label>
              <select
                value={selectedTaskId}
                onChange={(e) => {
                  setSelectedTaskId(e.target.value);
                  const t = tasks.find((item) => item.id === e.target.value);
                  if (t) setSubTitle(t.title);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
              >
                <option value="">-- Custom / Unscheduled Activity --</option>
                {tasks.map((t) => (
                  <option key={t.id} value={t.id}>{t.title} ({t.unitName || 'Farm'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Task / Activity Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Fed 850 broilers in House Alpha"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">What did you complete?</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Cleared drinker lines, swept feed walkway, checked mortality."
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity Completed</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={subQty}
                  onChange={(e) => setSubQty(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Unit of Measure</label>
                <input
                  type="text"
                  placeholder="e.g. kg, birds, crates, pens"
                  value={subUnitMeasure}
                  onChange={(e) => setSubUnitMeasure(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Photo Evidence Link / Camera Staging</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={subPhoto}
                  onChange={(e) => setSubPhoto(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Photo captured with timestamp and approximate GPS coordinates.</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-center gap-2 text-slate-800 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={subIssueFlag}
                  onChange={(e) => setSubIssueFlag(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>Flag an equipment issue or mortality anomaly?</span>
              </label>

              {subIssueFlag && (
                <div>
                  <textarea
                    rows={2}
                    placeholder="Describe the issue (e.g., Leaking nipple valve in row 3, 4 birds panting heavily)"
                    value={subIssueDetails}
                    onChange={(e) => setSubIssueDetails(e.target.value)}
                    className="w-full px-3 py-2 border border-rose-200 bg-rose-50/50 rounded-lg text-xs text-rose-950"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>Submit Activity Evidence</span>
            </button>
          </form>
        </div>
      )}

      {/* Review Modal (Supervisor Action) */}
      {selectedLogForReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start mb-4 pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Supervisor Audit Action</span>
                <h3 className="font-bold text-slate-900 text-base">{selectedLogForReview.taskTitle}</h3>
              </div>
              <button onClick={() => setSelectedLogForReview(null)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <div className="space-y-3 text-xs mb-4">
              <div className="text-slate-600">
                <strong>Worker:</strong> {selectedLogForReview.workerName} • {formatDateTime(selectedLogForReview.timestampRecorded)}
              </div>
              <div className="text-slate-600">
                <strong>Reported:</strong> {selectedLogForReview.description}
              </div>

              {selectedLogForReview.evidence[0] && (
                <div className="h-40 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedLogForReview.evidence[0].mediaUrl}
                    alt="Evidence preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supervisor Review Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inspected on morning rounds. Feed spread is uniform. Approved."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleExecuteReview('rejected')}
                className="flex-1 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg font-bold transition flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject with Flag</span>
              </button>
              <button
                type="button"
                onClick={() => handleExecuteReview('correction_requested')}
                className="flex-1 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg font-bold transition flex items-center justify-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Request Re-check</span>
              </button>
              <button
                type="button"
                onClick={() => handleExecuteReview('approved')}
                className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold transition flex items-center justify-center gap-1 shadow"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Lock</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Assign Field Task to Worker</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weigh 50 broilers, clean Catfish Pond 2"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Unit</label>
                <select
                  value={taskUnitId}
                  onChange={(e) => setTaskUnitId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                >
                  {farmUnits.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value as FarmTaskType)}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs capitalize"
                  >
                    <option value="feeding">Feeding</option>
                    <option value="cleaning">Cleaning / Sanitation</option>
                    <option value="watering">Water Line Inspection</option>
                    <option value="weighing">Sample Weighing</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="egg_collection">Egg Collection</option>
                    <option value="pond_maintenance">Pond Maintenance</option>
                    <option value="equipment_maintenance">Equipment Check</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as 'low' | 'normal' | 'high' | 'urgent')}
                    className="w-full px-2 py-2 border border-slate-200 rounded-lg text-xs uppercase font-bold"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions for Worker</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Ensure digital scale is calibrated to zero before sampling."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold shadow"
                >
                  Delegate Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
