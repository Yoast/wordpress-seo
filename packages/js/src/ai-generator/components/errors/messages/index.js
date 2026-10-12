/**
 * The single source of truth for AI generator error copy.
 *
 * Each message exports a `title` string and a `Body` component that renders the
 * paragraph copy (with its own link reads and interpolation) — and nothing else:
 * no alert box, no modal shell, no action buttons. The inline alerts
 * (`../*-alert.js`) and the danger modals (`../*-modal.js`) both wrap these so
 * the copy lives in one place.
 */
export * as genericMessage from "./generic";
export * as timeoutMessage from "./timeout";
export * as notEnoughContentMessage from "./not-enough-content";
export * as siteUnreachableMessage from "./site-unreachable";
export * as rateLimitMessage from "./rate-limit";
export * as unethicalRequestMessage from "./unethical-request";
export * as badWpRequestMessage from "./bad-wp-request";
export * as upgradeMessage from "./upgrade";
export * as subscriptionMessage from "./subscription";
export * as seoAnalysisInactiveMessage from "./seo-analysis-inactive";
