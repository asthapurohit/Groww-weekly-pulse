import React from 'react';
import { THEMES } from '../data/reviews';

function ThemeBreakdown({ themeCounts, total }) {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Theme Breakdown</h3>
      {themeCounts.map((theme) => {
        const percentage = total > 0 ? (theme.count / total) * 100 : 0;
        
        return (
          <div key={theme.id} style={styles.themeRow}>
            <div style={styles.themeInfo}>
              <span style={styles.themeIcon}>{theme.icon}</span>
              <span style={styles.themeName}>{theme.label}</span>
            </div>
            
            <div style={styles.themeStats}>
              <div style={styles.countAndRating}>
                <span style={styles.count}>{theme.count}</span>
                <span style={styles.rating}>{theme.avgRating.toFixed(1)}⭐</span>
              </div>
              
              <div style={styles.progressBar}>
                <div 
                  style={{
                    ...styles.progressFill,
                    width: `${percentage}%`,
                    backgroundColor: theme.color,
                  }}
                />
              </div>
              
              <div style={styles.percentage}>
                {Math.round(percentage)}%
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Theme Legend */}
      <div style={{
        marginTop: '24px',
        padding: '16px',
        backgroundColor: 'var(--surface)',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '12px',
          fontFamily: '"JetBrains Mono", monospace'
        }}>
          Theme Legend
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {THEMES.map(theme => (
            <div key={theme.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px'
            }}>
              <span style={{ fontSize: '16px' }}>{theme.icon}</span>
              <span style={{ color: 'var(--text)' }}>{theme.label}</span>
              <span style={{
                color: 'var(--muted)',
                fontSize: '11px',
                fontFamily: '"JetBrains Mono", monospace'
              }}>
                ({theme.keywords.join(', ')})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'var(--surface)',
    padding: '24px',
    borderRadius: '14px',
    border: '1px solid var(--border)',
    marginBottom: '30px',
  },
  title: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--faint)',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '20px',
    marginTop: '0',
    fontFamily: '"JetBrains Mono", monospace',
  },
  themeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)',
  },
  themeInfo: {
    display: 'flex',
    alignItems: 'center',
    flex: '1',
  },
  themeIcon: {
    fontSize: '28px',
    marginRight: '12px',
  },
  themeName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text)',
  },
  themeStats: {
    display: 'flex',
    alignItems: 'center',
    flex: '2',
    gap: '16px',
  },
  countAndRating: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: '60px',
  },
  count: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--faint)',
    fontFamily: '"JetBrains Mono", monospace',
  },
  rating: {
    fontSize: '12px',
    color: 'var(--muted)',
  },
  progressBar: {
    flex: '1',
    height: '6px',
    backgroundColor: '#F0EBE3',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  percentage: {
    fontSize: '11px',
    color: 'var(--faint)',
    fontFamily: '"JetBrains Mono", monospace',
    minWidth: '35px',
    textAlign: 'right',
  },
};

export default ThemeBreakdown;
