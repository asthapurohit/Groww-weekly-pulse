import React from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatsBar from './StatsBar';

const Dashboard = ({ processedReviews, themeCounts, totalReviews, analysedCount, avgRating, negativeCount, isMobile, lastUpdated }) => {
  // Fake trend data for 8 weeks
  const trendData = [
    { week: 'W1', kyc: 12, payments: 8, withdrawals: 5 },
    { week: 'W2', kyc: 15, payments: 10, withdrawals: 7 },
    { week: 'W3', kyc: 18, payments: 12, withdrawals: 6 },
    { week: 'W4', kyc: 14, payments: 15, withdrawals: 9 },
    { week: 'W5', kyc: 20, payments: 11, withdrawals: 8 },
    { week: 'W6', kyc: 16, payments: 13, withdrawals: 10 },
    { week: 'W7', kyc: 22, payments: 9, withdrawals: 7 },
    { week: 'W8', kyc: 19, payments: 14, withdrawals: 11 }
  ];

  // Sentiment data
  const sentimentData = [
    { name: 'Positive', value: 35, color: '#10B981' },
    { name: 'Neutral', value: 25, color: '#F59E0B' },
    { name: 'Negative', value: 40, color: '#EF4444' }
  ];

  // Top 3 themes data
  const topThemes = themeCounts.slice(0, 3).map((theme, index) => ({
    ...theme,
    percentage: Math.round((theme.count / totalReviews) * 100),
    color: index === 0 ? '#EF4444' : index === 1 ? '#F59E0B' : '#10B981',
    description: index === 0 ? 'KYC verification issues and onboarding problems' : 
                 index === 1 ? 'Payment processing and transaction failures' :
                 'Withdrawal delays and fund transfer issues'
  }));

  const StatCard = ({ title, value, icon, color }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: isMobile ? '14px' : '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #E5E7EB'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <span style={{
          fontSize: '14px',
          color: '#6B7280',
          fontWeight: '500'
        }}>
          {title}
        </span>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <div style={{
        fontSize: '32px',
        fontWeight: '700',
        color: color || '#1a1a2e',
        marginBottom: '4px'
      }}>
        {value}
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1a1a2e',
          margin: 0
        }}>
          Dashboard
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
          fontSize: '14px',
          color: '#374151'
        }}>
          <span>📅</span>
          <span>Apr 14 – Apr 20, 2025</span>
        </div>
      </div>

      {/* Stats Bar */}
      <StatsBar 
        total={totalReviews} 
        analysed={analysedCount}
        avgRating={avgRating} 
        negativeCount={negativeCount} 
      />

      {/* Top 3 Themes */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a2e',
          marginBottom: '16px'
        }}>
          Top 3 Themes This Week
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: '20px'
        }}>
          {topThemes.map((theme, index) => (
            <div key={theme.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #E5E7EB'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: theme.color
                }} />
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a2e',
                  margin: 0
                }}>
                  {theme.label}
                </h3>
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: theme.color,
                marginBottom: '4px'
              }}>
                {theme.percentage}%
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '8px'
              }}>
                {theme.count} reviews
              </div>
              <div style={{
                fontSize: '12px',
                color: '#9CA3AF',
                lineHeight: '1.4'
              }}>
                {theme.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
        gap: '20px'
      }}>
        {/* Trend Over Time */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: isMobile ? '14px' : '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a2e',
            marginBottom: '20px'
          }}>
            Trend Over Time
          </h2>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="week" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="kyc" stroke="#EF4444" strokeWidth={2} name="KYC" />
              <Line type="monotone" dataKey="payments" stroke="#F59E0B" strokeWidth={2} name="Payments" />
              <Line type="monotone" dataKey="withdrawals" stroke="#10B981" strokeWidth={2} name="Withdrawals" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Overview */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: isMobile ? '14px' : '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a2e',
            marginBottom: '20px'
          }}>
            Sentiment Overview
          </h2>
          <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '16px'
          }}>
            {sentimentData.map((item) => (
              <div key={item.name} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '2px',
                  backgroundColor: item.color
                }} />
                <span style={{ color: '#374151' }}>{item.name}</span>
                <span style={{ color: '#6B7280', marginLeft: 'auto' }}>
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {lastUpdated && (
        <div style={{fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace', textAlign: 'center', marginTop: '20px'}}>
          Last scraped: {lastUpdated}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
