import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { safeCreateInterpolateElement } from "../../helpers/i18n";

/**
 * @param {boolean} isEnabled Whether Open Graph is enabled.
 * @param {string} text The text to use. Should contain `%1$s`, `%2$s`, `%3$s` and `%4$s`.
 * @returns {JSX.Element} The element.
 */
const OpenGraphDisabledAlert = ( {
	isEnabled,
	/* translators: %1$s expands to an opening emphasis tag. %2$s expands to a closing emphasis tag. */
	text = __( "The %1$ssocial image%2$s, %1$ssocial title%2$s and %1$ssocial description%2$s require Open Graph data, which is currently disabled in the ‘Social sharing’ section in %3$sSite features%4$s.", "wordpress-seo" ),
} ) => {
	const openGraphDisabledAlertText = useMemo( () => safeCreateInterpolateElement(
		sprintf( text, "<em>", "</em>", "<link>", "</link>" ),
		{
			em: <em />,
			link: <Link to="/site-features#section-social-sharing" />,
		}
	), [] );

	if ( isEnabled ) {
		return null;
	}

	return (
		<Alert variant="info" className="yst-mb-6">
			{ openGraphDisabledAlertText }
		</Alert>
	);
};

OpenGraphDisabledAlert.propTypes = {
	isEnabled: PropTypes.bool.isRequired,
	text: PropTypes.string,
};

export default OpenGraphDisabledAlert;
