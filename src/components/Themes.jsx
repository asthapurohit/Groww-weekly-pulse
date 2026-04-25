import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const themeDescriptions = {
  'kyc-onboarding': 'Reviews about account creation, KYC verification, login issues, and document upload problems.',
  'payments-sip': 'Reviews about SIP setup, payment failures, UPI issues, trading charges, and transaction problems.',
  'withdrawals': 'Reviews about withdrawal delays, redemption failures, refund issues, and money transfer problems.',
  'statements-tax': 'Reviews about statement downloads, tax filing, P&L accuracy, capital gains reports.',
  'app-ux-support': 'Reviews about app performance, crashes, UI design, customer support quality, and general feedback.'
};

const Themes = ({ themeCounts, totalReviews, processedReviews, isMobile }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  const chartData = (themeCounts || []).map(theme => ({
    id: theme.id,
    name: theme.label,
    value: theme.count,
    percentage: Math.round((theme.count / totalReviews) * 100),
    color: theme.color
  }));

  const themeDetails = useMemo(() => {
    if (!selectedTheme) return null;

    const theme = (themeCounts || []).find(t => t.id === selectedTheme);
    if (!theme) return null;

    const themeReviews = (processedReviews || []).filter(r => r.theme?.id === selectedTheme);
    const negativeReviews = themeReviews.filter(r => r.rating <= 2);
    const positiveReviews = themeReviews.filter(r => r.rating >= 4);
    const avgR = themeReviews.length
      ? (themeReviews.reduce((s, r) => s + r.rating, 0) / themeReviews.length).toFixed(1)
      : '0.0';

    return {
      ...theme,
      description: themeDescriptions[selectedTheme] || 'Theme description not available.',
      themeReviews,
      negativeReviews,
      positiveReviews,
      reviewCount: themeReviews.length,
      avgRating: avgR
    };
  }, [selectedTheme, themeCounts, processedReviews]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'white', padding: '8px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{data.name}</div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>{data.value} reviews ({data.percentage}%)</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e', margin: 0 }}>Themes</h1>
        <div style={{ padding: '10px 16px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', color: '#374151' }}>
          📅 Apr 11 – Apr 23, 2026
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>

        {/* Left: Donut Chart */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', border: '1px solid #E5E7EB' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '24px', textAlign: 'center' }}>
            Theme Distribution
          </h2>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={120}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                    style={{ cursor: 'pointer', outline: 'none' }}
                    onClick={() => setSelectedTheme(entry.id)}
                    opacity={selectedTheme && selectedTheme !== entry.id ? 0.5 : 1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
            {chartData.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedTheme(item.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  cursor: 'pointer', padding: '6px 10px', borderRadius: '6px',
                  backgroundColor: selectedTheme === item.id ? '#F3F4F6' : 'transparent',
                  border: selectedTheme === item.id ? `1px solid ${item.color}` : '1px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#374151', fontWeight: selectedTheme === item.id ? '600' : '400' }}>{item.name}</span>
                <span style={{ fontSize: '12px', color: item.color, fontWeight: '600' }}>{item.percentage}%</span>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#9CA3AF', marginTop: '16px' }}>
            Click a slice or label to see details →
          </p>
        </div>

        {/* Right: Theme Details */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '28px', border: '1px solid #E5E7EB', overflowY: 'auto', maxHeight: '680px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '20px' }}>Theme Details</h2>

          {!themeDetails ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <p style={{ fontSize: '15px', margin: 0 }}>Select a theme from the chart to view detailed information</p>
            </div>
          ) : (
            <div>
              {/* Theme header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '10px', borderLeft: `4px solid ${themeDetails.color}` }}>
                <span style={{ fontSize: '28px' }}>{themeDetails.icon}</span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a2e' }}>{themeDetails.label}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{themeDetails.reviewCount} reviews</div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '20px' }}>
                {[
                  { label: 'Total', value: themeDetails.reviewCount, color: '#3B82F6' },
                  { label: 'Avg Rating', value: `${themeDetails.avgRating}⭐`, color: '#F59E0B' },
                  { label: 'Negative', value: themeDetails.negativeReviews.length, color: '#EF4444' }
                ].map(s => (
                  <div key={s.label} style={{ textAlign: 'center', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* About */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '6px' }}>About this theme</h4>
                <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.6', margin: 0 }}>{themeDetails.description}</p>
              </div>

              {/* Top Issues */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '10px' }}>
                  Top Issues ({themeDetails.negativeReviews.length} negative reviews)
                </h4>
                {themeDetails.negativeReviews.length === 0 ? (
                  <div style={{ padding: '12px', backgroundColor: '#F0FDF4', borderRadius: '6px', border: '1px solid #DCFCE7', textAlign: 'center', color: '#16A34A', fontSize: '13px' }}>
                    ✅ No major issues for this theme
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {themeDetails.negativeReviews.slice(0, 3).map((r, i) => (
                      <div key={i} style={{ padding: '10px 12px', backgroundColor: '#FEF2F2', borderRadius: '6px', border: '1px solid #FECACA' }}>
                        <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: '600', marginBottom: '4px' }}>⭐{r.rating} · {r.date} · {r.platform}</div>
                        <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.4', margin: 0 }}>
                          {(r.text || '').substring(0, 100)}{r.text?.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Positive Highlights */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '10px' }}>
                  Positive Highlights ({themeDetails.positiveReviews.length} positive reviews)
                </h4>
                {themeDetails.positiveReviews.length === 0 ? (
                  <div style={{ padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '6px', border: '1px solid #E5E7EB', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
                    No positive reviews for this theme
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {themeDetails.positiveReviews.slice(0, 2).map((r, i) => (
                      <div key={i} style={{ padding: '10px 12px', backgroundColor: '#F0FDF4', borderRadius: '6px', border: '1px solid #DCFCE7' }}>
                        <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: '600', marginBottom: '4px' }}>⭐{r.rating} · {r.date} · {r.platform}</div>
                        <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.4', margin: 0 }}>
                          {(r.text || '').substring(0, 100)}{r.text?.length > 100 ? '...' : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Example Reviews */}
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '10px' }}>Example Reviews</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {themeDetails.themeReviews.slice(0, 3).map((r, i) => (
                    <div key={i} style={{ padding: '14px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>⭐ {r.rating}</span>
                          <span style={{ fontSize: '11px', color: '#6B7280', padding: '2px 6px', backgroundColor: '#F3F4F6', borderRadius: '4px' }}>
                            {r.platform === 'Android' ? 'Play Store' : 'App Store'}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{r.date}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5', margin: 0 }}>{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Themes;