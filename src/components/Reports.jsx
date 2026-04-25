import React from 'react';

const Reports = () => {
  // Fake previous reports data
  const previousReports = [
    {
      name: 'Weekly Pulse - Apr 7-13, 2025',
      date: '2025-04-14',
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      name: 'Reviews Data Export - Q1 2025',
      date: '2025-04-01',
      format: 'CSV',
      size: '8.7 MB'
    },
    {
      name: 'Full Analysis Report - March 2025',
      date: '2025-04-01',
      format: 'DOCX',
      size: '5.2 MB'
    }
  ];

  const exportCards = [
    {
      id: 'weekly-pulse',
      title: 'Export Weekly Pulse',
      description: 'Download the AI-generated weekly insights report as PDF',
      icon: '📊',
      color: '#3B82F6',
      format: 'PDF'
    },
    {
      id: 'reviews-data',
      title: 'Export Reviews Data',
      description: 'Download all reviews data with themes and sentiment analysis',
      icon: '📥',
      color: '#10B981',
      format: 'CSV'
    },
    {
      id: 'full-report',
      title: 'Export Full Report',
      description: 'Comprehensive report with all analytics, charts, and insights',
      icon: '📋',
      color: '#F59E0B',
      format: 'DOCX'
    }
  ];

  const handleExport = (type) => {
    // Create fake download for demo purposes
    const content = {
      'weekly-pulse': 'Weekly Pulse Report Content',
      'reviews-data': 'Reviews Data CSV Content',
      'full-report': 'Full Report Content'
    };

    const blob = new Blob([content[type]], { 
      type: type === 'reviews-data' ? 'text/csv' : 'text/plain' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export_${type}_${new Date().toISOString().split('T')[0]}.${type === 'reviews-data' ? 'csv' : 'txt'}`;
    link.click();
  };

  const handleDownloadPrevious = (report) => {
    // Fake download for previous reports
    alert(`Downloading: ${report.name}`);
  };

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
          Reports
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

      {/* Export Cards */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a2e',
          marginBottom: '24px'
        }}>
          Export Reports
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {exportCards.map((card) => (
            <div key={card.id} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '32px 24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              border: '1px solid #E5E7EB',
              textAlign: 'center',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: `${card.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '32px'
            }}>
              {card.icon}
            </div>
            
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1a1a2e',
              marginBottom: '12px'
            }}>
              {card.title}
            </h3>
            
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              lineHeight: '1.5',
              marginBottom: '24px',
              minHeight: '48px'
            }}>
              {card.description}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '20px',
              fontSize: '12px',
              color: '#6B7280',
              fontWeight: '500'
            }}>
              <span>Format:</span>
              <span style={{
                backgroundColor: '#F3F4F6',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: '600'
              }}>
                {card.format}
              </span>
            </div>
            
            <button
              onClick={() => handleExport(card.id)}
              style={{
                width: '100%',
                padding: '12px 20px',
                backgroundColor: card.color,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = card.color + 'DD';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = card.color;
              }}
            >
              <span>⬇️</span>
              Download
            </button>
          </div>
        ))}
        </div>
      </div>

      {/* Previous Reports */}
      <div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1a1a2e',
          marginBottom: '24px'
        }}>
          Previous Reports
        </h2>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Report Name
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Date
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Format
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'left',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Size
                  </th>
                  <th style={{
                    padding: '16px 24px',
                    textAlign: 'center',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6B7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Download
                  </th>
                </tr>
              </thead>
              <tbody>
                {previousReports.map((report, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: index < previousReports.length - 1 ? '1px solid #F3F4F6' : 'none',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{
                        fontSize: '14px',
                        color: '#374151',
                        fontWeight: '500'
                      }}>
                        {report.name}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{
                        fontSize: '14px',
                        color: '#6B7280'
                      }}>
                        {report.date}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: '#F3F4F6',
                        color: '#374151'
                      }}>
                        {report.format}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{
                        fontSize: '14px',
                        color: '#6B7280'
                      }}>
                        {report.size}
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDownloadPrevious(report)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#1a1a2e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#374151';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#1a1a2e';
                        }}
                      >
                        <span>⬇️</span>
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
