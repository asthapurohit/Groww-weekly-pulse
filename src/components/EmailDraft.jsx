import React from 'react';
import { generateEmail } from '../services/groq';

const EmailDraft = ({ emailData, loading, onGenerateEmail, onCopyEmail, error, isMobile }) => {
  const sendEmail = () => {
    const subject = encodeURIComponent('Weekly Review Insights - Groww App');
    const body = encodeURIComponent(emailData?.body || '');
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  if (loading) {
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
            Email Draft
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

        {/* Loading State */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '60px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #1a1a2e',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }} />
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a2e',
            marginBottom: '8px'
          }}>
            Generating Email Draft...
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6B7280'
          }}>
            Creating professional email with insights
          </p>
        </div>
      </div>
    );
  }

  if (!emailData) {
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
            Email Draft
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

        {/* Generate Email Button */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '60px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>✉️</div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a2e',
            marginBottom: '12px'
          }}>
            Generate Email Draft
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6B7280',
            marginBottom: '32px',
            maxWidth: '400px',
            margin: '0 auto 32px'
          }}>
            Create a professional email with top themes, user quotes, and recommended actions for the product team.
          </p>
          <button
            onClick={onGenerateEmail}
            style={{
              padding: '16px 32px',
              backgroundColor: '#1a1a2e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <span>📧</span>
            Generate Email Draft
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Error Banner */}
      {error && (
        <div style={{
          backgroundColor: '#FEE2E2',
          color: '#991B1B',
          padding: '12px 20px',
          marginBottom: '24px',
          borderRadius: '8px',
          border: '1px solid #FCA5A5',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <span>{error}</span>
        </div>
      )}

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
          Email Draft
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

      {/* Two Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '3fr 2fr',
        gap: '24px'
      }}>
        {/* Left Column: Email Preview (60%) */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: isMobile ? '20px' : '32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #E5E7EB'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#1a1a2e',
            marginBottom: '24px'
          }}>
            Email Preview
          </h3>
          
          {/* Email Header */}
          <div style={{
            backgroundColor: '#F9FAFB',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{
                fontSize: '12px',
                color: '#6B7280',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                To:
              </span>
              <div style={{
                fontSize: '14px',
                color: '#374151',
                marginTop: '4px'
              }}>
                product-team@groww.in
              </div>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{
                fontSize: '12px',
                color: '#6B7280',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Subject:
              </span>
              <div style={{
                fontSize: '14px',
                color: '#374151',
                marginTop: '4px',
                fontWeight: '600'
              }}>
                Weekly Review Insights - Groww App
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#374151'
          }}>
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {emailData.body || 'Email content will appear here...'}
            </div>
          </div>
        </div>

        {/* Right Column: What's Included (40%) */}
        <div>
          {/* What's Included Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid #E5E7EB'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1a1a2e',
              marginBottom: '20px'
            }}>
              What's included?
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { text: 'Top 3 Themes', checked: true },
                { text: 'Top 3 Quotes', checked: true },
                { text: '3 Recommended Actions', checked: true },
                { text: 'Key Insight', checked: true }
              ].map((item, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#F9FAFB',
                  borderRadius: '6px'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    backgroundColor: item.checked ? '#10B981' : '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {item.checked ? '✓' : ''}
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <button
              onClick={onCopyEmail}
              style={{
                padding: '14px 20px',
                backgroundColor: 'white',
                color: '#1a1a2e',
                border: '2px solid #1a1a2e',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>📋</span>
              Copy
            </button>
            
            <button
              onClick={sendEmail}
              style={{
                padding: '14px 20px',
                backgroundColor: '#10B981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>📧</span>
              Send Email
            </button>
          </div>

          {/* Disclaimer */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#FEF3C7',
            borderRadius: '8px',
            border: '1px solid #FDE68A'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <span style={{ fontSize: '16px', color: '#D97706' }}>⚠️</span>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#92400E',
                  marginBottom: '4px'
                }}>
                  Disclaimer
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#92400E',
                  lineHeight: '1.5'
                }}>
                  This email is auto-generated. Please review before sending.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDraft;
