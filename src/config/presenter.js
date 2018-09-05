/**
 * Returns the configuration used for score ratings and the AssessorPresenter.
 * @param {Jed} i18n The translator object.
 * @returns {Object} The config object.
 */
export default function ( i18n ) {
	return {
		feedback: {
			className: "na",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Feedback" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content optimization: Has feedback" ),
			screenReaderReadabilityText: ''
		},
		bad: {
			className: "bad",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Bad SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content optimization: Bad SEO score" ),
			screenReaderReadabilityText: i18n.dgettext( "js-text-analysis", "Needs improvement" )
		},
		ok: {
			className: "ok",
			screenReaderText: i18n.dgettext( "js-text-analysis", "OK SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content optimization: OK SEO score" ),
			screenReaderReadabilityText: i18n.dgettext( "js-text-analysis", "OK" )
		},
		good: {
			className: "good",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Good SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content optimization: Good SEO score" ),
			screenReaderReadabilityText: i18n.dgettext( "js-text-analysis", "Good" )
		}
	};
};
