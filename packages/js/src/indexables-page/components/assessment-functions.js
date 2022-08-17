/**
 * Assessment function for the lowest SEO scores card.
 *
 * @param {object} indexable The indexable to be assessed.
 *
 * @returns {string} The bullet color.
 */
function SEOScoreAssessment( indexable ) {
	const SEOScoreThresholds = { medium: 40, good: 70 };

	return indexable.primary_focus_keyword_score > SEOScoreThresholds.medium ? "yst-bg-amber-500" : "yst-bg-red-500";
}

/**
 * Assessment function for the lowest readability scores card.
 *
 * @param {object} indexable The indexable to be assessed.
 *
 * @returns {string} The bullet color.
 */
function ReadabilityScoreAssessment( indexable ) {
	const readabilityScoreThresholds = { medium: 59, good: 89 };

	return indexable.readability_score > readabilityScoreThresholds.medium ? "yst-bg-amber-500" : "yst-bg-red-500";
}

/**
 * Assessment function for the least linked indexables card.
 *
 * @param {object} indexable The indexable to be assessed.
 *
 * @returns {string} The bullet color.
 */
function LeastLinkedAssessment( indexable ) {
	const leastLinkedThresholds = { medium: 1, good: 2 };

	if ( indexable.incoming_link_count >= leastLinkedThresholds.good ) {
		return  "yst-bg-emerald-500";
	}

	if ( indexable.incoming_link_count === leastLinkedThresholds.medium ) {
		return "yst-bg-amber-500";
	}

	return "yst-bg-red-500";
}

/**
 * Assessment function for the most linked indexables card.
 *
 * @param {object} indexable The indexable to be assessed.
 *
 * @returns {string} The bullet color.
 */
function MostLinkedeAssessment( indexable ) {
	return parseInt( indexable.is_cornerstone, 10 ) ? "yst-bg-emerald-500" : "yst-bg-red-500";
}

export {
	SEOScoreAssessment,
	ReadabilityScoreAssessment,
	LeastLinkedAssessment,
	MostLinkedeAssessment,
};
