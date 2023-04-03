import { useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, Button, Title } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * @param {Object} error The error instance.
 * @returns {JSX.Element} The element.
 */
const RouteErrorFallback = ( { error } ) => {
	const handleRefreshClick = useCallback( () => window?.location?.reload(), [] );

	return (
		<div role="alert" className="yst-max-w-screen-sm yst-p-8 yst-space-y-4">
			<Title>{ __( "Something went wrong. An unexpected error occurred.", "wordpress-seo" ) }</Title>
			<p>{ __( "We're very sorry, but it seems like the following error has interrupted our application:", "wordpress-seo" ) }</p>
			<Alert variant="error">{ error?.message || "Undefined error message." }</Alert>
			<p>{ __( "Unfortunately, this means that all your unsaved changes will be lost. You can try and refresh this page to resolve the problem.", "wordpress-seo" ) }</p>
			<div className="yst-flex yst-gap-2">
				<Button onClick={ handleRefreshClick }>{ __( "Refresh this page", "wordpress-seo" ) }</Button>
			</div>
		</div>
	);
};

RouteErrorFallback.propTypes = {
	error: PropTypes.object.isRequired,
};

export default RouteErrorFallback;
