import React from 'react';

function StatsBar({ total, analysed, avgRating, negativeCount, isMobile }) {
  const stats = [
    { icon: "📱", value: total.toLocaleString(), label: "Reviews Scraped", sub: "App Store + Play Store" },
    { icon: "🔍", value: analysed.toLocaleString(), label: "Reviews Analysed", sub: "with written text" },
    { icon: "⭐", value: `${parseFloat(avgRating).toFixed(1)}`, label: "Avg Rating", sub: "across all themes" },
    { icon: "🔴", value: negativeCount, label: "Needs Attention", sub: "rated 1–2 stars" },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      marginBottom: '30px',
      flexWrap: 'wrap',
      gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)'
    }}>
      {stats.map((stat, index) => (
        <div key={index} style={{
          flex: 1,
          minWidth: '200px',
          backgroundColor: 'var(--surface)',
          padding: isMobile ? '14px 12px' : '20px 16px',
          borderRadius: '14px',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          textAlign: 'center',
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px',
            fontSize: '20px',
            color: 'white',
            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index]
          }}>{stat.icon}</div>
          <div style={{
            fontSize: isMobile ? '22px' : '32px',
            fontWeight: '800',
            color: 'var(--text)',
            marginBottom: '8px',
          }}>{stat.value}</div>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '4px',
          }}>{stat.label}</div>
          <div style={{
            fontSize: '11px',
            color: 'var(--faint)',
            fontFamily: "'JetBrains Mono', monospace",
          }}>{stat.sub}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '200px',
    backgroundColor: 'var(--surface)',
    padding: '20px',
    borderRadius: '14px',
    border: '1px solid var(--border)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    textAlign: 'center',
  },
  iconPill: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
    fontSize: '20px',
    color: 'white',
  },
  totalIcon: {
    backgroundColor: 'var(--green)',
  },
  avgIcon: {
    backgroundColor: 'var(--amber)',
  },
  negativeIcon: {
    backgroundColor: 'var(--red)',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--text)',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '4px',
  },
  statSub: {
    fontSize: '11px',
    color: 'var(--faint)',
    fontFamily: "'JetBrains Mono', monospace",
  },
  icon0: {
    backgroundColor: 'var(--blue)',
  },
  icon1: {
    backgroundColor: 'var(--green)',
  },
  icon2: {
    backgroundColor: 'var(--amber)',
  },
  icon3: {
    backgroundColor: 'var(--red)',
  },
};

export default StatsBar;
