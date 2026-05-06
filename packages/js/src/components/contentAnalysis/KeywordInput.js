/* global wpseoAdminL10n */
import { __, sprintf } from "@wordpress/i18n";
import { TextField } from "@yoast/ui-library";
import PropTypes from "prop-types";

import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { OutboundLink } from "../../shared-admin/components";

/**
 * Gets the description element for the keyphrase input.
 *
 * @returns {JSX.Element} The description element.
 */
const getDescription = () => safeCreateInterpolateElement(
	sprintf(
		/* translators: %1$s and %2$s are anchor tags. */
		__( "Use the main word or phrase you want your content found for across search, AI, and beyond. %1$sLearn more about best practices for keyphrases.%2$s", "wordpress-seo" ),
		"<a>",
		"</a>"
	),
	{
		a: <OutboundLink
			href={ wpseoAdminL10n[ "shortlinks.focus_keyword_info" ] }
			variant="default"
		/>,
	}
);

/**
 * Renders the focus keyphrase input field.
 *
 * @param {Object} props The component props.
 * @param {string} props.location The current location context (e.g., "metabox" or "sidebar"). Used to scope the input id.
 * @param {string} props.keyword The current focus keyphrase value.
 * @param {Function} props.handleChange Change handler. Receives the raw change event from the input.
 * @param {Function} props.onFocusKeyword Focus handler.
 * @param {Function} props.onBlurKeyword Blur handler.
 * @param {Object} props.validation Validation state forwarded to TextField, or null when there are no errors.
 *
 * @returns {JSX.Element} The keyphrase TextField.
 */
export const KeywordInput = ( { location, keyword, handleChange, onFocusKeyword, onBlurKeyword, validation } ) => (
	<TextField
		id={ `focus-keyword-input-${ location }` }
		label={ __( "Focus keyphrase", "wordpress-seo" ) }
		value={ keyword }
		onChange={ handleChange }
		onFocus={ onFocusKeyword }
		onBlur={ onBlurKeyword }
		validation={ validation }
		autoComplete="off"
		placeholder={ __( "Type here", "wordpress-seo" ) }
		description={ getDescription() }
	/>
);

KeywordInput.propTypes = {
	location: PropTypes.string.isRequired,
	keyword: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
	onFocusKeyword: PropTypes.func.isRequired,
	onBlurKeyword: PropTypes.func.isRequired,
	validation: PropTypes.shape( {
		variant: PropTypes.string,
		message: PropTypes.node,
	} ),
};
