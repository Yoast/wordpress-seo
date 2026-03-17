import { Button, Root } from "@yoast/ui-library";
import { __ } from "@wordpress/i18n";

/**
 * The button to open the the NextPostApprovedModal in the top bar of the block editor.
 *
 * @param {function} onClick The function to call when the button is clicked.
 * @returns {JSX.Element} The Next Post button.
 */
export const NextPostButton = ( { onClick, className = "" } ) => {
	return <Root><Button variant="ai-secondary" onClick={ onClick } className={ className }>
		{ __( "Get content suggestions", "wordpress-seo" ) }
	</Button></Root>;
};
