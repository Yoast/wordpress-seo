import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Title, Alert, Button } from "@yoast/ui-library";
import { useSelectSettings } from "../store";

/**
 * @param {Object} error The error instance.
 * @returns {JSX.Element} The error fallback element.
 */
const ErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );
	const supportLink = useSelectSettings( "selectLink", [], "https://yoast.com/help/support" );

	return (
		<div role="alert" className="yst-max-w-screen-sm yst-p-8 yst-space-y-4">
			<Title>{ __( "Something went wrong. An unexpected error occurred.", "wordpress-seo" ) }</Title>
			<p>{ __( "We're very sorry, but it seems like the following error has interrupted our application:", "wordpress-seo" ) }</p>
			<Alert variant="error">{ error?.message || "Undefined error message." }</Alert>
			<p>{ __( "Unfortunately, this means that all your unsaved changes will be lost. You can try and refresh this page to resolve the problem. If this error still occurs, please get in touch with our support team, and we'll get you all the help you need!", "wordpress-seo" ) }</p>
			<div className="yst-flex yst-gap-2">
				<Button onClick={ handleRefreshClick }>{ __( "Refresh this page", "wordpress-seo" ) }</Button>
				<Button variant="secondary" as="a" href={ supportLink } target="blank" rel="noreferrer">
					{ __( "Contact support", "wordpress-seo" ) }
				</Button>
			</div>
		</div>
	);
};

ErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};

export default ErrorFallback;
