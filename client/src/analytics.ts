/**
 * Analytics Initialization
 *
 * This module handles analytics script loading (e.g., Umami).
 * Extracted from inline script to comply with Content Security Policy.
 */

export function initializeAnalytics() {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

  // Only load if environment variables are properly set (not placeholders)
  if (
    endpoint &&
    websiteId &&
    !endpoint.includes("%VITE_") &&
    !websiteId.includes("%VITE_")
  ) {
    const script = document.createElement("script");
    script.defer = true;
    script.src = `${endpoint}/umami`;
    script.setAttribute("data-website-id", websiteId);

    // Append to head
    document.head.appendChild(script);

  }
}
