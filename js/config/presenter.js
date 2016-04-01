/**
 * Returns the configuration used for score ratings and the AssessorPresenter.
 * @param {Jed} i18n The translator object.
 * @returns {Object} The config object.
 */
module.exports = function ( i18n ) {
	return {
		feedback: {
			class: "na",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Feedback")
		},
		bad: {
			class: "bad",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Bad SEO score")
		},
		ok: {
			class: "ok",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Ok SEO score")
		},
		good: {
			class: "good",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Good SEO score")
		}
	};
};
