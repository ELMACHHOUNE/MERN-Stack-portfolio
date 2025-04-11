

const API_URL = 'http://localhost:5000/api/analytics';

// Generate a simple visitor ID
const getVisitorId = () => {
  let visitorId = localStorage.getItem('visitorId');
  if (!visitorId) {
    // Generate a random string
    visitorId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('visitorId', visitorId);
  }
  return visitorId;
};

// Track page view
export const trackPageView = async (path: string, timeSpent: number = 0) => {
  try {
    console.log('Tracking page view for path:', path);
    
    // Skip tracking if the path is in the admin section
    if (path.startsWith('/admin')) {
      console.log('Skipping admin path');
      return;
    }

    // Get the current user from localStorage
    const userStr = localStorage.getItem('user');
    let userId = null;

    if (userStr) {
      const user = JSON.parse(userStr);
      console.log('Full user data from localStorage:', user);
      userId = user._id;
    }

    const visitorId = getVisitorId();
    console.log('Tracking with visitorId:', visitorId);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'pageView',
        visitorId: visitorId,
        userId: userId,
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        path,
        timeSpent,
        referrer: document.referrer,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Page view tracked successfully');
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track contact submission
export const trackContactSubmission = async () => {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'contactSubmission',
        visitorId: getVisitorId(),
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        path: '/contact',
      }),
    });
  } catch (error) {
    console.error('Error tracking contact submission:', error);
  }
};

// Track resume download
export const trackResumeDownload = async () => {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'resumeDownload',
        visitorId: getVisitorId(),
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        path: '/resume',
      }),
    });
  } catch (error) {
    console.error('Error tracking resume download:', error);
  }
};

// Track project view
export const trackProjectView = async (projectId: string) => {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'projectView',
        visitorId: getVisitorId(),
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        path: `/projects/${projectId}`,
        metadata: { projectId },
      }),
    });
  } catch (error) {
    console.error('Error tracking project view:', error);
  }
};

// Track skill view
export const trackSkillView = async (skillId: string) => {
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'skillView',
        visitorId: getVisitorId(),
        ip: '127.0.0.1',
        userAgent: navigator.userAgent,
        path: '/skills',
        metadata: { skillId },
      }),
    });
  } catch (error) {
    console.error('Error tracking skill view:', error);
  }
}; 