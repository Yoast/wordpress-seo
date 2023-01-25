const SEOScoreThresholds = { medium: 40, good: 70 };
const readabilityScoreThresholds = { medium: 59, good: 89 };

/**
 * Assessment function for the lowest SEO scores card.
 *
 * @param {object} indexable The indexable to be assessed.
 *
 * @returns {string} The bullet color.
 */
function seoScoreAssessment( indexable ) {
	return parseInt( indexable.primary_focus_keyword_score, 10 ) > SEOScoreThresholds.medium ? "yst-bg-amber-500" : "yst-bg-red-500";
}

/**
 * Assessment function for the lowest readability scores card.
 *
 * @param {object} indexable The indexable to be assessed.
 *
 * @returns {string} The bullet color.
 */
function readabilityScoreAssessment( indexable ) {
	return parseInt( indexable.readability_score, 10 ) > readabilityScoreThresholds.medium ? "yst-bg-amber-500" : "yst-bg-red-500";
}

/**
 * Assessment function for the least linked indexables card.
 *
 * @param {object} indexable The indexable to be assessed.
 *
 * @returns {string} The bullet color.
 */
function leastLinkedAssessment( indexable ) {
	const leastLinkedThresholds = { medium: 1, good: 2 };

	const linkCount = parseInt( indexable.incoming_link_count, 10 );

	if ( linkCount >= leastLinkedThresholds.good ) {
		return  "yst-bg-emerald-500";
	}

	if ( linkCount === leastLinkedThresholds.medium ) {
		return "yst-bg-amber-500";
	}

	return "yst-bg-red-500";
}

export {
	SEOScoreThresholds,
	readabilityScoreThresholds,
	seoScoreAssessment,
	readabilityScoreAssessment,
	leastLinkedAssessment,
};
