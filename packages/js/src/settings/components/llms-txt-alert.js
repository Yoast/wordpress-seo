import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { useSelectSettings } from "../hooks";
import { safeCreateInterpolateElement } from "../../helpers/i18n";
import { LLMS_TXT_GENERATION_FAILURE_REASONS } from "../constants";

/**
 * @param {string} reason The reason for the alert to appear.
 *
 * @returns {JSX.Element} The llms.txt alert.
 */
export const LlmsTxtAlert = ( { reason } ) => {
	const link = useSelectSettings( "selectLink", [], "https://yoa.st/llms-txt-file-deletion-settings" );
	const alertText = useMemo( () => {
		if ( reason === LLMS_TXT_GENERATION_FAILURE_REASONS.notManagedByYoastSeo ) {
			return safeCreateInterpolateElement(
				sprintf(
					/* translators: %1$s and %2$s are replaced by opening and closing <a> tags */
					__( "An existing llms.txt file wasn't created by Yoast or has been edited manually. Yoast won't overwrite it. %1$sDelete it manually%2$s or turn off this feature.", "wordpress-seo" ),
					"<a>",
					"</a>"
				), {
					// eslint-disable-next-line jsx-a11y/anchor-has-content
					a: <a id="llms-delete-file-link" href={ link } />,
				}
			);
		}

		if ( reason === LLMS_TXT_GENERATION_FAILURE_REASONS.filesystemPermissions ) {
			return __( "You have activated the Yoast llms.txt feature, but we couldn't generate an llms.txt file. It looks like there aren't sufficient permissions on the web server's filesystem.", "wordpress-seo" );
		}

		return __( "You have activated the Yoast llms.txt feature, but we couldn't generate an llms.txt file, for unknown reasons", "wordpress-seo" );
	}, [ reason ] );

	return (
		<Alert className="yst-max-w-xl" variant="error">
			{ alertText }
		</Alert>
	);
};

LlmsTxtAlert.propTypes = {
	reason: PropTypes.string.isRequired,
};
