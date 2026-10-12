import { applyFilters } from "@wordpress/hooks";

// Lets Premium provide a callback that augments the researcher (e.g. adds morphology data); Free's default
// is a no-op, so the researcher is scored with base word forms.
export const CONFIGURE_RESEARCHER_FILTER = "yoast.bulkEditor.analysis.configureResearcher";

// A single researcher is shared across every main-thread use on the page; built on first use.
let researcherPromise = null;

/**
 * Lazily builds the researcher used on the bulk editor page.
 *
 * The language researcher lives on the page as `window.yoast.Researcher` because the bundle depends on the
 * analysis package. Premium can hook {@link CONFIGURE_RESEARCHER_FILTER} to provide a callback that augments
 * the researcher (e.g. adds morphology data) so its scores match the Premium editor; Free's default callback
 * is a no-op and scores with base word forms. The callback is awaited, as Premium fetches morphology at runtime.
 *
 * Shared by the field re-scorers and the prompt-content service, so the page keeps one researcher instance:
 * building it is expensive, and tokenization and scoring need the same language configuration.
 *
 * @param {string} locale The content locale.
 *
 * @returns {Promise<Object>} The researcher.
 */
export const getResearcher = ( locale ) => {
	if ( researcherPromise === null ) {
		researcherPromise = Promise.resolve()
			.then( async() => {
				// eslint-disable-next-line new-cap
				const researcher = new window.yoast.Researcher.default();
				const configureResearcher = applyFilters( CONFIGURE_RESEARCHER_FILTER, () => {} );
				await configureResearcher( researcher, locale );
				return researcher;
			} )
			.catch( ( error ) => {
				// Allow a retry on the next use rather than caching the failure for the session.
				researcherPromise = null;
				throw error;
			} );
	}
	return researcherPromise;
};

/**
 * Forgets the shared researcher, so the next call to {@link getResearcher} builds a fresh one.
 *
 * Exists for tests, which need to re-run the build with different window globals or filters.
 *
 * @returns {void}
 */
export const resetResearcher = () => {
	researcherPromise = null;
};
