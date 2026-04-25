import React, { useState } from 'react';

function EmailView({ emailDraft, onBack }) {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      const emailText = `To: ${emailDraft.to}
CC: ${emailDraft.cc}
Subject: ${emailDraft.subject}

${emailDraft.body}`;

      await navigator.clipboard.writeText(emailText);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const renderHeader = () => (
    <div style={styles.header}>
      <button onClick={onBack} style={styles.backButton}>
        ← Back
      </button>
      <button 
        onClick={handleCopyToClipboard} 
        style={{
          ...styles.copyButton,
          backgroundColor: copied ? '#28a745' : '#007bff',
        }}
      >
        {copied ? '✓ Copied!' : 'Copy to Clipboard'}
      </button>
    </div>
  );

  const renderError = () => null;

  const renderContent = () => (
    <div style={styles.emailCard}>
      {/* Email Header */}
      <div style={styles.emailHeader}>
        <div style={styles.headerRow}>
          <span style={styles.headerLabel}>To:</span>
          <span style={styles.headerValue}>{emailDraft.to}</span>
        </div>
        <div style={styles.headerRow}>
          <span style={styles.headerLabel}>CC:</span>
          <span style={styles.headerValue}>{emailDraft.cc}</span>
        </div>
        <div style={styles.headerRow}>
          <span style={styles.headerLabel}>Subject:</span>
          <span style={styles.headerValue}>{emailDraft.subject}</span>
        </div>
      </div>

      {/* Email Body */}
      <div style={styles.emailBody}>
        <div style={styles.bodyContent}>
          {emailDraft.body.split('\n').map((paragraph, index) => (
            <p key={index} style={styles.paragraph}>
              {paragraph || '\u00A0'} {/* Non-breaking space for empty lines */}
            </p>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        Aggregated public data only · No PII · No investment advice
      </div>

      {/* Copy Section */}
      <div style={styles.copySection}>
        <button 
          onClick={handleCopyToClipboard} 
          style={{
            ...styles.copyButton,
            ...(copied ? styles.copyButtonCopied : {})
          }}
        >
          {copied ? '✓ Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {renderHeader()}
      {renderError()}
      <main style={styles.main}>
        {renderContent()}
      </main>
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Facts-only · No PII · No investment advice · Powered by Groq
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  backButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    color: 'var(--text)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  copyButton: {
    padding: '12px 24px',
    backgroundColor: 'var(--navy)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
    width: '100%',
  },
  copyButtonCopied: {
    backgroundColor: 'var(--green)',
  },
  emailCard: {
    backgroundColor: 'var(--surface)',
    borderRadius: '14px',
    border: '1px solid var(--border)',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  emailHeader: {
    backgroundColor: '#F8F5F1',
    padding: '24px',
    borderBottom: '1px solid var(--border)',
  },
  headerRow: {
    display: 'flex',
    marginBottom: '12px',
    alignItems: 'flex-start',
  },
  'headerRow:last-child': {
    marginBottom: '0',
  },
  headerLabel: {
    minWidth: '60px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--muted)',
    marginRight: '12px',
    fontFamily: '"JetBrains Mono", monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  headerValue: {
    flex: '1',
    fontSize: '14px',
    color: 'var(--text)',
    wordBreak: 'break-word',
  },
  emailBody: {
    padding: '24px',
    backgroundColor: 'var(--surface)',
  },
  bodyContent: {
    fontSize: '15px',
    lineHeight: '1.8',
    color: 'var(--text)',
  },
  paragraph: {
    margin: '0 0 16px 0',
  },
  'paragraph:last-child': {
    marginBottom: '0',
  },
  disclaimer: {
    backgroundColor: 'var(--amber)',
    color: 'var(--text)',
    padding: '12px 20px',
    fontSize: '12px',
    fontWeight: '500',
    textAlign: 'center',
    margin: '20px 0',
    borderRadius: '8px',
  },
  copySection: {
    padding: '20px 24px',
    borderTop: '1px solid var(--border)',
  },
};

export default EmailView;
