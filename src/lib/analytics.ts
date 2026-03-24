/**
 * KINGS NEON — Analytics Event Dispatcher
 * Typed event system supporting GA4, Meta Pixel, and GTM.
 * Configuration via /src/data/analytics.json.
 */

import type { AnalyticsEvent, AnalyticsData } from '../types';
import analyticsConfig from '../data/analytics.json';

const config: AnalyticsData = analyticsConfig;

/**
 * Dispatches a tracked event to all enabled analytics providers.
 */
export function trackEvent(event: AnalyticsEvent, params?: Record<string, unknown>): void {
  if (!config.enabled) {
    if (config.debug) {
      console.log('[Kings Neon Analytics - DEBUG]', event, params);
    }
    return;
  }

  // GA4 via gtag
  if (config.ga4MeasurementId && typeof window !== 'undefined') {
    const w = window as unknown as Record<string, unknown>;
    if (typeof w['gtag'] === 'function') {
      (w['gtag'] as (...args: unknown[]) => void)('event', event, {
        ...params,
        send_to: config.ga4MeasurementId,
      });
    }
  }

  // GTM dataLayer
  if (config.gtmId && typeof window !== 'undefined') {
    const w = window as unknown as Record<string, unknown>;
    const dataLayer = (w['dataLayer'] ?? []) as Record<string, unknown>[];
    dataLayer.push({
      event: event,
      ...params,
    });
  }

  // Meta Pixel
  if (config.metaPixelId && typeof window !== 'undefined') {
    const w = window as unknown as Record<string, unknown>;
    if (typeof w['fbq'] === 'function') {
      const fbq = w['fbq'] as (...args: unknown[]) => void;
      if (event === 'generate_lead') {
        fbq('track', 'Lead', params);
      } else if (event === 'page_view') {
        fbq('track', 'PageView', params);
      } else {
        fbq('trackCustom', event, params);
      }
    }
  }

  if (config.debug) {
    console.log('[Kings Neon Analytics]', event, params);
  }
}

/**
 * Initializes scroll depth tracking using IntersectionObserver.
 * Fires events at 50% and 90% scroll depth.
 */
export function initScrollDepthTracking(): void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
    return;
  }

  const thresholds = [
    { ratio: 0.5, event: 'scroll_depth_50' as AnalyticsEvent, fired: false },
    { ratio: 0.9, event: 'scroll_depth_90' as AnalyticsEvent, fired: false },
  ];

  // Create sentinel elements at 50% and 90% of the page
  const body = document.body;
  const html = document.documentElement;
  const pageHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  );

  thresholds.forEach((threshold) => {
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = `${pageHeight * threshold.ratio}px`;
    sentinel.style.height = '1px';
    sentinel.style.width = '1px';
    sentinel.style.opacity = '0';
    sentinel.style.pointerEvents = 'none';
    sentinel.setAttribute('aria-hidden', 'true');
    body.appendChild(sentinel);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !threshold.fired) {
            threshold.fired = true;
            trackEvent(threshold.event, {
              page: window.location.pathname,
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
  });
}

/**
 * Returns the GA4 script tag content for injection into <head>.
 * Returns empty string if analytics is disabled or no GA4 ID configured.
 */
export function getGA4Script(): string {
  if (!config.enabled || !config.ga4MeasurementId) return '';

  return `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${config.ga4MeasurementId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied'
      });
      gtag('config', '${config.ga4MeasurementId}');
    </script>
  `;
}

/**
 * Returns the GTM script tag content for injection into <head>.
 */
export function getGTMScript(): string {
  if (!config.enabled || !config.gtmId) return '';

  return `
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${config.gtmId}');</script>
  `;
}

/**
 * Returns the GTM noscript tag for injection into <body>.
 */
export function getGTMNoscript(): string {
  if (!config.enabled || !config.gtmId) return '';

  return `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${config.gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;
}

/**
 * Returns the Meta Pixel script tag content for injection into <head>.
 */
export function getMetaPixelScript(): string {
  if (!config.enabled || !config.metaPixelId) return '';

  return `
    <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('consent', 'revoke');
      fbq('init', '${config.metaPixelId}');
      fbq('track', 'PageView');
    </script>
  `;
}
