import { get } from "lodash";
import { assessors, Paper } from "yoastseo";
import measureTextWidth from "../../helpers/measureTextWidth";
import { getResearcher } from "./researcher";

/**
 * Reads the bulk editor's analysis configuration from the localized script data.
 *
 * @returns {{contentLocale: string, keywordAnalysisActive: boolean}} The analysis configuration.
 */
const getAnalysisData = () => ( {
	contentLocale: get( window, [ "wpseoBulkEditorData", "analysis", "contentLocale" ], "en_US" ),
	keywordAnalysisActive: get( window, [ "wpseoBulkEditorData", "analysis", "keywordAnalysisActive" ], false ) === true,
} );

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

// The per-field assessor and score request key, keyed by the search field's key. `onTitle` picks which Paper
// field the value fills, so each assessor scores against the field it belongs to.
const SINGLE_FIELD_SCORERS = {
	seoTitle: { getAssessor: ( researcher ) => new assessors.SeoTitleAssessor( researcher ), param: "seo_title_score", onTitle: true },
	metaDescription: { getAssessor: ( researcher ) => new assessors.MetaDescriptionAssessor( researcher ), param: "meta_description_score", onTitle: false },
};

/**
 * Scores one field's applied value and persists it, when the score is derivable.
 *
 * @param {Object} props                    The props.
 * @param {string} props.endpoint           The score endpoint.
 * @param {Object} props.remoteDataProvider The remote data provider.
 * @param {string} props.contentLocale      The content locale.
 * @param {Object} props.scorer             The field's scorer config from {@link SINGLE_FIELD_SCORERS}.
 * @param {number} props.id                 The post ID.
 * @param {string} props.value              The applied (literal) field value.
 * @param {string} props.keyphrase          The row's focus keyphrase.
 *
 * @returns {Promise<void>} Resolves once the score is persisted, or immediately when it is not derivable.
 */
const persistSingleFieldScore = async( { endpoint, remoteDataProvider, contentLocale, scorer, id, value, keyphrase } ) => {
	const researcher = await getResearcher( contentLocale );
	const paper = buildPaper( {
		title: scorer.onTitle ? value : "",
		description: scorer.onTitle ? "" : value,
		keyphrase,
		locale: contentLocale,
	} );
	const score = overallScore( scorer.getAssessor( researcher ), paper );
	// A score of 0 is "not derivable"; skip it so the never-scored sentinel is not persisted.
	if ( score <= 0 ) {
		return;
	}

	await remoteDataProvider.fetchJson( endpoint, {}, {
		method: "POST",
		body: JSON.stringify( { items: [ { id, [ scorer.param ]: score } ] } ),
	} );
};

/**
 * Builds a re-scorer that recomputes and persists a single per-field score after a fill (Premium AI) applies a
 * value to that field in the bulk editor.
 *
 * Unlike {@link createFieldScorer}, it scores only the applied field, from the applied value directly: an AI
 * suggestion is already a literal value (no replacement variables to resolve), and each field's score depends
 * only on that field and the keyphrase, so the other field's persisted score is left untouched. It is a no-op
 * for a non-search field, when SEO analysis is disabled, or when the score endpoint is unavailable, and it
 * never throws.
 *
 * @param {Object} props                    The props.
 * @param {import("./data-provider").DataProvider} props.dataProvider The data provider (holds the endpoint).
 * @param {Object} props.remoteDataProvider The remote data provider (performs the request).
 *
 * @returns {function(Object): Promise<void>} A function that re-scores and persists one applied field.
 */
export const createSingleFieldScorer = ( { dataProvider, remoteDataProvider } ) => {
	const endpoint = dataProvider.getEndpoint( "update_scores" );
	const { contentLocale, keywordAnalysisActive } = getAnalysisData();

	/**
	 * Re-scores and persists the applied field's score.
	 *
	 * @param {Object} props          The props.
	 * @param {number} props.id       The post ID.
	 * @param {string} props.fieldKey The applied field's key (`seoTitle` or `metaDescription`).
	 * @param {string} props.value    The applied (literal) field value.
	 * @param {string} props.keyphrase The row's focus keyphrase.
	 *
	 * @returns {Promise<void>} Resolves once the score is persisted (or the re-score is skipped).
	 */
	return async( { id, fieldKey, value, keyphrase } ) => {
		const scorer = SINGLE_FIELD_SCORERS[ fieldKey ];
		if ( ! keywordAnalysisActive || ! endpoint || ! remoteDataProvider || ! scorer ) {
			return;
		}

		try {
			await persistSingleFieldScore( { endpoint, remoteDataProvider, contentLocale, scorer, id, value, keyphrase } );
		} catch ( error ) {
			// Fire-and-forget: a failed re-score must not surface to the user or block editing.
		}
	};
};
