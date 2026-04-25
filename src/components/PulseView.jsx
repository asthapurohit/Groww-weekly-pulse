import React, { useState } from 'react';

function PulseView({ 
  pulse, 
  themeCounts, 
  totalReviews, 
  avgRating, 
  weekLabel, 
  onEmail, 
  emailLoading, 
  onBack 
}) {
  const [copiedId, setCopiedId] = useState(null);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'critical': return '#E63946';
      case 'warning': return '#FF9F1C';
      case 'positive': return '#2D6A4F';
      default: return '#6c757d';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P0': return '#dc3545';
      case 'P1': return '#fd7e14';
      case 'P2': return '#ffc107';
      default: return '#6c757d';
    }
  };

  const getThemeColor = (themeId) => {
    const theme = themeCounts.find(t => t.id === themeId);
    return theme ? theme.color : '#6c757d';
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  const calculateWordCount = (text) => {
    return text.split(' ').filter(word => word.length > 0).length;
  };

  const handleExportMD = () => {
    try {
      const mdContent = `# Groww Weekly Review Pulse\n\n## Week: ${weekLabel}\n\n## Headline\n${pulse.headline}\n\n## Summary\n${pulse.summary}\n\n## Key Themes\n${pulse.themes?.map(theme => `- **${theme.name}**: ${theme.insight}`).join('\n')}\n\n## User Feedback\n${pulse.quotes?.map(quote => `- "${quote.text}" - ${themeCounts.find(t => t.id === quote.themeId)?.label || 'Unknown'} (${quote.rating}⭐)`).join('\n')}\n\n## Recommended Actions\n${pulse.actions?.map(action => `- **${action.title}**: ${action.detail} (${action.priority}) - ${action.owner}`).join('\n')}\n\n---\n\n*Generated on ${new Date().toISOString()}*\n*Source: Groww App Store Reviews Analysis`;
      
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'groww_weekly_pulse.md';
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back
        </button>
        <button 
          onClick={onEmail} 
          style={styles.emailButton}
          disabled={emailLoading}
        >
          {emailLoading ? 'Generating...' : 'Draft Email'}
        </button>
        <button 
          onClick={handleExportMD}
          style={{
            ...styles.emailButton,
            marginLeft: '8px',
            backgroundColor: 'var(--amber)'
          }}
        >
          Export as MD
        </button>
      </div>

      {/* Headline Card */}
      <div style={styles.headlineCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h2 style={styles.headline}>{pulse.headline}</h2>
            <p style={styles.summary}>{pulse.summary}</p>
          </div>
          <div style={{
            backgroundColor: 'var(--faint)',
            color: 'white',
            fontSize: '11px',
            fontWeight: '600',
            padding: '4px 8px',
            borderRadius: '12px',
            fontFamily: '"JetBrains Mono", monospace'
          }}>
            ~{calculateWordCount(pulse.headline + ' ' + pulse.summary)} words
          </div>
        </div>
        <div style={styles.meta}>
          <span>{weekLabel}</span>
          <span>•</span>
          <span>{totalReviews.toLocaleString()} reviews</span>
          <span>•</span>
          <span>{avgRating.toFixed(1)}⭐ avg</span>
        </div>
      </div>

      {/* Theme Cards */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Key Themes</h3>
        <div style={styles.themeCards}>
          {pulse.themes.map((theme, index) => (
            <div 
              key={index} 
              style={{
                ...styles.themeCard,
                borderLeftColor: getSentimentColor(theme.sentiment)
              }}
            >
              <h4 style={styles.themeName}>{theme.name}</h4>
              <p style={styles.themeInsight}>{theme.insight}</p>
              <span 
                style={{
                  ...styles.sentimentBadge,
                  backgroundColor: getSentimentColor(theme.sentiment)
                }}
              >
                {theme.sentiment}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quote Cards */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>User Feedback</h3>
        <div style={styles.quoteCards}>
          {pulse.quotes.map((quote, index) => (
            <div style={styles.quoteCard}>
              <div style={styles.quoteMark}>"</div>
              <div style={styles.quoteHeader}>
                <span style={styles.quoteRating}>
                  {renderStars(quote.rating)}
                </span>
                <span style={styles.quoteTheme}>
                  {themeCounts.find(t => t.id === quote.themeId)?.label || 'Unknown'}
                </span>
              </div>
              <p style={styles.quoteText}>"{quote.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Cards */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Recommended Actions</h3>
        <div style={styles.actionCards}>
          {pulse.actions.map((action, index) => (
            <div key={index} style={styles.actionCard}>
              <div style={styles.actionHeader}>
                <h4 style={styles.actionTitle}>{action.title}</h4>
                <div style={styles.actionBadges}>
                  <span 
                    style={{
                      ...styles.priorityBadge,
                      backgroundColor: getPriorityColor(action.priority)
                    }}
                  >
                    {action.priority}
                  </span>
                  <span style={styles.ownerBadge}>{action.owner}</span>
                </div>
              </div>
              <p style={styles.actionDetail}>{action.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
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
    height: '48px',
  },
  emailButton: {
    padding: '12px 24px',
    backgroundColor: 'var(--navy)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    height: '48px',
  },
  headlineCard: {
    backgroundColor: 'var(--navy)',
    color: 'white',
    padding: '32px',
    borderRadius: '16px',
    marginBottom: '30px',
  },
  headline: {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 16px 0',
    fontFamily: 'Georgia, serif',
  },
  summary: {
    fontSize: '16px',
    lineHeight: '1.5',
    margin: '0 0 20px 0',
    opacity: 0.9,
  },
  meta: {
    fontSize: '14px',
    opacity: 0.8,
    display: 'flex',
    gap: '8px',
  },
  section: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text)',
    marginBottom: '20px',
  },
  themeCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  themeCard: {
    backgroundColor: 'var(--surface)',
    padding: '18px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
  },
  themeName: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text)',
    margin: '0 0 12px 0',
  },
  themeInsight: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--muted)',
    margin: '0 0 16px 0',
  },
  sentimentBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    color: 'white',
    fontSize: '9px',
    fontWeight: '600',
    borderRadius: '12px',
    textTransform: 'uppercase',
    fontFamily: '"JetBrains Mono", monospace',
  },
  quoteCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  quoteCard: {
    backgroundColor: 'var(--surface)',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    position: 'relative',
  },
  quoteMark: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    fontSize: '48px',
    color: 'var(--border)',
    fontFamily: 'Georgia, serif',
    opacity: 0.3,
  },
  quoteHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  quoteRating: {
    fontSize: '14px',
  },
  quoteTheme: {
    fontSize: '12px',
    color: 'var(--muted)',
    fontWeight: '500',
  },
  quoteText: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--text)',
    margin: '0',
    fontStyle: 'italic',
    paddingLeft: '20px',
  },
  actionCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
  },
  actionCard: {
    backgroundColor: 'var(--surface)',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    position: 'relative',
  },
  actionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  actionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text)',
    margin: '0',
    flex: '1',
  },
  actionBadges: {
    display: 'flex',
    gap: '8px',
    marginLeft: '12px',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  priorityBadge: {
    display: 'inline-block',
    padding: '6px 10px',
    color: 'white',
    fontSize: '10px',
    fontWeight: '600',
    borderRadius: '6px',
    textTransform: 'uppercase',
    fontFamily: '"JetBrains Mono", monospace',
  },
  ownerBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: 'var(--faint)',
    color: 'var(--text)',
    fontSize: '10px',
    fontWeight: '500',
    borderRadius: '12px',
  },
  actionDetail: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--muted)',
    margin: '0',
  },
};

export default PulseView;
