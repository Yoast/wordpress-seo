export { Dashboard } from "./components/dashboard";

/**
 * @typedef {Object} Taxonomy A taxonomy.
 * @property {string} name The unique identifier.
 * @property {string} label The user-facing label.
 * @property {Object} links The links.
 * @property {string} [links.search] The search link, might not exist.
 */

/**
 * @typedef {Object} ContentType A content type.
 * @property {string} name The unique identifier.
 * @property {string} label The user-facing label.
 * @property {Taxonomy|null} taxonomy The (main) taxonomy or null.
 */

/**
 * @typedef {Object} Term A term.
 * @property {string} name The unique identifier.
 * @property {string} label The user-facing label.
 */

/**
 * @typedef {"seo"|"readability"} AnalysisType The analysis type.
 */

/**
 * @typedef {"ok"|"good"|"bad"|"notAnalyzed"} ScoreType The score type.
 */

/**
 * @typedef {Object} Score A score.
 * @property {ScoreType} name The name of the score.
 * @property {number} amount The amount of content for this score.
 * @property {Object} links The links.
 * @property {string} [links.view] The view link, might not exist.
 */

/**
 * @typedef {Object} Features Whether features are enabled.
 * @property {boolean} indexables Whether indexables are enabled.
 * @property {boolean} seoAnalysis Whether SEO analysis is enabled.
 * @property {boolean} readabilityAnalysis Whether readability analysis is enabled.
 */

/**
 * @typedef {Object} Endpoints The endpoints.
 * @property {string} seoScores The endpoint for SEO scores.
 * @property {string} readabilityScores The endpoint for readability scores.
 * @property {string} siteKitConfigurationDismissal The endpoint to dismiss the Site Kit configuration.
 * @property {string} siteKitConsentManagement The endpoint to manage the Site Kit consent.
 * @property {string} timeBasedSeoMetrics The endpoint to get a time based seo metrics.
 */

/**
 * @typedef {Object} Links The links.
 * @property {string} dashboardLearnMore The dashboard information link.
 * @property {string} errorSupport The support link when errors occur.
 * @property {string} siteKitLearnMore The Site Kit learn more link.
 * @property {string} siteKitConsentLearnMore The Site Kit consent learn more link.
 * @property {string} topPagesInfoLearnMore The top pages learn more link.
 * @property {string} topQueriesInfoLearnMore The top queries learn more link.
 * @property {string} organicSessionsInfoLearnMore The organic sessions learn more link.
 */

/**
 * @typedef {Object} TopPageDataLinks The links.
 * @property {string} edit The link for editing the content.
 */

/**
 * @typedef {Object} TopPageData The top page data.
 * @property {string} subject The landing page.
 * @property {number} clicks The number of clicks.
 * @property {number} impressions The number of impressions.
 * @property {number} ctr The click-through rate.
 * @property {number} position The average position.
 * @property {ScoreType} seoScore The seo score.
 * @property {TopPageDataLinks} links The links.
 */

/**
 * @typedef {Object} TopQueryData The top page data.
 * @property {string} subject The landing page.
 * @property {number} clicks The number of clicks.
 * @property {number} impressions The number of impressions.
 * @property {number} ctr The click-through rate.
 * @property {number} position The average position.
 */

/**
 * @typedef {"seoScores"|"readabilityScores"|"topPages"|"siteKitSetup"|"topQueries"|"organicSessions"} WidgetType The widget type.
 */

/**
 * @typedef {Object} WidgetInstance The widget instance. Should hold what the UI needs to render the widget.
 * @property {string} id The unique identifier.
 * @property {WidgetType} type The widget type.
 */

/**
 * @typedef {Object} SiteKitConfiguration The Site Kit configuration.
 * @property {string} installUrl The link to install Site Kit.
 * @property {string} activateUrl The link to activate Site Kit.
 * @property {string} setupUrl The link to setup Site Kit.
 * @property {SiteKitConnectionStepsStatuses} connectionStepsStatuses The connection steps statuses.
 * @property {boolean} isAnalyticsConnected Whether Google Analytics is connected.
 * @property {boolean} isFeatureEnabled Whether the feature is enabled.
 * @property {boolean} isSetupWidgetDismissed Whether the configuration is dismissed.
 * @property {CapabilitiesForSiteKit} capabilities The user capabilities for site kit.
 */

/**
 * @typedef {Object<"installPlugins"|"viewSearchConsoleData"|"viewAnalyticsData", boolean>} CapabilitiesForSiteKit
 * The user capabilities for site kit.
 */

/**
 * @typedef {Object<"isInstalled"|"isActive"|"isSetupCompleted"|"isConsentGranted", boolean>} SiteKitConnectionStepsStatuses
 * The connection steps statuses.
 */
