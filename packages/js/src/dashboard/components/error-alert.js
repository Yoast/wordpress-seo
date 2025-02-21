import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Link } from "@yoast/ui-library";

/**
 * Create an interpolate element with the link.
 *
 * @param {string} message The message with placeholders.
 * @param {JSX.Element} link The link.
 * @returns {JSX.Element|string} The message.
 */
export const createLinkMessage = ( message, link ) => {
	try {
		return createInterpolateElement( sprintf( message, "<link>", "</link>" ), { link } );
	} catch ( e ) {
		return sprintf( message, "", "" );
	}
};

/**
 * Get Error message according to error name or status.
 *
 * @param {Error} error The error object.
 * @param {string} [link] The link.
 * @returns {JSX.Element|string} The error message.
 */
const getErrorMessage = ( error, link ) => {
	switch ( true ) {
		case ( error.status === 408 || error.name === "TimeoutError" ):
			return createLinkMessage(
				/* translators: %1$s expands to an anchor start tag, %2$s to an anchor end tag. */
				__( "The request timed out. Try refreshing the page. If the problem persists, please check our %1$sSupport page%2$s.", "wordpress-seo" ),
				link
			);
		case error.status === 403:
			return createLinkMessage(
				/* translators: %1$s expands to an anchor start tag, %2$s to an anchor end tag. */
				__( "You don’t have permission to access this resource. Please contact your admin for access. In case you need further help, please check our %1$sSupport page%2$s.", "wordpress-seo" ),
				link
			);
		default:
			return createLinkMessage(
				/* translators: %1$s expands to an anchor start tag, %2$s to an anchor end tag. */
				__( "Something went wrong. Try refreshing the page. If the problem persists, please check our %1$sSupport page%2$s.", "wordpress-seo" ),
				link
			);
	}
};

/**
 * @param {Error?} [error] The error.
 * @param {string} supportLink The support link.
 * @param {string} [className] The class name.
 * @returns {JSX.Element} The element.
 */
export const ErrorAlert = ( { error, supportLink, className = "" } ) => {
	if ( ! error ) {
		return null;
	}

	// Added dummy space as content to prevent children prop warnings in the console.
	const link = <Link variant="error" href={ supportLink }> </Link>;

	return (
		<Alert variant="error" className={ className }>
			{ getErrorMessage( error, link ) }
		</Alert>
	);
};
