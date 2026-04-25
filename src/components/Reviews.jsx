import React, { useState, useMemo } from 'react';

const Reviews = ({ reviews, isMobile }) => {
  // Null check for reviews
  if (!reviews || reviews.length === 0) return (
    <div style={{padding: 40, textAlign: 'center', color: '#888'}}>
      Loading reviews...
    </div>
  );

  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  // Console log to verify themes
  console.log('First review theme:', reviews[0]?.theme);

  // Filter reviews based on sentiment
  const filteredReviews = useMemo(() => {
    switch (activeFilter) {
      case 'positive':
        return reviews.filter(review => (review.rating || 0) >= 4);
      case 'neutral':
        return reviews.filter(review => (review.rating || 0) === 3);
      case 'negative':
        return reviews.filter(review => (review.rating || 0) <= 2);
      default:
        return reviews;
    }
  }, [activeFilter, reviews]);

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + reviewsPerPage);

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getThemeColor = (themeId) => {
    const colors = {
      'kyc-onboarding': '#EF4444',
      'payments-sip': '#F59E0B',
      'withdrawals': '#10B981',
      'statements-tax': '#3B82F6',
      'app-ux-support': '#8B5CF6'
    };
    return colors[themeId] || '#6B7280';
  };

  const getThemeLabel = (themeId) => {
    const labels = {
      'kyc-onboarding': 'KYC & Onboarding',
      'payments-sip': 'Payments & SIP',
      'withdrawals': 'Withdrawals',
      'statements-tax': 'Statements & Tax',
      'app-ux-support': 'App UX & Support'
    };
    return labels[themeId] || 'Unknown';
  };

  function handleDownloadCSV() {
    const headers = 'Rating,Review,Date,Source,Theme';
    const rows = reviews.map(r => {
      const text = (r.text || '').replace(/"/g, "'");
      const theme = r.theme?.label || r.theme?.id || 'Unknown';
      return `${r.rating},"${text}",${r.date},${r.platform},"${theme}"`;
    });
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'groww_reviews_classified.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1a1a2e',
          margin: 0
        }}>
          Reviews
        </h1>
        <button
          onClick={handleDownloadCSV}
          style={{
            padding: '10px 16px',
            backgroundColor: '#1a1a2e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>📥</span>
          Download CSV
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        backgroundColor: '#F3F4F6',
        padding: '4px',
        borderRadius: '8px',
        width: 'fit-content',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {[
          { id: 'all', label: 'All Reviews', count: reviews.length },
          { id: 'positive', label: 'Positive', count: reviews.filter(r => r.rating >= 4).length },
          { id: 'neutral', label: 'Neutral', count: reviews.filter(r => r.rating === 3).length },
          { id: 'negative', label: 'Negative', count: reviews.filter(r => r.rating <= 2).length }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => {
              setActiveFilter(filter.id);
              setCurrentPage(1);
            }}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: activeFilter === filter.id ? 'white' : 'transparent',
              color: activeFilter === filter.id ? '#1a1a2e' : '#6B7280',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: activeFilter === filter.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{filter.label}</span>
            <span style={{
              backgroundColor: activeFilter === filter.id ? '#E5E7EB' : '#D1D5DB',
              color: activeFilter === filter.id ? '#374151' : '#6B7280',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #E5E7EB',
        overflow: 'hidden'
      }}>
        <div style={{
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{
                  padding: isMobile ? '10px 8px' : '16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Rating
                </th>
                <th style={{
                  padding: isMobile ? '10px 8px' : '16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Review
                </th>
                <th style={{
                  padding: isMobile ? '10px 8px' : '16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: isMobile ? 'none' : 'table-cell'
                }}>
                  Date
                </th>
                <th style={{
                  padding: isMobile ? '10px 8px' : '16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  display: isMobile ? 'none' : 'table-cell'
                }}>
                  Source
                </th>
                <th style={{
                  padding: isMobile ? '10px 8px' : '16px',
                  textAlign: 'left',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Theme
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedReviews?.map((review, index) => {
                try {
                  return (
                    <tr
                      key={review.id || index}
                      style={{
                        borderBottom: index < paginatedReviews.length - 1 ? '1px solid #F3F4F6' : 'none',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#F9FAFB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      <td style={{ padding: isMobile ? '10px 8px' : '16px' }}>
                        <div style={{ fontSize: '14px' }}>
                          {renderStars(review.rating || 0)}
                        </div>
                      </td>
                  <td style={{ padding: isMobile ? '10px 8px' : '16px' }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#374151',
                      lineHeight: '1.5',
                      maxWidth: '400px'
                    }}>
                      {truncateText(review.text)}
                    </div>
                  </td>
                  <td style={{ 
                    padding: isMobile ? '10px 8px' : '16px',
                    display: isMobile ? 'none' : 'table-cell'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#6B7280'
                    }}>
                      {review.date}
                    </div>
                  </td>
                  <td style={{ 
                    padding: isMobile ? '10px 8px' : '16px',
                    display: isMobile ? 'none' : 'table-cell'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: '#6B7280'
                    }}>
                      {(review.platform === 'Android' ? 'Play Store' : 'App Store')}
                    </div>
                  </td>
                  <td style={{ padding: isMobile ? '10px 8px' : '16px' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: 'white',
                      backgroundColor: getThemeColor(review.theme?.id)
                    }}>
                      {review.theme?.label || review.theme?.id}
                    </div>
                  </td>
                </tr>
              );
            } catch(e) {
              console.error('Row error:', e, review);
              return null;
            }
          })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            padding: isMobile ? '10px 8px' : '16px',
            borderTop: '1px solid #E5E7EB'
          }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                backgroundColor: currentPage === 1 ? '#F9FAFB' : 'white',
                color: currentPage === 1 ? '#D1D5DB' : '#374151',
                fontSize: '14px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '8px 12px',
                  border: currentPage === page ? '1px solid #1a1a2e' : '1px solid #E5E7EB',
                  borderRadius: '6px',
                  backgroundColor: currentPage === page ? '#1a1a2e' : 'white',
                  color: currentPage === page ? 'white' : '#374151',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                backgroundColor: currentPage === totalPages ? '#F9FAFB' : 'white',
                color: currentPage === totalPages ? '#D1D5DB' : '#374151',
                fontSize: '14px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
