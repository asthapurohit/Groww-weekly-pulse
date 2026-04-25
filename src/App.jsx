import React, { useState, useEffect } from 'react';

// Data imports
import { loadReviews, THEMES, assignTheme, WEEK_LABEL } from './data/reviews';

// Service imports
import { generatePulse, generateEmail } from './services/gemini';

// Component imports
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Reviews from './components/Reviews';
import Themes from './components/Themes';
import WeeklyPulse from './components/WeeklyPulse';
import EmailDraft from './components/EmailDraft';
import Reports from './components/Reports';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activePage, setActivePage] = useState('dashboard');
  const [currentScreen, setCurrentScreen] = useState('home');
  const [processedReviews, setProcessedReviews] = useState([]);
  const [themeCounts, setThemeCounts] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [negativeCount, setNegativeCount] = useState(0);
  const [analysedCount, setAnalysedCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [pulseData, setPulseData] = useState(null);
  const [emailData, setEmailData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // ── Load reviews once on mount ──────────────────────────────────────────
  useEffect(() => {
    loadReviews()
      .then(({ reviews: rawReviews, totalScraped }) => {
        console.log('totalScraped:', totalScraped);
        console.log('rawReviews length:', rawReviews.length);

        setLoadingStep(0);

        // Keyword-based theme assignment (instant, no API calls)
        setLoadingStep(1);
        const reviewsWithThemes = rawReviews.map(r => ({
          ...r,
          theme: assignTheme(r)
        }));

        setLoadingStep(2);
        const total = reviewsWithThemes.length;
        const avg = (reviewsWithThemes.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);
        const negative = reviewsWithThemes.filter(r => r.rating <= 2).length;

        const themeStats = THEMES.map(theme => {
          const group = reviewsWithThemes.filter(r => r.theme?.id === theme.id);
          const avgR = group.length
            ? (group.reduce((s, r) => s + r.rating, 0) / group.length).toFixed(1)
            : '0.0';
          return { ...theme, count: group.length, avgRating: avgR };
        }).sort((a, b) => b.count - a.count);

        const mostRecent = rawReviews.map(r => r.date).sort().reverse()[0];

        setLoadingStep(3);
        setProcessedReviews(reviewsWithThemes);
        setThemeCounts(themeStats);
        setTotalReviews(totalScraped);
        setAnalysedCount(rawReviews.length);
        setAvgRating(avg);
        setNegativeCount(negative);
        setLastUpdated(mostRecent);
        setDataLoading(false);

        console.log('totalReviews:', totalScraped);
        console.log('avgRating:', avg);
        console.log('negativeCount:', negative);
        console.log('themeStats:', themeStats);
      })
      .catch(err => {
        console.error('Load error:', err);
        setError('Failed to load: ' + err.message);
        setDataLoading(false);
      });
  }, []);

  // ── Generate Pulse ──────────────────────────────────────────────────────
  const handleGeneratePulse = async () => {
    try {
      setError(null);
      setLoading(true);
      setProgress(0);

      const progressInterval = setInterval(() => {
        setProgress(prev => prev < 88 ? prev + 5 : prev);
      }, 300);

      const top3 = themeCounts.slice(0, 3).map(t => ({
        name: t.label,
        count: t.count,
        avgRating: t.avgRating
      }));

      const sampleReviews = processedReviews
        .filter(r => r.rating <= 2)
        .slice(0, 15);

      const result = await generatePulse({
        topThemes: top3,
        sampleReviews,
        totalReviews: analysedCount,
        avgRating,
        negativeCount,
        weekLabel: WEEK_LABEL
      });

      clearInterval(progressInterval);
      setProgress(100);
      setPulseData(result);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  // ── Generate Email ──────────────────────────────────────────────────────
  const handleGenerateEmail = async () => {
    try {
      setEmailLoading(true);
      setError(null);

      const email = await generateEmail({
        pulse: pulseData,
        totalReviews: analysedCount,
        avgRating,
        negativeCount,
        weekLabel: WEEK_LABEL
      });

      setEmailData(email);
      setEmailLoading(false);
    } catch (err) {
      setEmailLoading(false);
      setError(err.message || 'Failed to generate email');
    }
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page === 'pulse' || page === 'email') {
      setCurrentScreen('home');
    }
  };

  // ── Render pages ────────────────────────────────────────────────────────
  const renderMainContent = () => {
    switch (activePage) {
      case 'dashboard':
        return (
          <Dashboard
            processedReviews={processedReviews}
            themeCounts={themeCounts}
            totalReviews={totalReviews}
            analysedCount={analysedCount}
            avgRating={avgRating}
            negativeCount={negativeCount}
            isMobile={isMobile}
            lastUpdated={lastUpdated}
          />
        );
      case 'reviews':
        return <Reviews reviews={processedReviews} isMobile={isMobile} />;
      case 'themes':
        return (
          <Themes
            themeCounts={themeCounts}
            totalReviews={totalReviews}
            processedReviews={processedReviews}
            isMobile={isMobile}
          />
        );
      case 'pulse':
        return (
          <WeeklyPulse
            pulseData={pulseData}
            loading={loading}
            progress={progress}
            themeCounts={themeCounts}
            processedReviews={processedReviews}
            totalReviews={analysedCount}
            avgRating={avgRating}
            negativeCount={negativeCount}
            weekLabel={WEEK_LABEL}
            error={error}
            onGeneratePulse={handleGeneratePulse}
            onExportPDF={() => window.print()}
            onEmail={() => {
              handleGenerateEmail();
              setActivePage('email');
            }}
            isMobile={isMobile}
          />
        );
      case 'email':
        return (
          <EmailDraft
            emailData={emailData}
            loading={emailLoading}
            onGenerateEmail={handleGenerateEmail}
            onCopyEmail={() => {
              if (emailData?.body) navigator.clipboard.writeText(emailData.body);
            }}
            error={error}
            isMobile={isMobile}
          />
        );
      case 'reports':
        return <Reports isMobile={isMobile} />;
      case 'settings':
        return (
          <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ color: '#1a1a2e', marginBottom: '16px' }}>Settings</h2>
            <p style={{ color: '#6B7280' }}>Settings page coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  // ── Loading screen ──────────────────────────────────────────────────────
  if (dataLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#F4F6FA', gap: 20 }}>
      <div style={{ fontSize: 56 }}>📊</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Groww · Review Intelligence</div>
        <div style={{ fontSize: 14, color: '#666' }}>Loading 1,499 real reviews from App Store + Play Store</div>
      </div>
      <div style={{ width: 320, height: 6, background: '#E2D9CE', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#1a1a2e', borderRadius: 3, animation: 'loadingBar 3s ease-in-out infinite' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        {[
          { icon: '📥', text: 'Importing reviews from CSV...' },
          { icon: '🧠', text: 'Classifying into 5 themes...' },
          { icon: '📊', text: 'Computing sentiment scores...' },
          { icon: '✅', text: 'Building dashboard...' }
        ].map((step, i) => (
          <div key={i} style={{ fontSize: 13, color: i <= loadingStep ? '#1a1a2e' : '#ccc', fontWeight: i === loadingStep ? 700 : 400, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{step.icon}</span><span>{step.text}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'monospace', marginTop: 8 }}>Loading your dashboard...</div>
    </div>
  );

  // ── Main layout ─────────────────────────────────────────────────────────
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F6FA' }}>
      {!isMobile && <Sidebar activePage={activePage} onPageChange={handlePageChange} />}
      <div style={{ marginLeft: isMobile ? 0 : '220px', flex: 1, padding: isMobile ? '16px 12px 80px 12px' : '32px', overflowY: 'auto' }}>
        {renderMainContent()}
      </div>

      {isMobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-around', padding: '8px 4px 16px', zIndex: 1000, boxShadow: '0 -4px 12px rgba(0,0,0,0.08)' }}>
          {[
            { id: 'dashboard', icon: '📊', label: 'Home' },
            { id: 'reviews',   icon: '💬', label: 'Reviews' },
            { id: 'themes',    icon: '🎯', label: 'Themes' },
            { id: 'pulse',     icon: '📈', label: 'Pulse' },
            { id: 'email',     icon: '✉️', label: 'Email' },
          ].map(item => (
            <div key={item.id} onClick={() => handlePageChange(item.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', padding: '4px 10px', borderRadius: 8, background: activePage === item.id ? '#F3F4F6' : 'transparent' }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: activePage === item.id ? 700 : 400, color: activePage === item.id ? '#1a1a2e' : '#9CA3AF' }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;