import AnalysisFields from "../helpers/fields/AnalysisFields";

/** @typedef {import("yoastseo").AssessmentResult} AssessmentResult */

// The assessment identifiers whose results make up each per-field score.
export const SEO_TITLE_IDENTIFIERS = [ "titleWidth", "keyphraseInSEOTitle" ];
export const META_DESCRIPTION_IDENTIFIERS = [ "metaDescriptionKeyword", "metaDescriptionLength" ];

// Each assessment scores on a 0-9 scale; mirrors Assessor's ScoreRating.
const SCORE_RATING = 9;

/**
 * Calculates a 0-100 overall score over the results matching the given identifiers.
 *
 * Mirrors `Assessor.calculateOverallScore`: the average result score normalized against the 0-9
 * assessment scale. Returns 0 when no matching valid results exist, so callers can treat 0 as
 * "not derivable" — a legitimately computed score is always above 0 because every contributing
 * assessment scores at least 1.
 *
 * @param {AssessmentResult[]} results     The (transported) SEO analysis results.
 * @param {string[]}           identifiers The assessment identifiers to include.
 *
 * @returns {number} The 0-100 score, or 0 when no matching valid results exist.
 */
const deriveScore = ( results, identifiers ) => {
	const matches = ( results || [] ).filter(
		( result ) => identifiers.includes( result?._identifier ) && result.hasScore?.() && result.hasText?.()
	);
	const total = matches.reduce( ( sum, result ) => sum + result.getScore(), 0 );

	return Math.round( total / ( matches.length * SCORE_RATING ) * 100 ) || 0;
};

/**
 * Derives the SEO title score from the SEO analysis results.
 *
 * @param {AssessmentResult[]} results The SEO analysis results.
 *
 * @returns {number} The 0-100 score, or 0 when not derivable.
 */
export const deriveSeoTitleScore = ( results ) => deriveScore( results, SEO_TITLE_IDENTIFIERS );

/**
 * Derives the meta description score from the SEO analysis results.
 *
 * @param {AssessmentResult[]} results The SEO analysis results.
 *
 * @returns {number} The 0-100 score, or 0 when not derivable.
 */
export const deriveMetaDescriptionScore = ( results ) => deriveScore( results, META_DESCRIPTION_IDENTIFIERS );

/**
 * Derives both per-field scores and writes them to their hidden fields, so they are saved as post
 * meta with the post.
 *
 * A score of 0 (not derivable) is never written: '0' is the "never scored" sentinel and must not
 * overwrite a previously saved score. Writes silently no-op on term pages, where the fields do
 * not exist.
 *
 * @param {AssessmentResult[]} results The main SEO analysis results.
 *
 * @returns {void}
 */
export const saveFieldScores = ( results ) => {
	const seoTitleScore = deriveSeoTitleScore( results );
	if ( seoTitleScore > 0 ) {
		AnalysisFields.seoTitleScore = String( seoTitleScore );
	}

	const metaDescriptionScore = deriveMetaDescriptionScore( results );
	if ( metaDescriptionScore > 0 ) {
		AnalysisFields.metaDescriptionScore = String( metaDescriptionScore );
	}
};
