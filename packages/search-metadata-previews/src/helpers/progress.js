import { assessments, helpers, languageProcessing } from "yoastseo";

/**
 * Gets the title progress.
 *
 * @param {string} title The title.
 *
 * @returns {Object} The title progress.
 */
export const getTitleProgress = ( title ) => {
	const titleWidth = helpers.measureTextWidth( title );
	const pageTitleWidthAssessment = new assessments.seo.PageTitleWidthAssessment( {
		scores: {
			widthTooShort: 9,
		},
	}, true );
	const score = pageTitleWidthAssessment.calculateScore( titleWidth );
	const maximumLength = pageTitleWidthAssessment.getMaximumLength();

	return {
		max: maximumLength,
		actual: titleWidth,
		score: score,
	};
};

/**
 * Gets the description progress.
 *
 * @param {string}  description     The description.
 * @param {string}  date            The meta description date.
 * @param {bool}    isCornerstone   Whether the cornerstone content toggle is on or off.
 * @param {bool}    isTaxonomy      Whether the page is a taxonomy page.
 * @param {string}  locale          The locale.
 *
 * @returns {Object} The description progress.
 */
export const getDescriptionProgress = ( description, date, isCornerstone, isTaxonomy, locale ) => {
	const descriptionLength = languageProcessing.countMetaDescriptionLength( date, description );

	// Override the default config if the cornerstone content toggle is on and it is not a taxonomy page.
	const metaDescriptionLengthAssessment = ( isCornerstone && ! isTaxonomy ) ? new assessments.seo.MetaDescriptionLengthAssessment( {
		scores: {
			tooLong: 3,
			tooShort: 3,
		},
	} ) : new assessments.seo.MetaDescriptionLengthAssessment();

	const score = metaDescriptionLengthAssessment.calculateScore( descriptionLength, locale );
	const maximumLength = metaDescriptionLengthAssessment.getMaximumLength( locale );

	return {
		max: maximumLength,
		actual: descriptionLength,
		score: score,
	};
};
