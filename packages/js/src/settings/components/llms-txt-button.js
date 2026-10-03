import { Button } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

/**
 * The llms.txt button component for the feature row in the Site Features settings.
 *
 * @param {Function} onClick Callback to be called on button click.
 * @returns {JSX.Element} The llms.txt button component.
 */
export const LlmsTxtButton = ( { onClick } ) => (
	<Button
		onClick={ onClick }
		id="link-llms"
		variant="secondary"
		target="_blank"
		rel="noopener"
		className="yst-self-start yst-mt-4"
		size="small"
	>
		{ __( "Customize llms.txt file", "wordpress-seo" ) }
	</Button> );
