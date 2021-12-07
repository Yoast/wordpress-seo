/**
 * The names of the workouts.
 * @type {{orphaned: string, cornerstone: string}}
 */
export const WORKOUTS = {
	configuration: "configuration",
	cornerstone: "cornerstone",
	orphaned: "orphaned",
};

/**
 * The names of the steps per workout.
 * @type {
 *         {
 *           orphaned: {
 *             improveRemove: string,
 *             update: string,
 *             addLinks: string
 *           },
 *           cornerstone: {
 *             checkLinks: string,
 *             chooseCornerstones: string,
 *             addLinks: string
 *           }
 *         }
 *       }
 */
export const STEPS = {
	configuration: {
		optimizeSeoData: "optimizeSeoData",
		siteRepresentation: "siteRepresentation",
		socialProfiles: "socialProfiles",
		enableTracking: "enableTracking",
		newsletterSignup: "newsletterSignup",
	},
	cornerstone: {
		chooseCornerstones: "chooseCornerstones",
		checkLinks: "checkLinks",
		addLinks: "addLinks",
		improved: "improved",
		skipped: "skipped",
	},
	orphaned: {
		improveRemove: "improveRemove",
		update: "update",
		addLinks: "addLinks",
		removed: "removed",
		noindexed: "noindexed",
		improved: "improved",
		skipped: "skipped",
	},
};

/**
 * The names of the finishable steps per workout.
 * @type {{orphaned: [string, string, string], cornerstone: [string, string, string, string, string]}}
 */
export const FINISHABLE_STEPS = {
	configuration: [
		STEPS.configuration.optimizeSeoData,
		STEPS.configuration.siteRepresentation,
		STEPS.configuration.socialProfiles,
		STEPS.configuration.enableTracking,
		STEPS.configuration.newsletterSignup,
	],
	cornerstone: [
		STEPS.cornerstone.chooseCornerstones,
		STEPS.cornerstone.checkLinks,
		STEPS.cornerstone.addLinks,
	],
	orphaned: [
		STEPS.orphaned.improveRemove,
		STEPS.orphaned.update,
		STEPS.orphaned.addLinks,
	],
};
