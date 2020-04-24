import { __ } from "@wordpress/i18n";

const onClick = () => {
	window.console.log( "hello world" );
}

/**
 * Triggers a HelpScout language feedback form.
 *
 * @returns {wp.Element} Feedbacklink component.
 * @constructor
 */
export default function LanguageFeedbackLink() {
	return (
		<a href="#" onClick={ onClick }>
			{ __( "Yoast didn't recognize my keyphrase.", "wordpress-seo" ) }
		</a>
	);
};
