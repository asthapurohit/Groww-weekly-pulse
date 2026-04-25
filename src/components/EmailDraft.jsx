import React from 'react';
import { generateEmail } from '../services/groq';

const EmailDraft = ({ emailData, loading, onGenerateEmail, onCopyEmail, error, isMobile }) => {
  const sendEmail = () => {
    const subject = encodeURIComponent(emailData?.subject || 'Weekly Review Insights - Groww App');
    const body = encodeURIComponent(emailData?.body || '');
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (loading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Email Draft</h1>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '60px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid #E5E7EB', borderTop: '4px solid #1a1a2e', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>Generating Email Draft...</h2>
          <p style={{ fontSize: '14px', color: '#6B7280' }}>Creating professional email with insights</p>
        </div>
      </div>
    );
  }

  if (!emailData) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Email Draft</h1>
          <div style={{ padding: '10px 16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', color: '#374151' }}>
            📅 Apr 11 – Apr 23, 2026
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px 20px', marginBottom: '24px', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '80px 60px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '24px' }}>✉️</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a2e', marginBottom: '12px' }}>Generate Email Draft</h2>
          <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px', lineHeight: '1.6' }}>
            Create a professional weekly pulse email with top themes, user quotes, and recommended actions.
          </p>
          <button
            onClick={onGenerateEmail}
            style={{ padding: '16px 40px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '12px' }}
          >
            📧 Generate Email Draft
          </button>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#9CA3AF' }}>Powered by Groq · llama-3.3-70b</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {error && (
        <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px 20px', marginBottom: '24px', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Email Draft</h1>
        <div style={{ padding: '10px 16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', color: '#374151' }}>
          📅 Apr 11 – Apr 23, 2026
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '3fr 2fr', gap: '24px' }}>

        {/* Left: Email Preview */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: isMobile ? '20px' : '32px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '20px' }}>Email Preview</h3>

          {/* To / CC / Subject */}
          <div style={{ backgroundColor: '#F9FAFB', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #E5E7EB' }}>
            {[
              { label: 'To', value: emailData.to || 'product-team@groww.in' },
              { label: 'CC', value: emailData.cc || 'growth@groww.in' },
              { label: 'Subject', value: emailData.subject || 'Weekly Pulse Report', bold: true },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{f.label}:</span>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '2px', fontWeight: f.bold ? '600' : '400' }}>{f.value}</div>
              </div>
            ))}
          </div>

          {/* Body */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', lineHeight: '1.8', color: '#374151', whiteSpace: 'pre-wrap' }}>
            {emailData.body || 'Email content will appear here...'}
          </div>
        </div>

        {/* Right: Actions */}
        <div>
          {/* What's included */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>What's included?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Top 3 Themes', 'Top 3 Quotes', '3 Recommended Actions', 'Key Insight'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            <button
              onClick={onCopyEmail}
              style={{ padding: '14px', backgroundColor: 'white', color: '#1a1a2e', border: '2px solid #1a1a2e', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              📋 Copy Email
            </button>
            <button
              onClick={sendEmail}
              style={{ padding: '14px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              📧 Send Email
            </button>
            <button
              onClick={onGenerateEmail}
              style={{ padding: '14px', backgroundColor: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              🔄 Regenerate
            </button>
          </div>

          {/* Disclaimer */}
          <div style={{ padding: '14px', backgroundColor: '#FEF3C7', borderRadius: '8px', border: '1px solid #FDE68A' }}>
            <div style={{ fontSize: '12px', color: '#92400E', lineHeight: '1.5' }}>
              ⚠️ <strong>Disclaimer:</strong> Auto-generated. No PII included. Please review before sending.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDraft;