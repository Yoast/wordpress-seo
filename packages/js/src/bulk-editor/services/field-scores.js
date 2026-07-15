import { get } from "lodash";
import { Paper } from "yoastseo";
import { deriveMetaDescriptionScore, deriveSeoTitleScore } from "../../analysis/deriveFieldScores";
import { createAnalysisWorker, getAnalysisConfiguration } from "../../analysis/worker";
import measureTextWidth from "../../helpers/measureTextWidth";

/**
 * Reads the bulk editor's analysis configuration from the localized script data.
 *
 * @returns {{contentLocale: string, keywordAnalysisActive: boolean}} The analysis configuration.
 */
const getAnalysisData = () => ( {
	contentLocale: get( window, [ "wpseoBulkEditorData", "analysis", "contentLocale" ], "en_US" ),
	keywordAnalysisActive: get( window, [ "wpseoBulkEditorData", "analysis", "keywordAnalysisActive" ], false ) === true,
} );

// A single worker is shared across re-scores; created and initialized on first use.
let workerPromise = null;

/**
 * Lazily creates and initializes the analysis worker.
 *
 * The bulk editor page has no metabox script data, so the SEO-only configuration is passed explicitly
 * rather than derived from the (absent) editor defaults.
 *
 * @param {string} locale The content locale.
 *
 * @returns {Promise<AnalysisWorkerWrapper>} The initialized worker.
 */
const getWorker = ( locale ) => {
	if ( workerPromise === null ) {
		const worker = createAnalysisWorker();
		const configuration = getAnalysisConfiguration( {
			locale,
			keywordAnalysisActive: true,
			contentAnalysisActive: false,
			inclusiveLanguageAnalysisActive: false,
		} );
		workerPromise = worker.initialize( configuration ).then( () => worker );
	}
	return workerPromise;
};

/**
 * Builds the request item for a post's derived scores.
 *
 * A score of 0 is "not derivable", so it is omitted to avoid persisting the never-scored sentinel. The
 * returned item holds only the `id` when neither score is derivable.
 *
 * @param {number} id                   The post ID.
 * @param {number} seoTitleScore        The derived SEO title score.
 * @param {number} metaDescriptionScore The derived meta description score.
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
 * Builds the Paper the per-field scores are derived from.
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
 * Builds a re-scorer that recomputes and persists the SEO title and meta description scores for a post
 * after it is edited in the bulk editor.
 *
 * Mirrors the post editor: it runs the same analysis worker on the rendered field values and derives the
 * per-field scores from the SEO results. It is a no-op when SEO analysis is disabled or the score endpoint
 * is unavailable, and it never throws — a failed re-score must not disrupt editing.
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
			const worker = await getWorker( contentLocale );
			const { result: { seo } } = await worker.analyze( buildPaper( { title, description, keyphrase, locale: contentLocale } ) );
			const results = get( seo, [ "", "results" ], [] );

			const item = buildScoreItem( id, deriveSeoTitleScore( results ), deriveMetaDescriptionScore( results ) );
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
