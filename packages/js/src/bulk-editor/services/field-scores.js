import { applyFilters } from "@wordpress/hooks";
import { get } from "lodash";
import { assessors, Paper } from "yoastseo";
import measureTextWidth from "../../helpers/measureTextWidth";

// Lets Premium return a researcher augmented with morphology data; Free leaves the researcher untouched.
const RESEARCHER_FILTER = "yoast.bulkEditor.analysis.researcher";

/**
 * Reads the bulk editor's analysis configuration from the localized script data.
 *
 * @returns {{contentLocale: string, keywordAnalysisActive: boolean}} The analysis configuration.
 */
const getAnalysisData = () => ( {
	contentLocale: get( window, [ "wpseoBulkEditorData", "analysis", "contentLocale" ], "en_US" ),
	keywordAnalysisActive: get( window, [ "wpseoBulkEditorData", "analysis", "keywordAnalysisActive" ], false ) === true,
} );

// A single researcher is shared across re-scores; built on first use.
let researcherPromise = null;

/**
 * Lazily builds the researcher used to score the fields.
 *
 * The language researcher lives on the page as `window.yoast.Researcher` because the bundle depends on the
 * analysis package. Premium can hook {@link RESEARCHER_FILTER} to return a researcher with morphology data
 * added, so its scores match the Premium editor; Free returns the researcher unchanged. The filter result
 * may be a promise (Premium fetches morphology at runtime), so it is awaited.
 *
 * @param {string} locale The content locale.
 *
 * @returns {Promise<Object>} The researcher.
 */
const getResearcher = ( locale ) => {
	if ( researcherPromise === null ) {
		researcherPromise = Promise.resolve()
			.then( () => {
				// eslint-disable-next-line new-cap
				const researcher = new window.yoast.Researcher.default();
				return applyFilters( RESEARCHER_FILTER, researcher, locale );
			} )
			.catch( ( error ) => {
				// Allow a retry on the next edit rather than caching the failure for the session.
				researcherPromise = null;
				throw error;
			} );
	}
	return researcherPromise;
};

/**
 * Builds the request item for a post's scores.
 *
 * A score of 0 is "not derivable"; it is omitted to avoid persisting the never-scored sentinel. The
 * returned item holds only the `id` when neither score is derivable.
 *
 * @param {number} id                   The post ID.
 * @param {number} seoTitleScore        The SEO title score.
 * @param {number} metaDescriptionScore The meta description score.
 *
 * @returns {Object} The request item.
 */
const buildScoreItem = ( id, seoTitleScore, metaDescriptionScore ) => {
	/* eslint-disable camelcase -- The score endpoint expects snake_case request fields. */
	const item = { id };
	if ( seoTitleScore > 0 ) {
		item.seo_title_score = seoTitleScore;
	}
	if ( metaDescriptionScore > 0 ) {
		item.meta_description_score = metaDescriptionScore;
	}
	return item;
	/* eslint-enable camelcase */
};

/**
 * Builds the Paper the scores are computed from.
 *
 * @param {Object} props             The props.
 * @param {string} props.title       The rendered SEO title.
 * @param {string} props.description The rendered meta description.
 * @param {string} props.keyphrase   The focus keyphrase.
 * @param {string} props.locale      The content locale.
 *
 * @returns {Paper} The paper.
 */
const buildPaper = ( { title, description, keyphrase, locale } ) => new Paper( "", {
	keyword: keyphrase || "",
	title: title || "",
	titleWidth: measureTextWidth( title || "" ),
	description: description || "",
	locale,
} );

/**
 * Runs an assessor over a paper and returns its overall 0-100 score.
 *
 * @param {Object} assessor The assessor to run.
 * @param {Paper}  paper    The paper to assess.
 *
 * @returns {number} The overall score.
 */
const overallScore = ( assessor, paper ) => {
	assessor.assess( paper );
	return assessor.calculateOverallScore();
};

/**
 * Builds a re-scorer that recomputes and persists the SEO title and meta description scores for a post
 * after it is edited in the bulk editor.
 *
 * It runs only the two field assessors ({@link assessors.SeoTitleAssessor}, {@link assessors.MetaDescriptionAssessor})
 * on the main thread — no analysis worker and no full-page analysis — matching the editor's per-field scores.
 * It is a no-op when SEO analysis is disabled or the score endpoint is unavailable, and it never throws.
 *
 * @param {Object} props                    The props.
 * @param {import("./data-provider").DataProvider} props.dataProvider The data provider (holds the endpoint).
 * @param {Object} props.remoteDataProvider The remote data provider (performs the request).
 *
 * @returns {function(Object): Promise<void>} A function that re-scores and persists one post's fields.
 */
export const createFieldScorer = ( { dataProvider, remoteDataProvider } ) => {
	const endpoint = dataProvider.getEndpoint( "update_scores" );
	const { contentLocale, keywordAnalysisActive } = getAnalysisData();

	/**
	 * Re-scores and persists one post's per-field scores.
	 *
	 * @param {Object} props             The props.
	 * @param {number} props.id          The post ID.
	 * @param {string} props.title       The rendered SEO title.
	 * @param {string} props.description The rendered meta description.
	 * @param {string} props.keyphrase   The focus keyphrase.
	 *
	 * @returns {Promise<void>} Resolves once the scores are persisted (or the re-score is skipped).
	 */
	return async( { id, title, description, keyphrase } ) => {
		if ( ! keywordAnalysisActive || ! endpoint || ! remoteDataProvider ) {
			return;
		}

		try {
			const researcher = await getResearcher( contentLocale );
			const paper = buildPaper( { title, description, keyphrase, locale: contentLocale } );

			const item = buildScoreItem(
				id,
				overallScore( new assessors.SeoTitleAssessor( researcher ), paper ),
				overallScore( new assessors.MetaDescriptionAssessor( researcher ), paper )
			);
			// Only the id present means neither score was derivable, so there is nothing to persist.
			if ( Object.keys( item ).length === 1 ) {
				return;
			}

			await remoteDataProvider.fetchJson( endpoint, {}, {
				method: "POST",
				body: JSON.stringify( { items: [ item ] } ),
			} );
		} catch ( error ) {
			// Fire-and-forget: a failed re-score must not surface to the user or block editing.
		}
	};
};
