import React from 'react';

const WeeklyPulse = ({ 
  pulseData, 
  loading, 
  progress, 
  themeCounts, 
  processedReviews, 
  totalReviews, 
  avgRating,
  negativeCount,
  weekLabel,
  onGeneratePulse,
  onExportPDF,
  onEmail,
  error,
  isMobile 
}) => {

  if (loading) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Weekly Pulse</h1>
          <div style={{ padding: '10px 16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', color: '#374151' }}>
            📅 {weekLabel || 'Apr 11 – Apr 23, 2026'}
          </div>
        </div>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '60px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', border: '4px solid #E5E7EB', borderTop: '4px solid #1a1a2e', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>Generating Weekly Pulse...</h2>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '24px' }}>Analyzing {totalReviews} reviews with Groq AI</p>
          <div style={{ width: '300px', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', margin: '0 auto 12px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#1a1a2e', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ fontSize: '14px', color: '#6B7280' }}>{progress}% Complete</div>
        </div>
      </div>
    );
  }

  if (!pulseData) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Weekly Pulse</h1>
          <div style={{ padding: '10px 16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', color: '#374151' }}>
            📅 {weekLabel || 'Apr 11 – Apr 23, 2026'}
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '12px 20px', marginBottom: '24px', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '80px 60px', border: '1px solid #E5E7EB', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '24px' }}>📈</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a2e', marginBottom: '12px' }}>Generate Weekly Pulse</h2>
          <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px', lineHeight: '1.6' }}>
            Get AI-powered insights from {totalReviews} real reviews — top themes, user quotes, and recommended actions.
          </p>
          <button
            onClick={() => {
              console.log('Generate button clicked, onGeneratePulse:', typeof onGeneratePulse);
              if (onGeneratePulse) onGeneratePulse();
              else console.error('onGeneratePulse prop is missing!');
            }}
            style={{ padding: '16px 40px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '12px' }}
          >
            ✨ Generate Weekly Pulse Note
          </button>
          <div style={{ marginTop: '16px', fontSize: '12px', color: '#9CA3AF' }}>Powered by Groq · llama-3.3-70b</div>
        </div>
      </div>
    );
  }

  // Pulse data available — show results
  const topThemes = (themeCounts || []).slice(0, 3).map((theme, index) => ({
    rank: index + 1,
    name: theme.label,
    percentage: Math.round((theme.count / totalReviews) * 100),
    count: theme.count,
    color: index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : '#10B981'
  }));

  const topQuotes = (pulseData.quotes || []).slice(0, 3).map(quote => ({
    text: quote.text,
    rating: quote.rating,
    theme: (themeCounts || []).find(t => t.id === quote.themeId)?.label || 'General',
    color: (themeCounts || []).find(t => t.id === quote.themeId)?.color || '#6B7280'
  }));

  const topActions = (pulseData.actions || []).slice(0, 3).map((action, index) => ({
    ...action,
    icon: index === 0 ? '🚨' : index === 1 ? '⚠️' : '💡',
    priorityColor: action.priority === 'P0' ? '#EF4444' : action.priority === 'P1' ? '#F59E0B' : '#10B981'
  }));

  const handleExportMD = () => {
    const md = `# Groww Weekly Review Pulse\n**Week:** ${weekLabel}\n\n## Headline\n${pulseData.headline}\n\n## Summary\n${pulseData.summary}\n\n## Top Themes\n${pulseData.themes?.map(t => `- **${t.name}**: ${t.insight} *(${t.sentiment})*`).join('\n')}\n\n## User Quotes\n${pulseData.quotes?.map(q => `> "${q.text}" — ⭐${q.rating}`).join('\n\n')}\n\n## Recommended Actions\n${pulseData.actions?.map(a => `- **[${a.priority}] ${a.title}** (${a.owner}): ${a.detail}`).join('\n')}\n\n---\n*Generated ${new Date().toLocaleDateString()} · ${totalReviews} reviews · Groww Review Intelligence*`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'groww_weekly_pulse.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Weekly Pulse</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ padding: '10px 16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', color: '#374151' }}>
            📅 {weekLabel || 'Apr 11 – Apr 23, 2026'}
          </div>
          <button onClick={handleExportMD} style={{ padding: '10px 16px', backgroundColor: 'white', color: '#1a1a2e', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            📄 Export MD
          </button>
          <button onClick={onExportPDF} style={{ padding: '10px 16px', backgroundColor: 'white', color: '#1a1a2e', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
            🖨️ Export PDF
          </button>
        </div>
      </div>

      {/* Headline card */}
      <div style={{ backgroundColor: '#1a1a2e', color: 'white', padding: isMobile ? '20px 16px' : '32px', borderRadius: '12px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: '700', margin: '0 0 12px 0', fontFamily: 'Georgia, serif' }}>{pulseData.headline}</h2>
        <p style={{ fontSize: isMobile ? '13px' : '15px', lineHeight: '1.6', margin: '0 0 20px 0', opacity: 0.85 }}>{pulseData.summary}</p>
        <div style={{ display: 'flex', gap: '20px', fontSize: '13px', opacity: 0.7 }}>
          <span>{totalReviews?.toLocaleString()} reviews analyzed</span>
          <span>•</span>
          <span>{parseFloat(avgRating || 0).toFixed(1)} ⭐ avg rating</span>
          <span>•</span>
          <span>Generated {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Two column: Themes + Quotes */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Top Themes */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '20px', margin: '0 0 20px 0' }}>Top Themes (Top 3)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topThemes.map(theme => (
              <div key={theme.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: theme.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>{theme.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{theme.name}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{theme.count} reviews</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: theme.color }}>{theme.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* User Quotes */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 20px 0' }}>User Quotes (Top 3)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topQuotes.map((quote, i) => (
              <div key={i} style={{ padding: '14px', backgroundColor: '#F9FAFB', borderRadius: '8px', borderLeft: `4px solid ${quote.color}`, border: '1px solid #E5E7EB', borderLeftWidth: '4px' }}>
                <div style={{ fontSize: '20px', color: quote.color, lineHeight: 1, marginBottom: '6px' }}>"</div>
                <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5', margin: '0 0 8px 0', fontStyle: 'italic' }}>{quote.text}</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', backgroundColor: quote.color, color: 'white', borderRadius: '4px', fontWeight: '500' }}>{quote.theme}</span>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{'⭐'.repeat(quote.rating || 1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Actions */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #E5E7EB', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e', margin: '0 0 20px 0' }}>Recommended Actions (Top 3)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
          {topActions.map((action, i) => (
            <div key={i} style={{ padding: '20px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>{action.icon}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>{action.title}</h4>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 7px', backgroundColor: action.priorityColor, color: 'white', borderRadius: '4px' }}>{action.priority}</span>
              </div>
              <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5', margin: '0 0 10px 0' }}>{action.detail}</p>
              <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '500' }}>{action.owner}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Insight */}
      <div style={{ backgroundColor: '#EBF8FF', borderRadius: '12px', padding: '20px 24px', border: '1px solid #BEE3F8', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <span style={{ fontSize: '28px' }}>💡</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#2C5282', marginBottom: '4px' }}>Key Insight</div>
          <p style={{ fontSize: '14px', color: '#2C5282', lineHeight: '1.5', margin: 0 }}>{pulseData.summary}</p>
        </div>
      </div>

      {/* Draft Email Button */}
      <button
        onClick={() => {
          console.log('Draft Email clicked, onEmail:', typeof onEmail);
          if (onEmail) onEmail();
          else console.error('onEmail prop is missing!');
        }}
        style={{ width: '100%', padding: '16px', backgroundColor: '#1a1a2e', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}
      >
        ✉️ Draft Email with This Pulse
      </button>
    </div>
  );
};

export default WeeklyPulse;