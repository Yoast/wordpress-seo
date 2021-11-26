import { __ } from "@wordpress/i18n";

/**
 * Returns the configuration used for score ratings and the AssessorPresenter.
 * @returns {Object} The config object.
 */
export default function() {
	const contentOptimizationLabel = __( "Content optimization:", "wordpress-seo" );
	return {
		feedback: {
			className: "na",
			screenReaderText: __( "Feedback", "wordpress-seo" ),
			fullText: `${ contentOptimizationLabel } ${ __( "Has feedback", "wordpress-seo" ) }`,
			screenReaderReadabilityText: "",
		},
		bad: {
			className: "bad",
			screenReaderText: __( "Needs improvement", "wordpress-seo" ),
			fullText: `${ contentOptimizationLabel } ${ __( "Needs improvement", "wordpress-seo" ) }`,
			screenReaderReadabilityText: __( "Needs improvement", "wordpress-seo" ),
		},
		ok: {
			className: "ok",
			screenReaderText: __( "OK SEO score", "wordpress-seo" ),
			fullText: `${ contentOptimizationLabel } ${ __( "OK SEO score", "wordpress-seo" ) }`,
			screenReaderReadabilityText: __( "OK", "wordpress-seo" ),
		},
		good: {
			className: "good",
			screenReaderText: __( "Good SEO score", "wordpress-seo" ),
			fullText: `${ contentOptimizationLabel } ${ __( "Good SEO score", "wordpress-seo" ) }`,
			screenReaderReadabilityText: __( "Good", "wordpress-seo" ),
		},
	};
}
