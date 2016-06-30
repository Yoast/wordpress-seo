var AssessmentResult = require( "../values/AssessmentResult.js" );
var isEmpty = require( "lodash/isEmpty" );

/**
 * Calculate the score based on the current image count.
 * @param {number} imageCount The amount of images to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateImageCountResult = function( imageCount, i18n ) {
	if ( imageCount === 0 ) {
		return {
			score: 3,
			text: i18n.dgettext( "js-text-analysis", "No images appear in this page, consider adding some as appropriate." )
		};
	}

	return {};
};

/**
 * Calculate the score based on the current image alt-tag count.
 * @param {object} altProperties An object containing the various alt-tags.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var assessImages = function( altProperties, i18n ) {
	// Has alt-tag and keywords
	if ( altProperties.withAltKeyword > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt attributes with the focus keyword." )
		};
	}

	// Has alt-tag, but no keywords and it's not okay
	if ( altProperties.withAltNonKeyword > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page do not have alt attributes containing the focus keyword." )
		};
	}

	// Has alt-tag, but no keyword is set
	if ( altProperties.withAlt > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt attributes." )
		};
	}

	// Has no alt-tag
	if ( altProperties.noAlt > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page are missing alt attributes." )
		};
	}

	return {};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var textHasImagesAssessment = function( paper, researcher, i18n ) {
	var assessmentResult = new AssessmentResult();

	var imageCount = researcher.getResearch( "imageCount" );
	var imageCountResult = calculateImageCountResult( imageCount, i18n );

	if ( isEmpty( imageCountResult ) ) {
		var altTagCount = researcher.getResearch( "altTagCount" );
		var altTagCountResult = assessImages( altTagCount, i18n );

		assessmentResult.setScore( altTagCountResult.score );
		assessmentResult.setText( altTagCountResult.text );

		return assessmentResult;
	}

	assessmentResult.setScore( imageCountResult.score );
	assessmentResult.setText( imageCountResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textImages",
	getResult: textHasImagesAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	}
};
