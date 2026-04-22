// Vercel Speed Insights initialization
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectSpeedInsights();
  });
} else {
  // DOM is already ready
  injectSpeedInsights();
}
