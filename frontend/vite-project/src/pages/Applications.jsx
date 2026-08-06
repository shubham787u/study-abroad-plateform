import React, { useState, useEffect } from 'react';
import applicationService from '../services/applicationService';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import {
  FileCheck2,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  MapPin,
  Calendar,
  Eye,
  Edit3,
  X,
  AlertCircle,
} from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  // Selected Application Details & History Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Status Update Simulation State
  const [updateStatus, setUpdateStatus] = useState('Reviewed');
  const [updateNote, setUpdateNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter) params.status = statusFilter;

      const res = await applicationService.getMyApplications(params);
      if (res?.data) setApplications(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleViewDetails = async (id) => {
    try {
      setLoadingDetails(true);
      setUpdateSuccess('');
      const res = await applicationService.getApplicationById(id);
      if (res?.data?.application) {
        setSelectedApp(res.data.application);
      }
    } catch (err) {
      setError(err.message || 'Could not fetch application details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleStatusUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setUpdating(true);
      setUpdateSuccess('');

      const res = await applicationService.updateApplicationStatus(selectedApp._id, {
        status: updateStatus,
        note: updateNote,
      });

      setUpdateSuccess(`Status updated to '${updateStatus}' successfully!`);
      if (res?.data?.application) {
        setSelectedApp(res.data.application);
      }
      fetchApplications();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>Application Tracker</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Monitor submitted program applications, review counselor status notes, and trace application history.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[
          { label: 'All Applications', value: '' },
          { label: 'Applied', value: 'Applied' },
          { label: 'Under Review', value: 'Reviewed' },
          { label: 'Accepted', value: 'Accepted' },
          { label: 'Rejected', value: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.label}
            className={`btn btn-sm ${statusFilter === tab.value ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatusFilter(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Applications List */}
      {loading ? (
        <Loader message="Loading application status tracker..." />
      ) : applications.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <FileCheck2 size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
          <h3>No Applications Found</h3>
          <p style={{ marginTop: '0.5rem' }}>You haven't submitted applications matching this status.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app) => (
            <div
              key={app._id}
              className="glass-card"
              style={{
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <FileText size={24} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>
                    {app.program?.title || 'Program Name'}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building size={14} style={{ color: 'var(--secondary)' }} />
                    {app.university?.name} ({app.university?.country})
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <StatusBadge status={app.status} />
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.775rem', marginTop: '0.35rem' }}>
                    Submitted {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleViewDetails(app._id)}
                >
                  <Eye size={15} />
                  View Details & History
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Details & History Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close" onClick={() => setSelectedApp(null)}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <StatusBadge status={selectedApp.status} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                Application ID: #{selectedApp._id.slice(-6)}
              </span>
            </div>

            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              {selectedApp.program?.title}
            </h2>
            <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              {selectedApp.university?.name} ({selectedApp.university?.country})
            </p>

            {/* Statement of Purpose Box */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: '0.5rem' }}>
                Statement of Purpose (SOP)
              </h4>
              <div
                style={{
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-light)',
                }}
              >
                {selectedApp.statementOfPurpose || 'No written statement was provided with this application.'}
              </div>
            </div>

            {/* Status Timeline History */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-subtle)', marginBottom: '0.85rem' }}>
                Status Audit Timeline
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {selectedApp.statusHistory && selectedApp.statusHistory.length > 0 ? (
                  selectedApp.statusHistory.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.85rem 1rem',
                        background: 'rgba(30, 41, 59, 0.5)',
                        borderLeft: '3px solid var(--primary)',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <strong style={{ color: 'var(--text-main)' }}>Status set to: {item.status}</strong>
                        <span style={{ color: 'var(--text-subtle)', fontSize: '0.775rem' }}>
                          {new Date(item.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)' }}>{item.note || 'No additional note'}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>No status history logged yet.</p>
                )}
              </div>
            </div>

            {/* Interactive Status Transition Simulator for Counselor / Admin Testing */}
            <div
              style={{
                padding: '1.25rem',
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)',
              }}
            >
              <h4 style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Edit3 size={15} />
                Update Application Status (Counselor Simulation)
              </h4>

              {updateSuccess && (
                <div className="alert alert-success" style={{ padding: '0.5rem 0.75rem', fontSize: '0.825rem' }}>
                  <CheckCircle2 size={16} />
                  <span>{updateSuccess}</span>
                </div>
              )}

              <form onSubmit={handleStatusUpdateSubmit}>
                <div className="grid-2" style={{ marginBottom: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">New Status</label>
                    <select
                      className="form-control"
                      value={updateStatus}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Counselor Note</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Credentials verified"
                      value={updateNote}
                      onChange={(e) => setUpdateNote(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-secondary btn-sm" style={{ width: '100%', marginTop: '0.75rem' }} disabled={updating}>
                  {updating ? 'Updating Status...' : 'Simulate Status Update'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
