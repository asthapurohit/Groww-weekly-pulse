import React from 'react';

const Sidebar = ({ activePage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'reviews', label: 'Reviews', icon: '💬' },
    { id: 'themes', label: 'Themes', icon: '🎨' },
    { id: 'pulse', label: 'Weekly Pulse', icon: '📈' },
    { id: 'email', label: 'Email Draft', icon: '✉️' },
    { id: 'reports', label: 'Reports', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div style={{
      width: '220px',
      height: '100vh',
      backgroundColor: 'white',
      borderRight: '1px solid #E5E7EB',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      fontFamily: "'DM Sans', sans-serif"
    }}>
      {/* Logo Section */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid #E5E7EB'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#1a1a2e',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            G
          </div>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#1a1a2e'
            }}>
              Review Insights
            </div>
            <div style={{
              fontSize: '11px',
              color: '#6B7280',
              backgroundColor: '#F3F4F6',
              padding: '2px 6px',
              borderRadius: '4px',
              display: 'inline-block',
              marginTop: '2px'
            }}>
              BETA
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{
        flex: 1,
        padding: '16px 0'
      }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            style={{
              width: 'calc(100% - 16px)',
              margin: '0 8px',
              padding: '12px 16px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activePage === item.id ? '#1a1a2e' : 'transparent',
              color: activePage === item.id ? 'white' : '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (activePage !== item.id) {
                e.target.style.backgroundColor = '#F9FAFB';
              }
            }}
            onMouseLeave={(e) => {
              if (activePage !== item.id) {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Bottom Info */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid #E5E7EB',
        fontSize: '12px',
        color: '#6B7280'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: '600', color: '#374151' }}>Product:</span> Groww
        </div>
        <div>
          <span style={{ fontWeight: '600', color: '#374151' }}>Week:</span> Apr 14-20 2025
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
