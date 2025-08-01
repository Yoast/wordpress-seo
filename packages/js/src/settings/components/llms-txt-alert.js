import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { useSelectSettings } from "../hooks";
import { safeCreateInterpolateElement } from "../../helpers/i18n";

/**
 * @param {string} reason The reason for the alert to appear.
 *
 * @returns {JSX.Element|null} The llms.txt alert or null.
 */
export const LlmsTxtAlert = ( { reason } ) => {
	const link = useSelectSettings( "selectLink", [], "https://yoa.st/llms-txt-file-deletion-settings" );
	const alertText = useMemo( () => {
		if ( reason === "not_managed_by_yoast_seo" ) {
			return safeCreateInterpolateElement(
				sprintf(
					/* translators: %1$s and %2$s are replaced by opening and closing <a> tags */
					__( "It looks like there is an llms.txt file already that wasn't created by Yoast, or the llms.txt file created by Yoast has been edited manually. We don't want to overwrite this file's content, so if you want to let Yoast keep auto-generating the llms.txt file, you can %1$smanually delete the existing one%2$s. Otherwise, consider disabling the Yoast feature.", "wordpress-seo" ),
					"<a>",
					"</a>"
				), {
					// eslint-disable-next-line jsx-a11y/anchor-has-content
					a: <a id="llms-delete-file-link" href={ link } />,
				}
			);
		}

		if ( reason === "filesystem_permissions" ) {
			return __( "You have activated the Yoast llms.txt feature, but we couldn't generate an llms.txt file. It looks like there aren't sufficient permissions on the web server's filesystem.", "wordpress-seo" );
		}

		return __( "You have activated the Yoast llms.txt feature, but we couldn't generate an llms.txt file, for unknown reasons", "wordpress-seo" );
	}, [] );

	return (
		<Alert className="yst-max-w-xl" variant="error">
			{ alertText }
		</Alert>
	);
};

LlmsTxtAlert.propTypes = {
	reason: PropTypes.string.isRequired,
};
