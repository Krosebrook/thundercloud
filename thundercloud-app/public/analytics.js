(function() {
  'use strict';
  
  const WEBSITE_ID = document.currentScript.getAttribute('data-website-id');
  const API_ENDPOINT = '/api/analytics/event';
  
  function getVisitorId() {
    let visitorId = localStorage.getItem('_visitor_id');
    if (!visitorId) {
      visitorId = generateId();
      localStorage.setItem('_visitor_id', visitorId);
    }
    return visitorId;
  }
  
  function getSessionId() {
    const now = Date.now();
    const stored = sessionStorage.getItem('_session');
    
    if (stored) {
      const { id, timestamp } = JSON.parse(stored);
      if (now - timestamp < 30 * 60 * 1000) {
        return id;
      }
    }
    
    const sessionId = generateId();
    sessionStorage.setItem('_session', JSON.stringify({
      id: sessionId,
      timestamp: now,
    }));
    return sessionId;
  }
  
  function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|android|touch|webos|hpwos/i.test(ua)) return 'mobile';
    return 'desktop';
  }
  
  function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }
  
  function getOS() {
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Other';
  }
  
  function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source'),
      utm_medium: params.get('utm_medium'),
      utm_campaign: params.get('utm_campaign'),
    };
  }
  
  function getTrafficSource() {
    const referrer = document.referrer;
    if (!referrer) return 'direct';
    
    const utm = getUTMParams();
    if (utm.utm_source) return utm.utm_medium || 'campaign';
    
    const domain = new URL(referrer).hostname;
    
    if (/facebook|twitter|linkedin|instagram|tiktok|pinterest/.test(domain)) {
      return 'social';
    }
    
    if (/google|bing|yahoo|duckduckgo|baidu/.test(domain)) {
      return 'organic';
    }
    
    return 'referral';
  }
  
  function trackPageview() {
    const data = {
      websiteId: WEBSITE_ID,
      eventType: 'pageview',
      url: window.location.pathname,
      pageTitle: document.title,
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      referrer: document.referrer,
      referrerDomain: document.referrer ? new URL(document.referrer).hostname : null,
      trafficSource: getTrafficSource(),
      ...getUTMParams(),
      userAgent: navigator.userAgent,
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon(API_ENDPOINT, JSON.stringify(data));
    } else {
      fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true,
      });
    }
  }
  
  let timeOnPage = 0;
  let lastActive = Date.now();
  
  function trackTimeOnPage() {
    const now = Date.now();
    timeOnPage += (now - lastActive) / 1000;
    lastActive = now;
  }
  
  window.addEventListener('beforeunload', () => {
    trackTimeOnPage();
    navigator.sendBeacon(API_ENDPOINT, JSON.stringify({
      websiteId: WEBSITE_ID,
      eventType: 'time_on_page',
      url: window.location.pathname,
      sessionId: getSessionId(),
      timeOnPage: Math.round(timeOnPage),
    }));
  });
  
  ['click', 'scroll', 'keydown', 'mousemove'].forEach(event => {
    window.addEventListener(event, () => {
      trackTimeOnPage();
    }, { passive: true, once: false });
  });
  
  function updateRealtime() {
    fetch(`${API_ENDPOINT}/realtime`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        websiteId: WEBSITE_ID,
        sessionId: getSessionId(),
        pageUrl: window.location.pathname,
      }),
    });
  }
  
  trackPageview();
  
  updateRealtime();
  setInterval(updateRealtime, 30000);
  
})();
